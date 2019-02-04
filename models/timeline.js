const Sequelize = require('sequelize');
const Milestone = require('./milestone.js');

const connection = new Sequelize('thepath', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false
});
//Define the model
const Timeline = connection.define('timeline', {
    Goal: Sequelize.TEXT
});
Timeline.hasMany(Milestone);
Milestone.belongsTo(Timeline);

//create table
connection.sync()
    .then(() => console.log(`Timeline table been created!`))
    .catch((error) => console.log(`couldn't create a table, here is the error: ${error.stack}`));

    module.exports = Timeline;