

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

//var tables='c'

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'DeviceData'+ '` ( \
  `DeviceDataID` INT NOT NULL AUTO_INCREMENT, \
      `sDeviceID` VARCHAR(45) NULL, \
  `sCatelog` VARCHAR(45) NULL, \
  `sCidtVersion` VARCHAR(45) NULL, \
  `sManufacter` VARCHAR(45) NULL, \
  `sBrands` VARCHAR(45) NULL, \
  `sModels` VARCHAR(45) NULL, \
  `sSoftwareVersion` VARCHAR(45) NULL, \
  `sActivityNo` VARCHAR(45) NULL, \
  `sctivity` VARCHAR(45) NULL, \
  `sDateTime` VARCHAR(45) NULL, \
  `sTotalVileage` VARCHAR(45) NULL, \
  `sWorkingTime` VARCHAR(45) NULL, \
  PRIMARY KEY (`DeviceDataID`), \
    UNIQUE INDEX `DeviceDataID_UNIQUE` (`DeviceDataID` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
