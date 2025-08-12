const sequelize = require('../config/db');
const User = require('./user');
const Order = require('./order');
const Log = require('./log');

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// connect to the database and log the version
sequelize.authenticate().then(() => {
  console.log("Connected to database");
  sequelize.sync({ force: false }).then(() => {
    console.log("Database synced");
  });
}).catch(err => {
  console.error("Unable to connect to the database:", err);
});

// Export the models for use in other parts of the application
module.exports = {
  User,
  Order,
  Log,
};