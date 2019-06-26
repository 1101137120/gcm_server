

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

//var tables='c'

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'deviceData'+ '` ( \
  `sDeviceID` INT(8) NOT NULL, \
      `sBrands` VARCHAR(32) NULL, \
  `sModels` VARCHAR(32) NULL, \
  `sSerialNumber` VARCHAR(8) NULL, \
  `sCatelog` VARCHAR(1) NULL, \
  `sCidtVersion` VARCHAR(1) NULL, \
  `sManufacterA` VARCHAR(32) NULL, \
  `sManufacterB` VARCHAR(32) NULL, \
  `sSoftwareVersion` VARCHAR(4) NULL, \
  `sActivity` VARCHAR(2) NULL, \
  `sSEID` VARCHAR(6) NULL, \
  `sctivity` VARCHAR(1) NULL, \
  `sDateTime` DATETIME NULL, \
  `iRealDataRate` VARCHAR(1) NULL, \
  `iEnvirDataRate` VARCHAR(1) NULL, \
  `sTotalVileage` VARCHAR(6) NULL, \
  `sWorkingTime` VARCHAR(8) NULL, \
  `sEnableDate` VARCHAR(1) NULL, \
  `sCheck` VARCHAR(1) NULL, \
  PRIMARY KEY (`sDeviceID`), \
    UNIQUE INDEX `sDeviceID_UNIQUE` (`sDeviceID` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
