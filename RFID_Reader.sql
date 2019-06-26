-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 31, 2018 at 03:40 PM
-- Server version: 5.5.40-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `RFID_Reader`
--

-- --------------------------------------------------------

--
-- Table structure for table `chinNum_Reader`
--

CREATE TABLE IF NOT EXISTS `chinNum_Reader` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `date` varchar(45) DEFAULT NULL,
  `time` varchar(45) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `chinNum_Reader`
--

INSERT INTO `chinNum_Reader` (`id`, `date`, `time`, `status`) VALUES
(1, '2018/08/28', '13 : 37 : 40', 0),
(2, '2018/08/28', '13 : 38 : 28', 0),
(3, '2018/08/28', '13 : 47 : 50', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ChinNum_Reader_data`
--

CREATE TABLE IF NOT EXISTS `ChinNum_Reader_data` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `TagID` varchar(30) NOT NULL,
  `chinID` int(10) NOT NULL,
  `result` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `ChinNum_Reader_data`
--

INSERT INTO `ChinNum_Reader_data` (`id`, `date`, `time`, `TagID`, `chinID`, `result`) VALUES
(1, '2018-08-28', '00:00:13', 'D3F38412E8808440000000', 3, ''),
(4, '2018-08-15', '00:00:12', 'ddddddddad3', 3, 'afsafasf'),
(5, '2018-08-15', '00:00:12', 'ddddddddad3', 3, 'afsafasf'),
(7, NULL, NULL, 'adasd', 3, '345ff');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
