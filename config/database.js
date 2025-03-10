const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('vcms', 'root', 'Mohansanty@7', {
  host: 'localhost', 
  dialect: 'mysql', // Change to 'postgres' or 'sqlite' if needed
  logging: false, // Set to true to see raw SQL queries in the console
});

module.exports = sequelize;
