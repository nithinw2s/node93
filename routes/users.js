var express = require("express");
var router = express.Router();
var userController = require("../controllers/userController");
const useModel = require("../models/userModel");
const db = require("../config/db");

/* GET users listing. */
// router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users");
    console.log("🚀 ~ rows:", rows);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO users (name, email) VALUES (?,?)",
      [name, email]
    );
    res.status(201).json({ id: result.insertId, name, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
