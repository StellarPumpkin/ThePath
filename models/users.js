const Sequelize = require('sequelize');
const Timeline = require('./timeline.js');

const connection = new Sequelize('thepath', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false
});
//Define the model
const User = connection.define('user', {
    username: Sequelize.TEXT,
    email: Sequelize.TEXT,
    password: Sequelize.TEXT   
});
User.hasMany(Timeline);
Timeline.belongsTo(User);

//create table
connection.sync()
    .then(() => console.log(`User table been created!`))
    .catch((error) => console.log(`couldn't create a table, here is the error: ${error.stack}`));

    module.exports = User;