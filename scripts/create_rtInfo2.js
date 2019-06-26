var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

//var tables='c'

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'rtInfo'+ '` ( \
  `RtInfoSumID` INT(11) NOT NULL , \
      `dEncoding` INT(10) NULL, \
  `rtDate` DATETIME NULL, \
  `rtTime` VARCHAR(8) NULL, \
  `rtMask` VARCHAR(4) NULL, \
  `rtSpeed` VARCHAR(4) NULL, \
  `rtRV` VARCHAR(4) NULL, \
  `rtTime2` VARCHAR(4) NULL, \
  `rtMiles` VARCHAR(4) NULL, \
  `rtHR` VARCHAR(4) NULL, \
  `rtRPM` VARCHAR(4) NULL, \
  `rtCal` VARCHAR(4) NULL, \
  `rtWatt` VARCHAR(4) NULL, \
  `rtFAT` VARCHAR(4) NULL, \
  `iFTP` VARCHAR(4) NULL, \
  `rtCHO` VARCHAR(4) NULL, \
  PRIMARY KEY (`RtInfoSumID`), \
    UNIQUE INDEX `RtInfoSumID_UNIQUE` (`RtInfoSumID` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
