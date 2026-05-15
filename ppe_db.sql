-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ppe
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add employee',7,'add_employee'),(26,'Can change employee',7,'change_employee'),(27,'Can delete employee',7,'delete_employee'),(28,'Can view employee',7,'view_employee'),(29,'Can add alert log',8,'add_alertlog'),(30,'Can change alert log',8,'change_alertlog'),(31,'Can delete alert log',8,'delete_alertlog'),(32,'Can view alert log',8,'view_alertlog');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard_alertlog`
--

DROP TABLE IF EXISTS `dashboard_alertlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dashboard_alertlog` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `unknown_person` tinyint(1) NOT NULL,
  `violation_type` varchar(255) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `employee_id` bigint DEFAULT NULL,
  `snapshot` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dashboard_alertlog_employee_id_bd810320_fk_dashboard_employee_id` (`employee_id`),
  CONSTRAINT `dashboard_alertlog_employee_id_bd810320_fk_dashboard_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `dashboard_employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1635 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard_alertlog`
--

LOCK TABLES `dashboard_alertlog` WRITE;
/*!40000 ALTER TABLE `dashboard_alertlog` DISABLE KEYS */;
INSERT INTO `dashboard_alertlog` VALUES (1163,1,'Missing Hardhat','2026-04-30 16:36:56.928660',NULL,'alerts/a_56e9f79e.jpg'),(1164,0,'Missing Safety Vest','2026-04-30 16:37:06.693849',3,'alerts/a_2ead313e.jpg'),(1165,0,'Missing Hardhat','2026-04-30 16:37:06.709776',3,'alerts/a_7280a3e2.jpg'),(1166,0,'Missing Mask','2026-04-30 16:37:06.724882',3,'alerts/a_3e9d546a.jpg'),(1167,0,'Missing Safety Vest','2026-04-30 16:37:18.264551',3,'alerts/a_4c5dad44.jpg'),(1168,0,'Missing Hardhat','2026-04-30 16:37:18.284834',3,'alerts/a_02ea96ee.jpg'),(1169,0,'Missing Mask','2026-04-30 16:37:18.304033',3,'alerts/a_bded6157.jpg'),(1170,0,'Missing Safety Vest','2026-04-30 16:37:30.536388',3,'alerts/a_c8139d95.jpg'),(1171,0,'Missing Hardhat','2026-04-30 16:37:30.560202',3,'alerts/a_4ebe4986.jpg'),(1172,0,'Missing Mask','2026-04-30 16:37:30.578695',3,'alerts/a_acf65930.jpg'),(1173,0,'Missing Safety Vest','2026-04-30 16:37:44.675326',3,'alerts/a_abc7fd9c.jpg'),(1174,0,'Missing Mask','2026-04-30 16:37:44.688354',3,'alerts/a_30f9b9d7.jpg'),(1175,0,'Missing Hardhat','2026-04-30 16:37:44.700945',3,'alerts/a_aaee125a.jpg'),(1176,0,'Missing Safety Vest','2026-04-30 16:37:59.752217',3,'alerts/a_79836642.jpg'),(1177,0,'Missing Mask','2026-04-30 16:37:59.767926',3,'alerts/a_edf502fe.jpg'),(1178,0,'Missing Hardhat','2026-04-30 16:37:59.783509',3,'alerts/a_ef46771a.jpg'),(1179,0,'Missing Safety Vest','2026-04-30 16:38:12.424057',3,'alerts/a_1726808c.jpg'),(1180,0,'Missing Mask','2026-04-30 16:38:12.445444',3,'alerts/a_09d7be11.jpg'),(1181,0,'Missing Hardhat','2026-04-30 16:38:12.464429',3,'alerts/a_ba3d8e55.jpg'),(1182,0,'Missing Safety Vest','2026-04-30 16:38:23.356090',3,'alerts/a_1b74dabd.jpg'),(1183,0,'Missing Hardhat','2026-04-30 16:38:23.369274',3,'alerts/a_3c8dfca7.jpg'),(1184,0,'Missing Mask','2026-04-30 16:38:23.381837',3,'alerts/a_925db329.jpg'),(1185,0,'Missing Hardhat','2026-04-30 16:38:35.181061',3,'alerts/a_6823f222.jpg'),(1186,0,'Missing Mask','2026-04-30 16:38:35.202749',3,'alerts/a_7877b48c.jpg'),(1187,1,'Missing Hardhat','2026-04-30 16:38:51.009014',NULL,'alerts/a_3a2c152f.jpg'),(1188,1,'Missing Safety Vest','2026-04-30 16:39:08.961014',NULL,'alerts/a_4c5c789f.jpg'),(1189,1,'Missing Safety Vest','2026-04-30 16:39:28.447334',NULL,'alerts/a_3a954089.jpg'),(1190,1,'Missing Hardhat','2026-04-30 16:39:28.461928',NULL,'alerts/a_62a3bfa2.jpg'),(1191,1,'Missing Safety Vest','2026-04-30 16:39:40.640797',NULL,'alerts/a_d4f0feb4.jpg'),(1192,1,'Missing Mask','2026-05-01 14:24:37.377565',NULL,'alerts/a_17b54c62.jpg'),(1193,1,'Missing Safety Vest','2026-05-01 14:24:37.393077',NULL,'alerts/a_e9eab3d4.jpg'),(1194,1,'Missing Safety Vest','2026-05-01 14:25:01.054636',NULL,'alerts/a_f6335106.jpg'),(1195,0,'Missing Mask','2026-05-01 14:25:13.513416',3,'alerts/a_2ce7328f.jpg'),(1196,0,'Missing Hardhat','2026-05-01 14:25:13.529074',3,'alerts/a_19f0bfba.jpg'),(1197,0,'Missing Safety Vest','2026-05-01 14:25:13.547512',3,'alerts/a_a1870f28.jpg'),(1198,0,'Missing Mask','2026-05-01 14:25:23.869187',3,'alerts/a_ca299424.jpg'),(1199,0,'Missing Safety Vest','2026-05-01 14:25:23.884578',3,'alerts/a_57547888.jpg'),(1200,0,'Missing Hardhat','2026-05-01 14:25:23.899166',3,'alerts/a_3515245a.jpg'),(1201,0,'Missing Safety Vest','2026-05-01 14:25:34.202693',3,'alerts/a_57b30eb9.jpg'),(1202,0,'Missing Hardhat','2026-05-01 14:25:34.224302',3,'alerts/a_8c46c56d.jpg'),(1203,0,'Missing Mask','2026-05-01 14:25:34.241849',3,'alerts/a_959a05d0.jpg'),(1204,0,'Missing Mask','2026-05-01 14:25:45.025089',3,'alerts/a_99b47e19.jpg'),(1205,0,'Missing Hardhat','2026-05-01 14:25:45.037126',3,'alerts/a_97778b72.jpg'),(1206,0,'Missing Safety Vest','2026-05-01 14:25:45.052576',3,'alerts/a_5669a90e.jpg'),(1207,0,'Missing Safety Vest','2026-05-01 14:25:55.988997',3,'alerts/a_640945a3.jpg'),(1208,0,'Missing Mask','2026-05-01 14:25:56.008674',3,'alerts/a_cc11eb7b.jpg'),(1209,0,'Missing Hardhat','2026-05-01 14:25:56.022063',3,'alerts/a_ed9bcf66.jpg'),(1210,0,'Missing Safety Vest','2026-05-01 14:26:07.273624',3,'alerts/a_6a991f02.jpg'),(1211,0,'Missing Mask','2026-05-01 14:26:07.293801',3,'alerts/a_6f5ebd6e.jpg'),(1212,0,'Missing Hardhat','2026-05-01 14:26:07.310543',3,'alerts/a_5bfb8f65.jpg'),(1213,0,'Missing Safety Vest','2026-05-01 14:26:18.287183',3,'alerts/a_b6c68729.jpg'),(1214,0,'Missing Mask','2026-05-01 14:26:18.303340',3,'alerts/a_632733a3.jpg'),(1215,0,'Missing Hardhat','2026-05-01 14:26:18.317634',3,'alerts/a_0051b75c.jpg'),(1216,0,'Missing Safety Vest','2026-05-01 14:26:28.857541',3,'alerts/a_ea6f9d82.jpg'),(1217,0,'Missing Mask','2026-05-01 14:26:28.873774',3,'alerts/a_8fbe92e2.jpg'),(1218,0,'Missing Hardhat','2026-05-01 14:26:28.886103',3,'alerts/a_d6cda3a6.jpg'),(1219,0,'Missing Mask','2026-05-01 14:26:39.810989',3,'alerts/a_43c053e6.jpg'),(1220,0,'Missing Safety Vest','2026-05-01 14:26:39.829176',3,'alerts/a_2ba19e64.jpg'),(1221,0,'Missing Hardhat','2026-05-01 14:26:39.853022',3,'alerts/a_82323e13.jpg'),(1222,0,'Missing Safety Vest','2026-05-01 14:26:51.878115',3,'alerts/a_15128a59.jpg'),(1223,0,'Missing Hardhat','2026-05-01 14:26:51.893248',3,'alerts/a_90c95c61.jpg'),(1224,0,'Missing Mask','2026-05-01 14:26:51.905777',3,'alerts/a_f43814d4.jpg'),(1225,0,'Missing Safety Vest','2026-05-01 14:27:01.368088',3,'alerts/a_82b564ac.jpg'),(1226,0,'Missing Mask','2026-05-01 14:27:01.386079',3,'alerts/a_ed435baf.jpg'),(1227,0,'Missing Hardhat','2026-05-01 14:27:01.404111',3,'alerts/a_8744e3ca.jpg'),(1228,0,'Missing Safety Vest','2026-05-01 14:27:10.725594',3,'alerts/a_6d025248.jpg'),(1229,0,'Missing Mask','2026-05-01 14:27:10.740284',3,'alerts/a_b4e62cb0.jpg'),(1230,0,'Missing Hardhat','2026-05-01 14:27:10.759112',3,'alerts/a_9d429048.jpg'),(1231,0,'Missing Safety Vest','2026-05-01 14:27:20.324986',3,'alerts/a_7181e299.jpg'),(1232,0,'Missing Hardhat','2026-05-01 14:27:20.351611',3,'alerts/a_ff2f3619.jpg'),(1233,0,'Missing Mask','2026-05-01 14:27:20.369063',3,'alerts/a_9c9c3569.jpg'),(1234,0,'Missing Safety Vest','2026-05-01 14:27:29.431142',3,'alerts/a_f07e1b57.jpg'),(1235,0,'Missing Mask','2026-05-01 14:27:29.449397',3,'alerts/a_22e140e8.jpg'),(1236,0,'Missing Hardhat','2026-05-01 14:27:29.467875',3,'alerts/a_86318e70.jpg'),(1237,0,'Missing Mask','2026-05-01 14:27:41.441158',3,'alerts/a_5d340c04.jpg'),(1238,0,'Missing Safety Vest','2026-05-01 14:27:41.460441',3,'alerts/a_a0e9f7e8.jpg'),(1239,0,'Missing Hardhat','2026-05-01 14:27:41.476662',3,'alerts/a_9ca6a4b0.jpg'),(1240,0,'Missing Safety Vest','2026-05-01 14:27:54.733042',3,'alerts/a_75dbd1cd.jpg'),(1241,0,'Missing Mask','2026-05-01 14:27:54.749909',3,'alerts/a_5fd0579f.jpg'),(1242,0,'Missing Hardhat','2026-05-01 14:27:54.764009',3,'alerts/a_f93f8fa4.jpg'),(1243,0,'Missing Safety Vest','2026-05-01 14:28:53.354875',3,'alerts/a_7474051b.jpg'),(1244,0,'Missing Mask','2026-05-01 14:28:53.376245',3,'alerts/a_38319858.jpg'),(1245,0,'Missing Hardhat','2026-05-01 14:28:53.393398',3,'alerts/a_cf08a994.jpg'),(1246,0,'Missing Hardhat','2026-05-01 14:29:06.726325',3,'alerts/a_5a20d857.jpg'),(1247,0,'Missing Mask','2026-05-01 14:29:06.741029',3,'alerts/a_6127b317.jpg'),(1248,0,'Missing Mask','2026-05-01 14:29:16.619097',3,'alerts/a_0d8529d7.jpg'),(1249,0,'Missing Hardhat','2026-05-01 14:29:16.633838',3,'alerts/a_f3dfa7b2.jpg'),(1250,0,'Missing Safety Vest','2026-05-01 14:29:16.647682',3,'alerts/a_7f361094.jpg'),(1251,0,'Missing Mask','2026-05-01 14:29:26.637128',3,'alerts/a_66a99f4e.jpg'),(1252,0,'Missing Hardhat','2026-05-01 14:29:26.649847',3,'alerts/a_177bccac.jpg'),(1253,0,'Missing Safety Vest','2026-05-01 14:29:26.672196',3,'alerts/a_3fa429f6.jpg'),(1254,0,'Missing Safety Vest','2026-05-01 14:29:38.237081',3,'alerts/a_5eb8a391.jpg'),(1255,0,'Missing Hardhat','2026-05-01 14:29:38.266704',3,'alerts/a_dd7e86fa.jpg'),(1256,0,'Missing Mask','2026-05-01 14:29:38.288924',3,'alerts/a_84539afe.jpg'),(1257,0,'Missing Safety Vest','2026-05-01 14:29:50.361011',3,'alerts/a_39fcc5ac.jpg'),(1258,0,'Missing Hardhat','2026-05-01 14:29:50.374616',3,'alerts/a_41f6305c.jpg'),(1259,0,'Missing Mask','2026-05-01 14:29:50.394175',3,'alerts/a_a9cc6f80.jpg'),(1260,0,'Missing Safety Vest','2026-05-01 14:30:02.051922',3,'alerts/a_05752bc9.jpg'),(1261,0,'Missing Hardhat','2026-05-01 14:30:02.068083',3,'alerts/a_edd6cb36.jpg'),(1262,0,'Missing Mask','2026-05-01 14:30:02.094118',3,'alerts/a_592e16b5.jpg'),(1263,0,'Missing Safety Vest','2026-05-01 14:30:13.521343',3,'alerts/a_d71e09fd.jpg'),(1264,0,'Missing Mask','2026-05-01 14:30:13.532302',3,'alerts/a_dd683800.jpg'),(1265,0,'Missing Hardhat','2026-05-01 14:30:13.545644',3,'alerts/a_4c5a6478.jpg'),(1266,0,'Missing Safety Vest','2026-05-01 14:30:25.052003',3,'alerts/a_d2977514.jpg'),(1267,0,'Missing Mask','2026-05-01 14:30:25.073388',3,'alerts/a_3be6a052.jpg'),(1268,0,'Missing Hardhat','2026-05-01 14:30:25.093321',3,'alerts/a_f31ff436.jpg'),(1269,0,'Missing Safety Vest','2026-05-01 14:30:36.592297',3,'alerts/a_4d753421.jpg'),(1270,0,'Missing Hardhat','2026-05-01 14:30:36.608841',3,'alerts/a_edda8493.jpg'),(1271,0,'Missing Mask','2026-05-01 14:30:36.628784',3,'alerts/a_cf5aecd6.jpg'),(1272,0,'Missing Safety Vest','2026-05-01 14:30:48.499662',3,'alerts/a_fbc51728.jpg'),(1273,0,'Missing Hardhat','2026-05-01 14:30:48.513455',3,'alerts/a_e37311c5.jpg'),(1274,0,'Missing Mask','2026-05-01 14:30:48.528264',3,'alerts/a_438cfb56.jpg'),(1275,0,'Missing Safety Vest','2026-05-01 14:31:00.071844',3,'alerts/a_29c5c451.jpg'),(1276,0,'Missing Hardhat','2026-05-01 14:31:00.092679',3,'alerts/a_1ba37d03.jpg'),(1277,0,'Missing Mask','2026-05-01 14:31:00.106393',3,'alerts/a_cebb372c.jpg'),(1278,1,'Missing Safety Vest','2026-05-01 14:31:23.972691',NULL,'alerts/a_446ee90e.jpg'),(1279,1,'Missing Hardhat','2026-05-01 14:31:23.995264',NULL,'alerts/a_438a5802.jpg'),(1280,1,'Missing Mask','2026-05-01 14:31:24.013836',NULL,'alerts/a_bc6c5e65.jpg'),(1281,0,'Missing Hardhat','2026-05-01 14:31:35.780987',3,'alerts/a_488bd0e7.jpg'),(1282,0,'Missing Mask','2026-05-01 14:31:35.804248',3,'alerts/a_35ccb5a4.jpg'),(1283,0,'Missing Safety Vest','2026-05-01 14:31:35.817363',3,'alerts/a_d2bf7c2b.jpg'),(1284,0,'Missing Hardhat','2026-05-01 14:31:48.930550',3,'alerts/a_191a8eb8.jpg'),(1285,0,'Missing Mask','2026-05-01 14:31:48.951593',3,'alerts/a_f32625b4.jpg'),(1286,0,'Missing Safety Vest','2026-05-01 14:31:48.970234',3,'alerts/a_90907166.jpg'),(1287,0,'Missing Mask','2026-05-01 14:32:02.506429',3,'alerts/a_924a2d3e.jpg'),(1288,0,'Missing Safety Vest','2026-05-01 14:32:02.528093',3,'alerts/a_ec80e673.jpg'),(1289,0,'Missing Hardhat','2026-05-01 14:32:02.548922',3,'alerts/a_31d7a6ee.jpg'),(1290,0,'Missing Mask','2026-05-01 14:32:16.180266',3,'alerts/a_8f95fa1f.jpg'),(1291,0,'Missing Hardhat','2026-05-01 14:32:16.194924',3,'alerts/a_d32db5fb.jpg'),(1292,0,'Missing Safety Vest','2026-05-01 14:32:16.209870',3,'alerts/a_29d86fa8.jpg'),(1293,0,'Missing Safety Vest','2026-05-01 14:32:28.902108',3,'alerts/a_974761c3.jpg'),(1294,0,'Missing Mask','2026-05-01 14:32:28.923689',3,'alerts/a_39c7e855.jpg'),(1295,0,'Missing Hardhat','2026-05-01 14:32:28.940857',3,'alerts/a_8eb7b33b.jpg'),(1296,0,'Missing Mask','2026-05-01 14:32:41.977748',3,'alerts/a_377c3ca9.jpg'),(1297,0,'Missing Hardhat','2026-05-01 14:32:41.991790',3,'alerts/a_a3920caf.jpg'),(1298,0,'Missing Safety Vest','2026-05-01 14:32:42.007917',3,'alerts/a_b24b61b4.jpg'),(1299,0,'Missing Safety Vest','2026-05-01 14:32:56.064151',3,'alerts/a_04b6ad2f.jpg'),(1300,0,'Missing Hardhat','2026-05-01 14:32:56.087844',3,'alerts/a_398d828d.jpg'),(1301,0,'Missing Mask','2026-05-01 14:32:56.107945',3,'alerts/a_afc60e04.jpg'),(1302,0,'Missing Mask','2026-05-01 14:33:10.714237',3,'alerts/a_08a4f243.jpg'),(1303,0,'Missing Hardhat','2026-05-01 14:33:10.729895',3,'alerts/a_4e25f3dc.jpg'),(1304,0,'Missing Safety Vest','2026-05-01 14:33:10.751503',3,'alerts/a_233f068a.jpg'),(1305,0,'Missing Hardhat','2026-05-01 14:33:24.867291',3,'alerts/a_1f1bb240.jpg'),(1306,0,'Missing Mask','2026-05-01 14:33:24.883323',3,'alerts/a_4d11ce9c.jpg'),(1307,0,'Missing Safety Vest','2026-05-01 14:33:24.898890',3,'alerts/a_313c03fd.jpg'),(1308,0,'Missing Safety Vest','2026-05-01 14:33:39.045450',3,'alerts/a_5b396f18.jpg'),(1309,0,'Missing Hardhat','2026-05-01 14:33:39.062035',3,'alerts/a_4060235b.jpg'),(1310,0,'Missing Mask','2026-05-01 14:33:39.081790',3,'alerts/a_8681c3cb.jpg'),(1311,0,'Missing Hardhat','2026-05-01 14:33:52.244772',3,'alerts/a_8d123b96.jpg'),(1312,0,'Missing Safety Vest','2026-05-01 14:33:52.261940',3,'alerts/a_4d6e1709.jpg'),(1313,0,'Missing Mask','2026-05-01 14:33:52.277540',3,'alerts/a_7c9ecd5e.jpg'),(1314,0,'Missing Hardhat','2026-05-01 14:34:04.939855',3,'alerts/a_eb22b4e6.jpg'),(1315,0,'Missing Safety Vest','2026-05-01 14:34:04.956029',3,'alerts/a_1d7c83c3.jpg'),(1316,0,'Missing Mask','2026-05-01 14:34:04.978323',3,'alerts/a_f5153efd.jpg'),(1317,0,'Missing Safety Vest','2026-05-01 14:34:18.650911',3,'alerts/a_56ecd7e1.jpg'),(1318,0,'Missing Hardhat','2026-05-01 14:34:18.669324',3,'alerts/a_f3a996a1.jpg'),(1319,0,'Missing Mask','2026-05-01 14:34:18.689816',3,'alerts/a_c9824e69.jpg'),(1320,0,'Missing Hardhat','2026-05-01 14:34:32.493694',3,'alerts/a_dc0966a3.jpg'),(1321,0,'Missing Safety Vest','2026-05-01 14:34:32.510728',3,'alerts/a_2886569d.jpg'),(1322,0,'Missing Mask','2026-05-01 14:34:32.525554',3,'alerts/a_205b703d.jpg'),(1323,0,'Missing Safety Vest','2026-05-01 14:34:45.737664',3,'alerts/a_1998e355.jpg'),(1324,0,'Missing Hardhat','2026-05-01 14:34:45.752808',3,'alerts/a_bcb599d0.jpg'),(1325,0,'Missing Mask','2026-05-01 14:34:45.768168',3,'alerts/a_a62dd477.jpg'),(1326,1,'Missing Safety Vest','2026-05-01 14:35:10.860158',NULL,'alerts/a_b6f4e552.jpg'),(1327,1,'Missing Hardhat','2026-05-01 14:35:10.874900',NULL,'alerts/a_d7cea867.jpg'),(1328,1,'Missing Mask','2026-05-01 14:35:10.889447',NULL,'alerts/a_51e30e33.jpg'),(1329,0,'Missing Hardhat','2026-05-01 14:35:23.558065',3,'alerts/a_bc4adf76.jpg'),(1330,0,'Missing Mask','2026-05-01 14:35:23.572855',3,'alerts/a_1d35c6f0.jpg'),(1331,0,'Missing Safety Vest','2026-05-01 14:35:23.588523',3,'alerts/a_7ddc71c7.jpg'),(1332,0,'Missing Hardhat','2026-05-01 14:35:35.921596',3,'alerts/a_d0014aee.jpg'),(1333,0,'Missing Mask','2026-05-01 14:35:35.938160',3,'alerts/a_68554cf0.jpg'),(1334,0,'Missing Safety Vest','2026-05-01 14:35:35.954068',3,'alerts/a_53cfd3ba.jpg'),(1335,0,'Missing Mask','2026-05-01 14:35:47.902165',3,'alerts/a_6289017b.jpg'),(1336,0,'Missing Hardhat','2026-05-01 14:35:47.917988',3,'alerts/a_810b2dba.jpg'),(1337,0,'Missing Safety Vest','2026-05-01 14:35:47.939734',3,'alerts/a_3fb51278.jpg'),(1338,1,'Missing Safety Vest','2026-05-01 14:36:11.361869',NULL,'alerts/a_3686b27e.jpg'),(1339,1,'Missing Hardhat','2026-05-01 14:36:11.373885',NULL,'alerts/a_5ff74b40.jpg'),(1340,1,'Missing Mask','2026-05-01 14:36:11.391468',NULL,'alerts/a_327363a2.jpg'),(1341,0,'Missing Mask','2026-05-01 14:36:23.311290',3,'alerts/a_6902a38e.jpg'),(1342,0,'Missing Hardhat','2026-05-01 14:36:23.330500',3,'alerts/a_ea01ab02.jpg'),(1343,0,'Missing Safety Vest','2026-05-01 14:36:23.346544',3,'alerts/a_d560d218.jpg'),(1344,0,'Missing Hardhat','2026-05-01 14:36:35.385651',3,'alerts/a_fe0ddeb3.jpg'),(1345,0,'Missing Mask','2026-05-01 14:36:35.402846',3,'alerts/a_7ca15dcf.jpg'),(1346,0,'Missing Safety Vest','2026-05-01 14:36:35.416820',3,'alerts/a_f366db22.jpg'),(1347,0,'Missing Safety Vest','2026-05-01 14:36:47.394158',3,'alerts/a_12954d5c.jpg'),(1348,0,'Missing Hardhat','2026-05-01 14:36:47.409657',3,'alerts/a_24f9825e.jpg'),(1349,0,'Missing Mask','2026-05-01 14:36:47.433006',3,'alerts/a_313805e4.jpg'),(1350,0,'Missing Safety Vest','2026-05-01 14:36:59.558452',3,'alerts/a_b68e182b.jpg'),(1351,0,'Missing Hardhat','2026-05-01 14:36:59.578260',3,'alerts/a_71f6f246.jpg'),(1352,0,'Missing Mask','2026-05-01 14:36:59.597306',3,'alerts/a_c1cb2e3a.jpg'),(1353,0,'Missing Mask','2026-05-01 14:37:11.615455',3,'alerts/a_dc3aa9ab.jpg'),(1354,0,'Missing Safety Vest','2026-05-01 14:37:11.631375',3,'alerts/a_eaf41899.jpg'),(1355,0,'Missing Hardhat','2026-05-01 14:37:11.659932',3,'alerts/a_5134a8b7.jpg'),(1356,0,'Missing Mask','2026-05-01 14:37:23.722615',3,'alerts/a_9bd51fd6.jpg'),(1357,0,'Missing Safety Vest','2026-05-01 14:37:23.735619',3,'alerts/a_17d125d2.jpg'),(1358,0,'Missing Hardhat','2026-05-01 14:37:23.759262',3,'alerts/a_a38c8a7b.jpg'),(1359,0,'Missing Mask','2026-05-01 14:37:35.728198',3,'alerts/a_30ba44f7.jpg'),(1360,0,'Missing Safety Vest','2026-05-01 14:37:35.745912',3,'alerts/a_46fde5e3.jpg'),(1361,0,'Missing Hardhat','2026-05-01 14:37:35.764269',3,'alerts/a_15e99fa3.jpg'),(1362,0,'Missing Hardhat','2026-05-01 14:37:47.842681',3,'alerts/a_d8e79556.jpg'),(1363,0,'Missing Mask','2026-05-01 14:37:47.856311',3,'alerts/a_57523f02.jpg'),(1364,0,'Missing Safety Vest','2026-05-01 14:37:47.871992',3,'alerts/a_eb345bdf.jpg'),(1365,0,'Missing Safety Vest','2026-05-01 14:37:59.855816',3,'alerts/a_aa573f78.jpg'),(1366,0,'Missing Mask','2026-05-01 14:37:59.876443',3,'alerts/a_407b822f.jpg'),(1367,0,'Missing Hardhat','2026-05-01 14:37:59.894213',3,'alerts/a_ad1053be.jpg'),(1368,0,'Missing Safety Vest','2026-05-01 14:38:11.992214',3,'alerts/a_c00acb77.jpg'),(1369,0,'Missing Hardhat','2026-05-01 14:38:12.012396',3,'alerts/a_20cb0dd4.jpg'),(1370,0,'Missing Mask','2026-05-01 14:38:12.028907',3,'alerts/a_b57f358e.jpg'),(1371,0,'Missing Mask','2026-05-01 14:38:24.105432',3,'alerts/a_23306b34.jpg'),(1372,0,'Missing Safety Vest','2026-05-01 14:38:24.127181',3,'alerts/a_ab040c40.jpg'),(1373,0,'Missing Safety Vest','2026-05-01 14:38:36.065564',3,'alerts/a_0473221c.jpg'),(1374,0,'Missing Mask','2026-05-01 14:38:36.079680',3,'alerts/a_4b250f2b.jpg'),(1375,0,'Missing Hardhat','2026-05-01 14:38:36.098703',3,'alerts/a_59d53699.jpg'),(1376,0,'Missing Mask','2026-05-01 14:38:48.167962',3,'alerts/a_3306066a.jpg'),(1377,0,'Missing Hardhat','2026-05-01 14:38:48.189326',3,'alerts/a_f08965a3.jpg'),(1378,0,'Missing Safety Vest','2026-05-01 14:38:48.228537',3,'alerts/a_652f1148.jpg'),(1379,0,'Missing Mask','2026-05-01 14:39:00.162204',3,'alerts/a_7eeccd52.jpg'),(1380,0,'Missing Safety Vest','2026-05-01 14:39:00.183011',3,'alerts/a_7d0386c8.jpg'),(1381,0,'Missing Hardhat','2026-05-01 14:39:00.210527',3,'alerts/a_7f14ef83.jpg'),(1382,0,'Missing Mask','2026-05-01 14:39:12.239882',3,'alerts/a_fef4afde.jpg'),(1383,0,'Missing Safety Vest','2026-05-01 14:39:12.260638',3,'alerts/a_6e892bf6.jpg'),(1384,0,'Missing Hardhat','2026-05-01 14:39:12.274442',3,'alerts/a_d56a9ebf.jpg'),(1385,0,'Missing Mask','2026-05-01 14:39:24.174056',3,'alerts/a_6f39bf26.jpg'),(1386,0,'Missing Safety Vest','2026-05-01 14:39:24.187270',3,'alerts/a_45c4055a.jpg'),(1387,0,'Missing Hardhat','2026-05-01 14:39:24.201582',3,'alerts/a_fe4cb000.jpg'),(1388,1,'Missing Mask','2026-05-01 14:39:47.113778',NULL,'alerts/a_db6bc196.jpg'),(1389,1,'Missing Safety Vest','2026-05-01 14:39:47.128540',NULL,'alerts/a_656b0626.jpg'),(1390,1,'Missing Hardhat','2026-05-01 14:39:47.141927',NULL,'alerts/a_5191085e.jpg'),(1391,1,'Missing Mask','2026-05-01 14:40:10.456683',NULL,'alerts/a_e0edc27c.jpg'),(1392,1,'Missing Hardhat','2026-05-01 14:40:10.480040',NULL,'alerts/a_cfb4237b.jpg'),(1393,1,'Missing Safety Vest','2026-05-01 14:40:10.497183',NULL,'alerts/a_2b84ec69.jpg'),(1394,0,'Missing Hardhat','2026-05-01 14:40:22.724489',3,'alerts/a_221a13fb.jpg'),(1395,0,'Missing Mask','2026-05-01 14:40:22.744029',3,'alerts/a_51fab9f0.jpg'),(1396,0,'Missing Mask','2026-05-01 14:40:35.579644',3,'alerts/a_d05126c4.jpg'),(1397,0,'Missing Hardhat','2026-05-01 14:40:35.600774',3,'alerts/a_fff0daec.jpg'),(1398,0,'Missing Safety Vest','2026-05-01 14:40:35.614547',3,'alerts/a_e3d744df.jpg'),(1399,0,'Missing Mask','2026-05-01 14:40:47.214417',3,'alerts/a_5fa0b382.jpg'),(1400,0,'Missing Hardhat','2026-05-01 14:40:47.234167',3,'alerts/a_4bfaf244.jpg'),(1401,0,'Missing Safety Vest','2026-05-01 14:40:47.251070',3,'alerts/a_e8d110ed.jpg'),(1402,0,'Missing Mask','2026-05-01 14:40:58.892782',3,'alerts/a_82b17e53.jpg'),(1403,0,'Missing Hardhat','2026-05-01 14:40:58.917418',3,'alerts/a_9f1f0555.jpg'),(1404,0,'Missing Safety Vest','2026-05-01 14:40:58.937454',3,'alerts/a_7a062576.jpg'),(1405,0,'Missing Mask','2026-05-01 14:41:10.473304',3,'alerts/a_2ea53d91.jpg'),(1406,0,'Missing Hardhat','2026-05-01 14:41:10.493536',3,'alerts/a_b0d87c48.jpg'),(1407,0,'Missing Safety Vest','2026-05-01 14:41:10.507178',3,'alerts/a_a44e4120.jpg'),(1408,0,'Missing Mask','2026-05-01 14:41:22.349999',3,'alerts/a_9374720d.jpg'),(1409,0,'Missing Hardhat','2026-05-01 14:41:22.368273',3,'alerts/a_284d5ac3.jpg'),(1410,0,'Missing Safety Vest','2026-05-01 14:41:22.383460',3,'alerts/a_c793d6f3.jpg'),(1411,0,'Missing Mask','2026-05-01 14:41:34.035698',3,'alerts/a_93cb5cbc.jpg'),(1412,0,'Missing Hardhat','2026-05-01 14:41:34.055018',3,'alerts/a_d4baed7c.jpg'),(1413,0,'Missing Safety Vest','2026-05-01 14:41:34.078411',3,'alerts/a_8f4896d7.jpg'),(1414,0,'Missing Hardhat','2026-05-01 14:41:45.593512',3,'alerts/a_358dc749.jpg'),(1415,0,'Missing Mask','2026-05-01 14:41:45.606677',3,'alerts/a_71aa05e2.jpg'),(1416,0,'Missing Safety Vest','2026-05-01 14:41:45.620043',3,'alerts/a_7be7dac9.jpg'),(1417,1,'Missing Mask','2026-05-01 14:42:08.345501',NULL,'alerts/a_b4b58580.jpg'),(1418,1,'Missing Safety Vest','2026-05-01 14:42:08.365665',NULL,'alerts/a_d494c1b5.jpg'),(1419,0,'Missing Hardhat','2026-05-01 14:42:20.658297',3,'alerts/a_9e03b1f4.jpg'),(1420,0,'Missing Mask','2026-05-01 14:42:20.675611',3,'alerts/a_3ebfa96b.jpg'),(1421,0,'Missing Safety Vest','2026-05-01 14:42:20.688801',3,'alerts/a_12deb746.jpg'),(1422,0,'Missing Mask','2026-05-01 14:42:32.550692',3,'alerts/a_aa39fa98.jpg'),(1423,0,'Missing Hardhat','2026-05-01 14:42:32.570103',3,'alerts/a_764e7ccb.jpg'),(1424,0,'Missing Safety Vest','2026-05-01 14:42:32.584741',3,'alerts/a_25e3c058.jpg'),(1425,0,'Missing Mask','2026-05-01 14:42:44.845262',3,'alerts/a_805d60a5.jpg'),(1426,0,'Missing Safety Vest','2026-05-01 14:42:44.861168',3,'alerts/a_2edebe76.jpg'),(1427,0,'Missing Hardhat','2026-05-01 14:42:44.875365',3,'alerts/a_54ecbc22.jpg'),(1428,0,'Missing Safety Vest','2026-05-01 14:43:21.464251',3,'alerts/a_ea1fa2a7.jpg'),(1429,0,'Missing Mask','2026-05-01 14:43:21.480943',3,'alerts/a_6b68e05c.jpg'),(1430,0,'Missing Hardhat','2026-05-01 14:43:21.494695',3,'alerts/a_58cde3ec.jpg'),(1431,0,'Missing Safety Vest','2026-05-01 14:43:33.425159',3,'alerts/a_98fe724a.jpg'),(1432,0,'Missing Mask','2026-05-01 14:43:33.444818',3,'alerts/a_d79a4b12.jpg'),(1433,0,'Missing Hardhat','2026-05-01 14:43:33.458943',3,'alerts/a_8d4c97e9.jpg'),(1434,0,'Missing Safety Vest','2026-05-01 14:43:45.061084',3,'alerts/a_e602b8cd.jpg'),(1435,0,'Missing Mask','2026-05-01 14:43:45.076360',3,'alerts/a_0a8b8a25.jpg'),(1436,0,'Missing Hardhat','2026-05-01 14:43:45.090979',3,'alerts/a_938b6905.jpg'),(1437,1,'Missing Safety Vest','2026-05-01 14:44:31.323235',NULL,'alerts/a_76661cc1.jpg'),(1438,1,'Missing Mask','2026-05-01 14:44:31.346779',NULL,'alerts/a_50057fe2.jpg'),(1439,1,'Missing Hardhat','2026-05-01 14:44:31.362564',NULL,'alerts/a_aec8a36f.jpg'),(1440,0,'Missing Mask','2026-05-01 14:44:43.002476',3,'alerts/a_8833da23.jpg'),(1441,0,'Missing Safety Vest','2026-05-01 14:44:43.028641',3,'alerts/a_bd25d676.jpg'),(1442,0,'Missing Hardhat','2026-05-01 14:44:43.048423',3,'alerts/a_6f2f7608.jpg'),(1443,0,'Missing Safety Vest','2026-05-01 14:44:54.620595',3,'alerts/a_89615755.jpg'),(1444,0,'Missing Mask','2026-05-01 14:44:54.641306',3,'alerts/a_a9d13883.jpg'),(1445,0,'Missing Hardhat','2026-05-01 14:44:54.658777',3,'alerts/a_ffdd321d.jpg'),(1446,0,'Missing Mask','2026-05-01 14:45:06.220638',3,'alerts/a_07db6941.jpg'),(1447,0,'Missing Safety Vest','2026-05-01 14:45:06.233868',3,'alerts/a_63c9bb81.jpg'),(1448,0,'Missing Hardhat','2026-05-01 14:45:06.247034',3,'alerts/a_51e17acc.jpg'),(1449,0,'Missing Mask','2026-05-01 14:45:17.856621',3,'alerts/a_29ddf153.jpg'),(1450,0,'Missing Safety Vest','2026-05-01 14:45:17.870495',3,'alerts/a_ec2e1994.jpg'),(1451,0,'Missing Hardhat','2026-05-01 14:45:17.886087',3,'alerts/a_aa1501c3.jpg'),(1452,0,'Missing Safety Vest','2026-05-01 14:45:29.755564',3,'alerts/a_36d04431.jpg'),(1453,0,'Missing Mask','2026-05-01 14:45:29.774620',3,'alerts/a_f6850c55.jpg'),(1454,0,'Missing Hardhat','2026-05-01 14:45:29.792218',3,'alerts/a_0af41b63.jpg'),(1455,0,'Missing Mask','2026-05-01 14:45:41.470888',3,'alerts/a_486ad1e4.jpg'),(1456,0,'Missing Hardhat','2026-05-01 14:45:41.492116',3,'alerts/a_701655b6.jpg'),(1457,0,'Missing Safety Vest','2026-05-01 14:45:41.509787',3,'alerts/a_5521faa9.jpg'),(1458,0,'Missing Safety Vest','2026-05-01 14:45:53.584509',3,'alerts/a_bcc0e1e6.jpg'),(1459,0,'Missing Mask','2026-05-01 14:45:53.602210',3,'alerts/a_9b59adc8.jpg'),(1460,0,'Missing Hardhat','2026-05-01 14:45:53.628316',3,'alerts/a_0fd763d1.jpg'),(1461,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:46:39.864346',3,'alerts/a_9ac5aa48.jpg'),(1462,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:46:52.749643',3,'alerts/a_dab30fce.jpg'),(1463,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:47:04.925178',3,'alerts/a_3cb82409.jpg'),(1464,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:47:16.808157',3,'alerts/a_3c0de1bf.jpg'),(1465,0,'Missing Mask, Missing Safety Vest, Missing Hardhat','2026-05-01 14:47:28.557635',3,'alerts/a_18d53872.jpg'),(1466,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:47:41.342016',3,'alerts/a_259b8f59.jpg'),(1467,0,'Missing Mask, Missing Safety Vest, Missing Hardhat','2026-05-01 14:47:53.891413',3,'alerts/a_a996397d.jpg'),(1468,0,'Missing Mask, Missing Safety Vest, Missing Hardhat','2026-05-01 14:48:05.774044',3,'alerts/a_202a22c7.jpg'),(1469,0,'Missing Mask, Missing Safety Vest, Missing Hardhat','2026-05-01 14:48:17.927206',3,'alerts/a_fe487923.jpg'),(1470,0,'Missing Mask, Missing Safety Vest, Missing Hardhat','2026-05-01 14:48:30.365505',3,'alerts/a_9b4ac4b0.jpg'),(1471,0,'Missing Hardhat, Missing Safety Vest, Missing Mask','2026-05-01 14:48:43.223337',3,'alerts/a_bc42d50b.jpg'),(1472,0,'Missing Mask, Missing Hardhat, Missing Safety Vest','2026-05-01 14:48:55.521387',3,'alerts/a_0712b738.jpg'),(1473,0,'Missing Hardhat, Missing Safety Vest, Missing Mask','2026-05-01 14:49:08.274816',3,'alerts/a_2afbc26b.jpg'),(1474,0,'Missing Mask, Missing Hardhat, Missing Safety Vest','2026-05-01 14:49:19.904483',3,'alerts/a_dddf67c7.jpg'),(1475,0,'Missing Mask, Missing Safety Vest, Missing Hardhat','2026-05-01 14:49:31.613101',3,'alerts/a_1e66d27a.jpg'),(1476,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:49:43.262422',3,'alerts/a_4c520c3d.jpg'),(1477,1,'Missing Hardhat, Missing Safety Vest, Missing Mask, Missing Mask','2026-05-01 14:50:07.748959',NULL,'alerts/a_42a9e28b.jpg'),(1478,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:50:19.793237',3,'alerts/a_8b294bdf.jpg'),(1479,0,'Missing Safety Vest, Missing Mask, Missing Hardhat, Missing Mask','2026-05-01 14:50:32.038197',3,'alerts/a_d6cab94e.jpg'),(1480,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:50:43.604262',3,'alerts/a_b2bde5d7.jpg'),(1481,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:50:55.169036',3,'alerts/a_f46d7c45.jpg'),(1482,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:51:07.686320',3,'alerts/a_41181da6.jpg'),(1483,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:51:20.053371',3,'alerts/a_c92fa28c.jpg'),(1484,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:51:31.977554',3,'alerts/a_e2c6182f.jpg'),(1485,0,'Missing Hardhat, Missing Mask, Missing Safety Vest','2026-05-01 14:51:43.924672',3,'alerts/a_a05b4cb8.jpg'),(1486,0,'Missing Hardhat, Missing Safety Vest, Missing Mask','2026-05-01 14:51:55.849690',3,'alerts/a_f4cb0e0d.jpg'),(1487,0,'Missing Hardhat, Missing Mask, Missing Safety Vest','2026-05-01 14:52:07.790342',3,'alerts/a_eba3e211.jpg'),(1488,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:52:19.823340',3,'alerts/a_ede4f5ca.jpg'),(1489,0,'Missing Mask, Missing Safety Vest, Missing Hardhat','2026-05-01 14:52:32.711646',3,'alerts/a_ae76cf4e.jpg'),(1490,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:52:45.223916',3,'alerts/a_2fa8aca8.jpg'),(1491,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:52:57.428539',3,'alerts/a_bcfd9a73.jpg'),(1492,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:53:09.635698',3,'alerts/a_0c81e8ed.jpg'),(1493,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:53:21.929932',3,'alerts/a_cbc0b833.jpg'),(1494,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:53:34.317526',3,'alerts/a_a30c0f7a.jpg'),(1495,0,'Missing Hardhat, Missing Safety Vest, Missing Mask','2026-05-01 14:53:46.479430',3,'alerts/a_f41a4588.jpg'),(1496,0,'Missing Mask, Missing Safety Vest, Missing Hardhat','2026-05-01 14:53:58.419931',3,'alerts/a_83eec28d.jpg'),(1497,0,'Missing Hardhat, Missing Safety Vest, Missing Mask','2026-05-01 14:54:10.194675',3,'alerts/a_4a90cf8f.jpg'),(1498,0,'Missing Hardhat, Missing Safety Vest, Missing Mask','2026-05-01 14:54:22.433565',3,'alerts/a_ab85e41d.jpg'),(1499,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:54:34.951511',3,'alerts/a_13b9b2cb.jpg'),(1500,0,'Missing Mask, Missing Hardhat, Missing Safety Vest','2026-05-01 14:54:47.485469',3,'alerts/a_8d6a5131.jpg'),(1501,0,'Missing Mask, Missing Safety Vest, Missing Hardhat','2026-05-01 14:54:59.928859',3,'alerts/a_efd0ae41.jpg'),(1502,1,'Missing Mask, Missing Hardhat','2026-05-01 14:55:30.241577',NULL,'alerts/a_20beab89.jpg'),(1503,0,'Missing Hardhat, Missing Safety Vest, Missing Mask','2026-05-01 14:55:42.162027',3,'alerts/a_ef8d4c66.jpg'),(1504,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:55:54.781568',3,'alerts/a_fe9764d2.jpg'),(1505,0,'Missing Safety Vest, Missing Mask','2026-05-01 14:56:07.290083',3,'alerts/a_84ddcd45.jpg'),(1506,0,'Missing Safety Vest, Missing Mask','2026-05-01 14:56:19.320346',3,'alerts/a_44041b5f.jpg'),(1507,0,'Missing Safety Vest, Missing Mask','2026-05-01 14:56:31.254508',3,'alerts/a_b545e21f.jpg'),(1508,0,'Missing Hardhat, Missing Safety Vest, Missing Mask','2026-05-01 14:56:43.807787',3,'alerts/a_d62777ca.jpg'),(1509,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:56:55.998612',3,'alerts/a_8afbdab3.jpg'),(1510,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:57:09.047127',3,'alerts/a_f59d231d.jpg'),(1511,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:57:21.078267',3,'alerts/a_07ef8f09.jpg'),(1512,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:57:33.222801',3,'alerts/a_c499177f.jpg'),(1513,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:57:45.221064',3,'alerts/a_2453110a.jpg'),(1514,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:57:57.224208',3,'alerts/a_362bf6ad.jpg'),(1515,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:58:09.386014',3,'alerts/a_e1fc96dd.jpg'),(1516,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:58:21.176354',3,'alerts/a_bc903b80.jpg'),(1517,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:58:33.092255',3,'alerts/a_42aa484d.jpg'),(1518,0,'Missing Safety Vest, Missing Mask, Missing Hardhat','2026-05-01 14:58:45.053683',3,'alerts/a_495aaa75.jpg'),(1519,0,'Missing Safety Vest, Missing Hardhat, Missing Mask','2026-05-01 14:58:56.944540',3,'alerts/a_baa10dba.jpg'),(1520,0,'Missing Hardhat, Missing Safety Vest','2026-05-01 14:59:09.539038',3,'alerts/a_24f0039d.jpg'),(1521,0,'Missing Hardhat, Missing Mask, Missing Safety Vest','2026-05-01 14:59:21.720393',3,'alerts/a_bcdc20aa.jpg'),(1522,0,'Missing Mask, Missing Hardhat, Missing Safety Vest','2026-05-01 14:59:33.708663',3,'alerts/a_ee6b5015.jpg'),(1523,0,'Missing Mask, Missing Hardhat','2026-05-01 14:59:46.033338',3,'alerts/a_a5085361.jpg'),(1524,0,'Missing Mask, Missing Hardhat, Missing Safety Vest','2026-05-01 14:59:58.162764',3,'alerts/a_07dc948a.jpg'),(1525,0,'Missing Hardhat','2026-05-01 15:00:10.208838',3,'alerts/a_d6e66ad8.jpg'),(1526,0,'Missing Mask, Missing Hardhat','2026-05-01 15:00:22.818236',3,'alerts/a_109615b6.jpg'),(1527,0,'Missing Hardhat, Missing Mask','2026-05-01 15:00:35.132216',3,'alerts/a_3001436c.jpg'),(1528,0,'Missing Hardhat, Missing Mask, Missing Safety Vest','2026-05-01 15:00:47.286607',3,'alerts/a_d5e5a5b8.jpg'),(1529,0,'Missing Hardhat, Missing Mask, Missing Safety Vest','2026-05-01 15:00:59.572667',3,'alerts/a_9679fdf2.jpg'),(1530,0,'Missing Mask','2026-05-01 15:01:11.620363',3,'alerts/a_deec8c1c.jpg'),(1531,0,'Missing Mask','2026-05-01 15:01:23.556329',3,'alerts/a_b7b99a7d.jpg'),(1532,0,'Missing Mask','2026-05-01 15:01:35.944953',3,'alerts/a_e128f4a4.jpg'),(1533,0,'Missing Mask','2026-05-01 15:01:49.811372',3,'alerts/a_61d01bef.jpg'),(1534,0,'Missing Mask','2026-05-01 15:02:02.728992',3,'alerts/a_833adb99.jpg'),(1535,0,'Missing Mask','2026-05-01 15:02:15.635191',3,'alerts/a_088f8969.jpg'),(1536,0,'Missing Mask','2026-05-01 15:02:27.497810',3,'alerts/a_98916309.jpg'),(1537,0,'Missing Mask','2026-05-01 15:02:39.346125',3,'alerts/a_c2effff1.jpg'),(1538,0,'Missing Mask','2026-05-01 15:02:51.603735',3,'alerts/a_bc050474.jpg'),(1539,0,'Missing Mask','2026-05-01 15:03:04.259409',3,'alerts/a_f0b23c86.jpg'),(1540,0,'Missing Mask','2026-05-01 15:03:16.432403',3,'alerts/a_733d8ad6.jpg'),(1541,0,'Missing Mask','2026-05-01 15:03:28.661529',3,'alerts/a_27b4ef01.jpg'),(1542,0,'Missing Mask','2026-05-01 15:03:40.890354',3,'alerts/a_ba5eada0.jpg'),(1543,0,'Missing Mask','2026-05-01 15:03:53.083658',3,'alerts/a_c733e72c.jpg'),(1544,0,'Missing Mask','2026-05-01 15:04:05.251669',3,'alerts/a_6d0c7715.jpg'),(1545,0,'Missing Mask','2026-05-01 15:04:18.171660',3,'alerts/a_e7b1532f.jpg'),(1546,0,'Missing Mask','2026-05-01 15:04:30.735662',3,'alerts/a_5e496483.jpg'),(1547,0,'Missing Mask','2026-05-01 15:04:43.136598',3,'alerts/a_fc982e12.jpg'),(1548,0,'Missing Mask','2026-05-01 15:04:55.765819',3,'alerts/a_22a0a0c7.jpg'),(1549,0,'Missing Mask','2026-05-01 15:05:08.344468',3,'alerts/a_d3c50bd9.jpg'),(1550,0,'Missing Mask','2026-05-01 15:05:20.632507',3,'alerts/a_2d070057.jpg'),(1551,0,'Missing Mask','2026-05-01 15:05:32.661468',3,'alerts/a_b24eaae9.jpg'),(1552,0,'Missing Mask','2026-05-01 15:05:44.504191',3,'alerts/a_91f4d545.jpg'),(1553,0,'Missing Mask','2026-05-01 15:05:56.369686',3,'alerts/a_4d86b3f9.jpg'),(1554,0,'Missing Mask','2026-05-01 15:06:08.345915',3,'alerts/a_97ffb8a7.jpg'),(1555,0,'Missing Mask','2026-05-01 15:06:20.296221',3,'alerts/a_e08d8dc4.jpg'),(1556,0,'Missing Mask','2026-05-01 15:06:32.176684',3,'alerts/a_8b0763a7.jpg'),(1557,0,'Missing Mask','2026-05-01 15:06:44.523686',3,'alerts/a_757f676c.jpg'),(1558,0,'Missing Mask','2026-05-01 15:06:56.246810',3,'alerts/a_1f2283c4.jpg'),(1559,0,'Missing Mask','2026-05-01 15:07:07.824216',3,'alerts/a_ce9ae8ea.jpg'),(1560,0,'Missing Mask','2026-05-01 15:07:19.966585',3,'alerts/a_04052a47.jpg'),(1561,0,'Missing Mask','2026-05-01 15:07:32.112338',3,'alerts/a_e576a655.jpg'),(1562,0,'Missing Mask','2026-05-01 15:07:43.965581',3,'alerts/a_c8da44fb.jpg'),(1563,0,'Missing Mask','2026-05-01 15:07:56.046886',3,'alerts/a_d4aa36ab.jpg'),(1564,0,'Missing Mask','2026-05-01 15:08:07.911638',3,'alerts/a_ee7ff518.jpg'),(1565,0,'Missing Mask','2026-05-01 15:08:19.844371',3,'alerts/a_a6dacdb3.jpg'),(1566,0,'Missing Mask','2026-05-01 15:08:31.954580',3,'alerts/a_bfc47205.jpg'),(1567,0,'Missing Mask','2026-05-01 15:08:44.032690',3,'alerts/a_0aa833af.jpg'),(1568,0,'Missing Mask','2026-05-01 15:08:55.954640',3,'alerts/a_60a79781.jpg'),(1569,0,'Missing Mask','2026-05-01 15:09:07.909918',3,'alerts/a_e6922765.jpg'),(1570,0,'Missing Mask','2026-05-01 15:09:20.338959',3,'alerts/a_afe22484.jpg'),(1571,0,'Missing Mask','2026-05-01 15:09:32.291851',3,'alerts/a_32899b5f.jpg'),(1572,0,'Missing Mask','2026-05-01 15:09:44.411668',3,'alerts/a_6b478603.jpg'),(1573,0,'Missing Mask','2026-05-01 15:09:56.277786',3,'alerts/a_1991247a.jpg'),(1574,0,'Missing Mask','2026-05-01 15:10:08.175759',3,'alerts/a_3d86fdf9.jpg'),(1575,0,'Missing Mask','2026-05-01 15:10:20.692843',3,'alerts/a_95740eaa.jpg'),(1576,0,'Missing Mask','2026-05-01 15:10:32.786216',3,'alerts/a_91ea6b39.jpg'),(1577,0,'Missing Mask','2026-05-01 15:10:45.004681',3,'alerts/a_6abbd4f2.jpg'),(1578,0,'Missing Mask','2026-05-01 15:10:56.529468',3,'alerts/a_2ceb233c.jpg'),(1579,0,'Missing Mask','2026-05-01 15:11:08.504851',3,'alerts/a_dc0e3d07.jpg'),(1580,0,'Missing Mask','2026-05-01 15:11:20.420748',3,'alerts/a_ef6875a3.jpg'),(1581,0,'Missing Mask','2026-05-01 15:11:32.631007',3,'alerts/a_4992ca3b.jpg'),(1582,0,'Missing Mask','2026-05-01 15:11:44.546162',3,'alerts/a_9ab00513.jpg'),(1583,0,'Missing Mask','2026-05-01 15:11:57.014074',3,'alerts/a_225f999e.jpg'),(1584,0,'Missing Mask','2026-05-01 15:12:08.990343',3,'alerts/a_e2908fec.jpg'),(1585,0,'Missing Mask','2026-05-01 15:12:21.023322',3,'alerts/a_79a5dc12.jpg'),(1586,0,'Missing Mask','2026-05-01 15:12:33.003365',3,'alerts/a_b754e9f8.jpg'),(1587,0,'Missing Mask','2026-05-01 15:12:44.988648',3,'alerts/a_34bb6411.jpg'),(1588,0,'Missing Mask','2026-05-01 15:12:56.968366',3,'alerts/a_95c2a887.jpg'),(1589,0,'Missing Mask','2026-05-01 15:13:08.885956',3,'alerts/a_09984214.jpg'),(1590,0,'Missing Mask','2026-05-01 15:13:20.898896',3,'alerts/a_c11915b8.jpg'),(1591,0,'Missing Mask','2026-05-01 15:13:33.474552',3,'alerts/a_9d3fa20d.jpg'),(1592,0,'Missing Mask','2026-05-01 15:13:45.496986',3,'alerts/a_ad6fc020.jpg'),(1593,0,'Missing Mask','2026-05-01 15:13:57.602796',3,'alerts/a_bf9451dc.jpg'),(1594,0,'Missing Mask','2026-05-01 15:14:09.564331',3,'alerts/a_b8526a48.jpg'),(1595,0,'Missing Mask','2026-05-01 15:14:21.462562',3,'alerts/a_aafdaa07.jpg'),(1596,0,'Missing Mask','2026-05-01 15:14:33.488140',3,'alerts/a_89c2a2c0.jpg'),(1597,0,'Missing Mask','2026-05-01 15:14:45.411641',3,'alerts/a_984343c6.jpg'),(1598,0,'Missing Mask','2026-05-01 15:14:57.305329',3,'alerts/a_f1889265.jpg'),(1599,0,'Missing Mask','2026-05-01 15:15:09.838327',3,'alerts/a_154ec853.jpg'),(1600,0,'Missing Mask','2026-05-01 15:15:21.742258',3,'alerts/a_ca12fdf1.jpg'),(1601,0,'Missing Mask','2026-05-01 15:15:33.807184',3,'alerts/a_ff302845.jpg'),(1602,0,'Missing Mask','2026-05-01 15:15:45.750117',3,'alerts/a_ae704264.jpg'),(1603,0,'Missing Mask','2026-05-01 15:15:57.758995',3,'alerts/a_81d7db77.jpg'),(1604,0,'Missing Mask','2026-05-01 15:16:09.593312',3,'alerts/a_cc22fd6a.jpg'),(1605,0,'Missing Mask','2026-05-01 15:16:21.980848',3,'alerts/a_a50144c5.jpg'),(1606,0,'Missing Mask','2026-05-01 15:16:34.017344',3,'alerts/a_7cc275ef.jpg'),(1607,0,'Missing Mask','2026-05-01 15:16:45.951912',3,'alerts/a_053384bf.jpg'),(1608,0,'Missing Mask','2026-05-01 15:16:57.927541',3,'alerts/a_5e4bdde2.jpg'),(1609,0,'Missing Mask','2026-05-01 15:17:09.832100',3,'alerts/a_83fdef86.jpg'),(1610,0,'Missing Mask','2026-05-01 15:17:21.776595',3,'alerts/a_bab74ac5.jpg'),(1611,0,'Missing Mask','2026-05-01 15:17:34.302663',3,'alerts/a_9f8a1475.jpg'),(1612,0,'Missing Mask','2026-05-01 15:17:46.264487',3,'alerts/a_1c3ae45c.jpg'),(1613,0,'Missing Mask','2026-05-01 15:17:58.488005',3,'alerts/a_c215f765.jpg'),(1614,0,'Missing Mask','2026-05-01 15:18:10.605678',3,'alerts/a_4fa987b5.jpg'),(1615,0,'Missing Mask','2026-05-01 15:18:21.979459',3,'alerts/a_d7886452.jpg'),(1616,0,'Missing Mask','2026-05-01 15:18:34.576600',3,'alerts/a_b134d69a.jpg'),(1617,0,'Missing Mask','2026-05-01 15:18:46.522095',3,'alerts/a_ea852bb5.jpg'),(1618,0,'Missing Mask','2026-05-01 15:18:58.494133',3,'alerts/a_ffe38505.jpg'),(1619,0,'Missing Mask','2026-05-01 15:19:10.472083',3,'alerts/a_59c88890.jpg'),(1620,0,'Missing Mask','2026-05-01 15:19:22.564476',3,'alerts/a_369bacca.jpg'),(1621,0,'Missing Mask','2026-05-01 15:19:34.534901',3,'alerts/a_cf8c6322.jpg'),(1622,0,'Missing Mask','2026-05-01 15:19:46.583528',3,'alerts/a_658e0b85.jpg'),(1623,0,'Missing Mask','2026-05-01 15:19:58.640664',3,'alerts/a_52369056.jpg'),(1624,0,'Missing Mask','2026-05-01 15:20:10.620404',3,'alerts/a_3099b805.jpg'),(1625,0,'Missing Mask','2026-05-01 15:20:22.686035',3,'alerts/a_9ee198d8.jpg'),(1626,0,'Missing Mask','2026-05-01 15:20:34.761828',3,'alerts/a_4a4866e8.jpg'),(1627,0,'Missing Mask','2026-05-01 15:20:46.702504',3,'alerts/a_f341a515.jpg'),(1628,0,'Missing Mask','2026-05-01 15:20:58.671250',3,'alerts/a_a6d75631.jpg'),(1629,0,'Missing Mask','2026-05-01 15:21:11.111490',3,'alerts/a_f8762678.jpg'),(1630,0,'Missing Mask','2026-05-01 15:21:23.054782',3,'alerts/a_ee5966c1.jpg'),(1631,0,'Missing Mask','2026-05-01 15:21:34.988321',3,'alerts/a_8e4123e1.jpg'),(1632,0,'Missing Mask','2026-05-01 15:21:46.891430',3,'alerts/a_961e16d7.jpg'),(1633,0,'Missing Mask','2026-05-01 15:21:59.381383',3,'alerts/a_36099e28.jpg'),(1634,0,'Missing Mask','2026-05-01 15:22:11.397093',3,'alerts/a_158cc18f.jpg');
/*!40000 ALTER TABLE `dashboard_alertlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard_employee`
--

DROP TABLE IF EXISTS `dashboard_employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dashboard_employee` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `photo` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard_employee`
--

LOCK TABLES `dashboard_employee` WRITE;
/*!40000 ALTER TABLE `dashboard_employee` DISABLE KEYS */;
INSERT INTO `dashboard_employee` VALUES (2,'Hussnain Muhammad Raza','1212','employees/WC202438_1768378388.jpg'),(3,'Mohammad Ahmad Javed','001','employees/IMG7185_1644586800.jpg'),(4,'Muhammad Ahsan Raza','1341','employees/WhatsApp_Image_2026-05-01_at_7.36.49_PM.jpeg');
/*!40000 ALTER TABLE `dashboard_employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(8,'dashboard','alertlog'),(7,'dashboard','employee'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-04-29 18:57:36.434929'),(2,'auth','0001_initial','2026-04-29 18:57:39.278384'),(3,'admin','0001_initial','2026-04-29 18:57:39.979607'),(4,'admin','0002_logentry_remove_auto_add','2026-04-29 18:57:40.001352'),(5,'admin','0003_logentry_add_action_flag_choices','2026-04-29 18:57:40.017375'),(6,'contenttypes','0002_remove_content_type_name','2026-04-29 18:57:40.456277'),(7,'auth','0002_alter_permission_name_max_length','2026-04-29 18:57:40.729623'),(8,'auth','0003_alter_user_email_max_length','2026-04-29 18:57:40.786241'),(9,'auth','0004_alter_user_username_opts','2026-04-29 18:57:40.813962'),(10,'auth','0005_alter_user_last_login_null','2026-04-29 18:57:41.082951'),(11,'auth','0006_require_contenttypes_0002','2026-04-29 18:57:41.100826'),(12,'auth','0007_alter_validators_add_error_messages','2026-04-29 18:57:41.125548'),(13,'auth','0008_alter_user_username_max_length','2026-04-29 18:57:41.407260'),(14,'auth','0009_alter_user_last_name_max_length','2026-04-29 18:57:41.675617'),(15,'auth','0010_alter_group_name_max_length','2026-04-29 18:57:41.739149'),(16,'auth','0011_update_proxy_permissions','2026-04-29 18:57:41.761811'),(17,'auth','0012_alter_user_first_name_max_length','2026-04-29 18:57:42.041407'),(18,'dashboard','0001_initial','2026-04-29 18:57:42.513526'),(19,'sessions','0001_initial','2026-04-29 18:57:42.706575'),(20,'dashboard','0002_alertlog_snapshot','2026-04-29 19:24:00.067012');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-04 13:05:06
