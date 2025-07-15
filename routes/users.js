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
    const [rows] = await db.execute("SELECT * FROM new_table");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post("/", async (req, res) => {
  const { id = 1, firstName, lastName, city } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO new_table (id, firstName, lastName, city) VALUES (?, ?, ?, ?)",
      [id, firstName, lastName, city]
    );
    res.status(201).json({ id: result.insertId, firstName, lastName, city });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
