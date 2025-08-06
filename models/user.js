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
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
},
  {
    tableName: 'users',
    timestamps: false, // Disable timestamps if not needed
    underscored: true, // Use snake_case for column names
  }
);

module.exports = User;
