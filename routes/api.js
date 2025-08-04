const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");

// User routes
router.post("/users", userController.createUser);
router.get("/users", userController.getAllUsers);

// Order routes
router.post("/orders", orderController.createOrder);
router.get("/orders", orderController.getAllOrders);

module.exports = router;