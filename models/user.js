const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');


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
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password cannot be empty' },
      len: { args: [6, 255], msg: 'Password must be at least 6 characters long' },
    },
  },
  otp: {
    type: DataTypes.MEDIUMINT,
    allowNull: true,
    validate: {
      isNumeric: {
        msg: "OTP must be a number"
      },
      len: {
        args: [4, 6],
        msg: "OTP must be 4 to 6 digits long"
      }
    }
  },
  is_registered: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: "Expires at must be a valid date"
      },
      notEmpty: {
        msg: "Expires at cannot be empty"
      }
    }
  }
},
  {
    tableName: 'users',
    timestamps: false, // Disable timestamps if not needed
    underscored: true, // Use snake_case for column names
    hooks:{
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
    logging: (msg) => {
      console.log(`[Sequelize Query]: ${msg}`);
    }
  }
);

module.exports = User;
