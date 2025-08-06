const { Sequelize } = require("sequelize");

// mysql://user:password@host:port/database

const sequelize = new Sequelize("mysql://root:root@localhost:3306/testdb93", {
  dialect: "mysql",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize; // export the sequelize instance
