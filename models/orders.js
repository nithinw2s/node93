const db = require("../config/db");

class Order {
  // Add a new order
  static async create(user_id, product_name, order_date) {
    try {
      const [result] = await db.query(
        "INSERT INTO orders (user_id, product_name, order_date) VALUES (?, ?, ?)",
        [user_id, product_name, order_date]
      );
      return { order_id: result.insertId, user_id, product_name, order_date };
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  // Get all orders with user details
  static async findAll() {
    try {
      const [rows] = await db.query(
        "SELECT orders.order_id, orders.product_name, orders.order_date, users.name " +
        "FROM orders JOIN users ON orders.user_id = users.id"
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }
}

module.exports = Order;