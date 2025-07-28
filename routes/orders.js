var express = require("express");
var router = express.Router();
const db = require("../config/db");

// GET all orders
router.get("/", async (req, res) => {
  console.log("🚀 ~ req:", req);
  try {
    const [rows] = await db.execute("SELECT * FROM orders");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET order by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM orders WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new order
router.post("/", async (req, res) => {
  const { userId, product, date } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO orders (user_id, product_name, order_date) VALUES (?, ?, ?)",
      [userId, product, date]
    );
    res.status(201).json({ id: result.insertId, userId, product, date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
