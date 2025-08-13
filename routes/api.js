const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Auth routes (public)
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);
router.post('/change-password', auth, authController.changePassword);
router.post('/forgot-password', authController.forgetPassword);
router.post('/reset-password/otp-verify', authController);

// Middleware to protect routes
router.get("/users", auth, userController.getAllUsers);
router.get("/users/top-ten", auth, userController.getTopTenUsers);
router.get("/user/:id", auth, userController.getUserById);
router.put("/user/:id", auth, userController.updateUserEmail);

// Order routes
router.use(auth); // Protect order routes
router.get("/orders", orderController.getAllOrders);
router.get("/orders/user/:userId", orderController.getOrdersByUserId);
router.post("/order", orderController.createOrder);
router.delete("/order/:id", orderController.deleteOrder);

module.exports = router;