

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

//var tables='c'

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'RtSInfo'+ '` ( \
  `RtSInfoID` INT NOT NULL AUTO_INCREMENT, \
      `dEncoding` VARCHAR(45) NULL, \
  `rtDate` VARCHAR(45) NULL, \
  `rtTime` VARCHAR(45) NULL, \
  `rtMStatus` VARCHAR(45) NULL, \
  `rtSurroundings` VARCHAR(45) NULL, \
  PRIMARY KEY (`RtSInfoID`), \
    UNIQUE INDEX `RtInfoID_UNIQUE` (`RtSInfoID` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
