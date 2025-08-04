const db = require("../config/db");

class User {
  // Add a new user
  static async create(name, email) {
    try {
      const [result] = await db.query(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [name, email]
      );
      return { id: result.insertId, name, email };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Get all users
  static async findAll() {
    try {
      const [rows] = await db.query("SELECT * FROM users");
      return rows;
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }
}

module.exports = User;