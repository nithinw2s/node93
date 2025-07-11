var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
const useModel = require('../models/userModel');

/* GET users listing. */
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
