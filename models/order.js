const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define(
  'Order',
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Reference to the User model
        key: 'id',
      },
      validate: {
        isInt: {
          msg: "User ID must be an integer"
        },
        /**
         * Custom validation to check if user exists
         * This will throw an error if the user ID does not exist in the User table.
         */
        isValidUserId(value) {
          return sequelize.models.User.findByPk(value)
          .then(user => {
              console.log("🚀 ~ isValidUserId ~ user:", user)
              if (!user) {
                throw new Error("User ID does not exist");
              }
            });
        }
      },
    },
    product_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Product name cannot be empty' },
      len: { args: [2, 100], msg: 'Product name must be 2-100 characters long' },
      }
    },
    order_date: {
      type:DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    tableName: 'orders',
    timestamps: false, // Disable timestamps if not needed
    underscored: true, // Use snake_case for column names
  }
);

module.exports = Order;