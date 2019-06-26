

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'SportsInfo' + '` (\
      `SportsInfoID` INT NOT NULL AUTO_INCREMENT, \
  `DataName` VARCHAR(45) NULL, \
  `dStartDate` VARCHAR(45) NULL, \
  `dStartTime` VARCHAR(45) NOT NULL, \
  `dExerciseTime` VARCHAR(45) NULL, \
  `uClientID` VARCHAR(45) NULL, \
  `sDeviceID` INT NULL, \
  `dEncoding` VARCHAR(2) NULL, \
  `dUnits` VARCHAR(4) NULL, \
  `rtAppMessage` VARCHAR(4) NULL, \
  PRIMARY KEY (`SportsInfoID`), \
    UNIQUE INDEX `SportsInfoID_UNIQUE` (`SportsInfoID` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
