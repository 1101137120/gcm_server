

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

//var tables='c'

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'RtInfoSum'+ '` ( \
  `RtInfoSumID` INT NOT NULL AUTO_INCREMENT, \
      `dEncoding` VARCHAR(45) NULL, \
  `SportsTime` VARCHAR(45) NULL, \
  `Miles` VARCHAR(45) NULL, \
  `Cal` VARCHAR(45) NULL, \
  `Watt` VARCHAR(45) NULL, \
  `MaxWatt` VARCHAR(45) NULL, \
  `MaxR` VARCHAR(45) NULL, \
  `MaxS` VARCHAR(45) NULL, \
  `MaxH` VARCHAR(45) NULL, \
  `rtRD` VARCHAR(45) NULL, \
  `AW` VARCHAR(45) NULL, \
  `AR` VARCHAR(45) NULL, \
  `ASS` VARCHAR(45) NULL, \
  `AH` VARCHAR(45) NULL, \
  `StartTime` VARCHAR(45) NULL, \
  `uClientID` VARCHAR(45) NULL, \
  PRIMARY KEY (`RtInfoSumID`), \
    UNIQUE INDEX `RtInfoSumID_UNIQUE` (`RtInfoSumID` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
