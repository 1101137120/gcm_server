

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'userData' + '` (\
      `uClientID` INT NOT NULL AUTO_INCREMENT, \
  `userName` VARCHAR(32) NULL, \
  `userID` VARCHAR(18) NULL,\
  `userPassword` VARCHAR(10) NULL,\
  `uCountry` VARCHAR(32) NULL,\
  `uCity` VARCHAR(32) NULL,\
  `uAge` VARCHAR(2) NULL,\
  `uSex` VARCHAR(2) NULL,\
  `uHeight` VARCHAR(4) NULL,\
  `uWeight` VARCHAR(4) NULL,\
  `uRegisteredDate` DATETIME NULL,\
  `uImagePhoto` VARCHAR(8) NULL,\
  `uCheck` VARCHAR(1) NULL,\
  PRIMARY KEY (`uClientID`) \
)');

console.log('Success: Database Created!')

connection.end();
