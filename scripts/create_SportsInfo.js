

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

//var tables='c'

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'SportsInfo'+ '` ( \
  `SportsInfoID` INT NOT NULL AUTO_INCREMENT, \
      `DataName` VARCHAR(45) NULL, \
  `dStartDate` VARCHAR(45) NULL, \
  `dStartTime` VARCHAR(45) NULL, \
  `dExerciseTime` VARCHAR(45) NULL, \
  `uClientID` INT NULL, \
  `sDeviceID` VARCHAR(45) NULL, \
  `dEncoding` VARCHAR(45) NULL, \
  `dUnits` VARCHAR(2) NULL, \
  `rtAppMessage` VARCHAR(45) NULL, \
  PRIMARY KEY (`SportsInfoID`), \
    UNIQUE INDEX `SportsInfoID_UNIQUE` (`SportsInfoID` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
