const { where } = require("sequelize");
const { User } = require("../models/index");
const { options } = require("../routes/api");

exports.getUsers = async (req, res, options = {}) => {
  try {
    const users = await User.findAll(options);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopTenUsers = async (req, res) => {
  exports.getUsers(req, res, {
    where: { id: { [require('sequelize').Op.lt]: 10 } } }
  );
};

exports.getAllUsers = async (req, res) => {
  exports.getUsers(req, res, {
    order: [['id', 'ASC']],
  });
};

exports.getUserById = async (req, res) => {
  exports.getUsers(req, res, {
    where: { id: req.params.id },
    limit: 1,
  });
};

exports.updateUserEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.email = email;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


