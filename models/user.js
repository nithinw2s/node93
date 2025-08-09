const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const dbVersion = sequelize.databaseVersion()
console.log(`Connected to database version: ${dbVersion}`);

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate:{
      notEmpty: {
        msg: "Name cannot be empty"
      },
      len: {
        args:[2, 100],
        msg: "Name must be between 2 and 100 characters"
      },
    }
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isEmail:{
        msg: "Email must be a valid email address"
      },
      notEmpty: {
        msg: "Email cannot be empty"
      }
    }
  },
},
  {
    tableName: 'users',
    timestamps: false, // Disable timestamps if not needed
    underscored: true, // Use snake_case for column names
  }
);

module.exports = User;
