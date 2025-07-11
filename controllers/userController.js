const useModel = require('../models/userModel');

// Function to get all users
exports.getAllUsers = (req, res) => {
  const users = useModel.getAllUsers();
  res.render("users", { users });
};

// Function to get a user by ID
exports.getUserById = (req, res) => {
  const user = useModel.getUserById(parseInt(req.params.id, 10));
  if (user) {
    res.render("users", { user });;
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};