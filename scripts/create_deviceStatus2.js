

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

//var tables='c'

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'deviceStatus'+ '` ( \
  `iddeviceStatus` INT(11)  NULL, \
      `sDeviceID` INT(8) NULL, \
  `rtDate` VARCHAR(10) NULL, \
  `rtTime` VARCHAR(8) NULL, \
  `rtMStatus` VARCHAR(10) NULL, \
  `repaireNo` VARCHAR(6 NOT NULL, \
  PRIMARY KEY (`repaireNo`), \
    UNIQUE INDEX `repaireNo_UNIQUE` (`repaireNo` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
