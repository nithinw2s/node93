const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");

// User routes
router.post("/users", userController.createUser);
router.get("/users", userController.getAllUsers);
router.get("/users/top-ten", userController.getTopTenUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUserEmail);

// Order routes
router.post("/orders", orderController.createOrder);
router.get("/orders", orderController.getAllOrders);
router.get("/orders/user/:userId", orderController.getOrdersByUserId);
router.delete("/orders/:id", orderController.deleteOrder);

module.exports = router;