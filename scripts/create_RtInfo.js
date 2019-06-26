

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

//var tables='c'

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'RtInfo'+ '` ( \
  `RtInfoID` INT NOT NULL AUTO_INCREMENT, \
      `dEncoding` VARCHAR(45) NULL, \
  `rtDate` VARCHAR(45) NULL, \
  `rtTime` VARCHAR(45) NULL, \
  `rtHeartBeat` VARCHAR(45) NULL, \
  `rtMiles` VARCHAR(45) NULL, \
  `rtSPD` VARCHAR(45) NULL, \
  `rtCounts` VARCHAR(45) NULL, \
  `rtSPM` VARCHAR(45) NULL, \
  `rtCal` VARCHAR(45) NULL, \
  `rtRD` VARCHAR(45) NULL, \
  `rtIncline` VARCHAR(45) NULL, \
  `rtWatt` VARCHAR(45) NULL, \
  `rtTorque` VARCHAR(45) NULL, \
  `rtIntensity` VARCHAR(45) NULL, \
  `rtWeight` VARCHAR(45) NULL, \
  PRIMARY KEY (`RtInfoID`), \
    UNIQUE INDEX `RtInfoID_UNIQUE` (`RtInfoID` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
