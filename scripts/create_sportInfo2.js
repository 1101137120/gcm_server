var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);



//connection.query('CREATE DATABASE ' + dbconfig.database);


connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'sportsInfo'+ '` ( \
  `SportsInfoID` INT NOT NULL AUTO_INCREMENT, \
      `uClientID` INT(8) NULL, \
  `sDeviceID` INT(8) NULL, \
  `dStartDate` DATETIME NULL, \
  `dStartTime` VARCHAR(8) NULL, \
  `DataName` VARCHAR(32) NULL, \
  `dExerciseTime` VARCHAR(8) NULL, \
  `dUnits` VARCHAR(1) NULL, \
  `rtAppMessage` VARCHAR(10) NULL, \
  `dEncoding` INT(10) NULL, \
  `rtDataRate` VARCHAR(1) NULL, \
  `rtDSRate` VARCHAR(1) NULL, \
  PRIMARY KEY (`SportsInfoID`), \
    UNIQUE INDEX `SportsInfoID_UNIQUE` (`SportsInfoID` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
