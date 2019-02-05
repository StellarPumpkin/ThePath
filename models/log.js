const Sequelize = require('sequelize');

const connection = new Sequelize('thepath', 'Elena', 'BardYlvisaker', {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false
});
//Define the model
const Log = connection.define('log', {
    textInput: Sequelize.TEXT,
    datLog: Sequelize.DATE,
    image: Sequelize.BLOB
    
    
});

//create table
connection.sync()
    .then(() => console.log(`Logs table been created!`))
    .catch((error) => console.log(`couldn't create a table, here is the error: ${error.stack}`));

    module.exports = Log;


    <input type="hidden" value="<%= milestoneId%>"/>