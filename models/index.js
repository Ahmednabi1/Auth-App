'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);       // Get the name of the current file.
const env = process.env.NODE_ENV || 'development';      //reasure its set to development
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  //if use_env_variable is set, then we use it to connect to the database
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} 
else {
  //otherwise we get back to config to connect
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


//fixing the error (models not being loaded)
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && //ignore hidden files
      file !== basename &&      //ignore the current file
      file.slice(-3) === '.js' &&   //get only the js files
      file.indexOf('.test.js') === -1 //ignore test files
    );
  })

  //link models to database
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

  //set associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;