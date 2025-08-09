const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");

// User routes
router.post("/user", userController.createUser);
router.get("/users", userController.getAllUsers);
router.get("/users/top-ten", userController.getTopTenUsers);
router.get("/user/:id", userController.getUserById);
router.put("/user/:id", userController.updateUserEmail);

// Order routes
router.post("/order", orderController.createOrder);
router.get("/orders", orderController.getAllOrders);
router.get("/orders/user/:userId", orderController.getOrdersByUserId);
router.delete("/order/:id", orderController.deleteOrder);

module.exports = router;