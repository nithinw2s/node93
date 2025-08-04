const Order = require("../models/orders");

exports.createOrder = async (req, res) => {
  try {
    const { user_id, product_name, order_date } = req.body;
    if (!user_id || !product_name || !order_date) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const order = await Order.create(user_id, product_name, order_date);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};