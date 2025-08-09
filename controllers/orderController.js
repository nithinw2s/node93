const { Order, User } = require('../models/index');
const { options } = require('../routes/api');

exports.createOrder = async (req, res) => {
  try {
    const { user_id, product_name, order_date } = req.body;
    if (!user_id || !product_name || !order_date) {
      return res.status(400).json({ error: "User ID, product name, and order date are required" });
    }
    const order = await Order.create({ user_id, product_name, order_date });
    res.status(201).json(order);
  } catch (error) {
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
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    await order.destroy();
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
