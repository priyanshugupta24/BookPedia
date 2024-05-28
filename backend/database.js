const dotenv = require('dotenv').config();
const { Sequelize } = require('sequelize');

const DATABASEPG = process.env.DATABASEPG;
const USERNAMEPG = process.env.USERNAMEPG;
const PASSWORD = process.env.PASSWORD;

const sequelize = new Sequelize(DATABASEPG,USERNAMEPG,PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
});

const postgreSQLConnect = async() =>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully for PostgreSQL.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize,postgreSQLConnect };