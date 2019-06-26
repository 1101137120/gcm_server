

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

//var tables='c'

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'DeviceRecordInfo'+ '` ( \
  `DeviceRecordInfoID` INT  NULL, \
      `sActivityNo` INT(11) NOT NULL, \
  `sActivityName` VARCHAR(45) NULL, \
  PRIMARY KEY (`sActivityNo`), \
    UNIQUE INDEX `sActivityNo_UNIQUE` (`sActivityNo` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
