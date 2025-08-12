const sequelize = require('../config/db');
const { Order, User, Log } = require('../models/index');
const { options } = require('../routes/api');

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { user_id, product_name, order_date } = req.body;
    if (!user_id || !product_name || !order_date) {
      await t.rollback();
      return res.status(400).json({ error: "User ID, product name, and order date are required" });
    }

    // create the user
    const order = await Order.create({ user_id, product_name, order_date }, { transaction: t});
    
    // create a log entry
    await Log.create({
      action: `Order created for user ID ${user_id}`,
      created_at: new Date(),
    }, { transaction: t });

    await t.commit();
    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, attributes: ["name"] }],
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.params.userId },
      include: [{ model: User, attributes: [["name", "user_name"]] }],
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      await t.rollback();
      return res.status(404).json({ error: "Order not found" });
    }
    await order.destroy();
    await Log.create({
      action: `Order deleted with ID ${req.params.id}`,
      created_at: new Date(),
    }, { transaction: t });
    await t.commit();
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};
