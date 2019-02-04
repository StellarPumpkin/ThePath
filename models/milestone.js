const Sequelize = require('sequelize');
//const Timeline = require('./timeline.js');

const connection = new Sequelize('thepath', 'Elena', 'BardYlvisaker', {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false
});
//Define the model
const Milestone = connection.define('milestone', {
    Body: Sequelize.TEXT
    //Status: Sequelize.BOOLEAN, 
    //Completiontext: Sequelize.TEXT,
    //Order_number: Sequelize.INTEGER
});
//Milestone.belongsTo(Timeline);

//create table
connection.sync()
    .then(() => console.log(`Timeline table been created!`))
    .catch((error) => console.log(`couldn't create a table, here is the error: ${error.stack}`));

    module.exports = Milestone;