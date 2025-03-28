/*
SQLyog Enterprise - MySQL GUI v8.1 
MySQL - 5.5.5-10.4.32-MariaDB : Database - stvno
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/`stvno` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;

USE `stvno`;

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `product_details` text NOT NULL,
  `product_code` varchar(20) NOT NULL,
  `product_price` double NOT NULL,
  `product_category` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `products` */

insert  into `products`(Id,product_details,product_code,product_price,product_category) values (1,'Wireless Mouse','WM1001',15.99,'Accessories'),(2,'Gaming Keyboard','GK2002',49.99,'Accessories'),(3,'Bluetooth Speaker','BS3003',29.99,'Electronics'),(4,'Smartphone X1','SP4004',699.99,'Smartphone'),(5,'Laptop Pro 15','LP5005',1299.99,'Laptop'),(6,'Noise Cancelling Headphones','NH6006',199.99,'Accessories'),(7,'4K LED TV 55\"','TV7007',799.99,'Electronics'),(8,'Tablet Air 10','TA8008',499.99,'Tablet'),(9,'USB-C Charger 65W','UC9009',39.99,'Accessories'),(10,'Smart Watch Series 5','SW1010',299.99,'Wearables'),(11,'External Hard Drive 1TB','HD1011',89.99,'Storage'),(12,'Wireless Earbuds','WE1012',99.99,'Accessories'),(13,'Gaming Laptop RTX3060','GL1013',1499.99,'Laptop'),(14,'Mechanical Keyboard RGB','MK1014',79.99,'Accessories'),(15,'Smartphone Y2','SP1015',799.99,'Smartphone'),(16,'Gaming Monitor 144Hz','GM1016',249.99,'Monitor'),(17,'Smart Home Hub','SH1017',129.99,'Smart Home'),(18,'Robot Vacuum Cleaner','RV1018',349.99,'Home Appliances'),(19,'Portable Power Bank 20000mAh','PB1019',49.99,'Accessories'),(20,'Wireless Charging Pad','WC1020',29.99,'Accessories'),(21,'Dash Cam HD','DC1021',79.99,'Automotive'),(22,'Electric Scooter','ES1022',699.99,'Transportation'),(23,'Smart Light Bulb','LB1023',19.99,'Smart Home'),(24,'Wireless Router AX6000','WR1024',229.99,'Networking'),(25,'Desktop PC Intel i7','PC1025',999.99,'Computer'),(26,'Fitness Tracker','FT1026',149.99,'Wearables'),(27,'VR Headset','VR1027',399.99,'Gaming'),(28,'Smart Lock','SL1028',179.99,'Smart Home'),(29,'Car Dash Camera 4K','CD1029',129.99,'Automotive'),(30,'Home Security Camera','SC1030',99.99,'Security'),(31,'Bluetooth Keyboard','BK1031',49.99,'Accessories'),(32,'Smart Fridge','SF1032',1999.99,'Home Appliances'),(33,'Portable Bluetooth Speaker','PS1033',59.99,'Audio'),(34,'Tablet Mini 8','TM1034',399.99,'Tablet'),(35,'Gaming Headset','GH1035',119.99,'Accessories'),(36,'Laptop Stand','LS1036',34.99,'Accessories'),(37,'Foldable Smartphone','FS1037',1299.99,'Smartphone'),(38,'5.1 Home Theater System','HT1038',499.99,'Audio'),(39,'Mini Projector','MP1039',199.99,'Electronics'),(40,'Drone with 4K Camera','DR1040',899.99,'Drones'),(41,'Smart Doorbell','SD1041',149.99,'Smart Home'),(42,'Car Jump Starter','CJ1042',89.99,'Automotive'),(43,'Portable Air Compressor','AC1043',79.99,'Automotive'),(44,'Graphics Card RTX4080','GC1044',1499.99,'Computer Components'),(45,'Gaming Console','GC1045',499.99,'Gaming'),(46,'Wireless Game Controller','WGC1046',59.99,'Gaming'),(47,'4TB External SSD','SSD1047',349.99,'Storage'),(48,'DJI Drone Pro','DJI1048',1199.99,'Drones'),(49,'Android Tablet Pro','ATP1049',699.99,'Tablet'),(50,'Security Alarm System','SA1050',249.99,'Security');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'admin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `users` */

insert  into `users`(id,username,password,role) values (1,'admin','admin123','admin');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
