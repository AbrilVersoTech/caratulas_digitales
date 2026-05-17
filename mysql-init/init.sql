-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: caratulas_sistema
-- ------------------------------------------------------
-- Server version 9.6.0

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
-- SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
-- SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET FOREIGN_KEY_CHECKS = 0;

--
-- Table structure for table `acceso_maestro`
--

DROP TABLE IF EXISTS `acceso_maestro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acceso_maestro` (
  `ID_MASTER` int NOT NULL AUTO_INCREMENT,
  `USUARIO_ROL` varchar(50) NOT NULL DEFAULT 'DESARROLLADOR',
  `CLAVE_HASH` char(64) NOT NULL,
  `ULTIMA_CONEXION` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_MASTER`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acceso_maestro`
--

LOCK TABLES `acceso_maestro` WRITE;
/*!40000 ALTER TABLE `acceso_maestro` DISABLE KEYS */;
INSERT INTO `acceso_maestro` VALUES (1,'DIEGO_ABRIL_ADMIN','941cab9f56ef0e3ac2ca70f08dd0d7c9f730116976db3d8365f4403bb1a77843','2026-05-04 20:18:54');
/*!40000 ALTER TABLE `acceso_maestro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `codigos_acceso`
--

DROP TABLE IF EXISTS `codigos_acceso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `codigos_acceso` (
  `ID_CODIGO` int NOT NULL AUTO_INCREMENT,
  `CODIGO` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `USADO` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: Activo, 1: Consumido',
  `FECHA_CREACION` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FECHA_USO` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID_CODIGO`),
  UNIQUE KEY `CODIGO_UNIQUE` (`CODIGO`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codigos_acceso`
--

LOCK TABLES `codigos_acceso` WRITE;
/*!40000 ALTER TABLE `codigos_acceso` DISABLE KEYS */;
INSERT INTO `codigos_acceso` VALUES (1,'PETR-X92-SEC78-PRTL',1,'2026-05-03 20:41:28','2026-05-15 15:24:46'),(2,'SAFE-PX41-TOOL9-INDS',1,'2026-05-03 20:41:28','2026-05-15 15:35:22'),(3,'PRTL-SEC55-PETR-XA21',1,'2026-05-03 20:41:28','2026-05-15 15:46:33'),(4,'TOOL-ZX88-SAFE-PRT7',1,'2026-05-03 20:41:28','2026-05-15 16:32:18'),(5,'INDS-PX90-SEC44-PETR',1,'2026-05-03 20:41:28','2026-05-15 16:58:20'),(6,'PETR-TR55-SAFE-XP12',1,'2026-05-03 20:41:28','2026-05-15 16:59:55'),(7,'SEC88-PRTL-ZX09-TOOL',1,'2026-05-03 20:41:28','2026-05-16 21:40:00'),(8,'SAFE-PT77-INDS-QX91',1,'2026-05-03 20:41:28','2026-05-16 21:49:21'),(9,'TOOL-XA33-PETR-SEC5',0,'2026-05-03 20:41:28',NULL),(10,'PRTL-MX28-SAFE-TOOL',0,'2026-05-03 20:41:28',NULL),(11,'PETR-QW66-SEC91-INDS',0,'2026-05-03 20:41:28',NULL),(12,'SAFE-XP34-PRTL-ZA88',0,'2026-05-03 20:41:28',NULL),(13,'TOOL-SEC45-PX77-PETR',0,'2026-05-03 20:41:28',NULL),(14,'INDS-KL99-SAFE-PRTL',0,'2026-05-03 20:41:28',NULL),(15,'PETR-TOOL-XY51-SEC',0,'2026-05-03 20:41:28',NULL),(16,'SEC-PX83-PRTL-SAFE',0,'2026-05-03 20:41:28',NULL),(17,'SAFE-ZT72-PETR-INDS',0,'2026-05-03 20:41:28',NULL),(18,'TOOL-QX64-SEC88-PRTL',0,'2026-05-03 20:41:28',NULL),(19,'PRTL-XN11-SAFE-PETR',0,'2026-05-03 20:41:28',NULL),(20,'INDS-SEC39-PX55-TOOL',0,'2026-05-03 20:41:28',NULL),(21,'PETR-VX77-PRTL-SEC',0,'2026-05-03 20:41:28',NULL),(22,'SAFE-MT22-INDS-PX91',0,'2026-05-03 20:41:28',NULL),(23,'TOOL-XP84-PETR-SAFE',0,'2026-05-03 20:41:28',NULL),(24,'PRTL-QA63-SEC90-INDS',0,'2026-05-03 20:41:28',NULL),(25,'SEC-ZX11-TOOL-PETR',0,'2026-05-03 20:41:28',NULL),(26,'SAFE-PETR-XL49-PRTL',0,'2026-05-03 20:41:28',NULL),(27,'INDS-TR88-SEC57-SAFE',0,'2026-05-03 20:41:28',NULL),(28,'TOOL-PX21-PRTL-XC99',0,'2026-05-03 20:41:28',NULL),(29,'PETR-SAFE-ZQ44-SEC',0,'2026-05-03 20:41:28',NULL),(30,'PRTL-XM78-INDS-TOOL',0,'2026-05-03 20:41:28',NULL),(31,'SEC-QP50-PETR-PRTL',0,'2026-05-03 20:41:28',NULL),(32,'SAFE-TOOL-XA93-INDS',0,'2026-05-03 20:41:28',NULL),(33,'PETR-ZL61-SEC72-PX',0,'2026-05-03 20:41:28',NULL),(34,'INDS-XR47-SAFE-PRTL',0,'2026-05-03 20:41:28',NULL),(35,'TOOL-MX58-SEC13-PETR',0,'2026-05-03 20:41:28',NULL),(36,'PRTL-SAFE-QX70-TOOL',0,'2026-05-03 20:41:28',NULL),(37,'PETR-INDS-XA84-SEC',0,'2026-05-03 20:41:28',NULL),(38,'SAFE-ZP35-PRTL-PX77',0,'2026-05-03 20:41:28',NULL),(39,'TOOL-SEC92-INDS-XT',0,'2026-05-03 20:41:28',NULL),(40,'PRTL-VQ81-PETR-SAFE',0,'2026-05-03 20:41:28',NULL),(41,'SEC-XA25-TOOL-PRTL',0,'2026-05-03 20:41:28',NULL),(42,'SAFE-QW74-PETR-INDS',0,'2026-05-03 20:41:28',NULL),(43,'PETR-ZX56-SEC88-TOOL',0,'2026-05-03 20:41:28',NULL),(44,'INDS-PX60-SAFE-PRTL',0,'2026-05-03 20:41:28',NULL),(45,'TOOL-XM99-PETR-SEC',0,'2026-05-03 20:41:28',NULL),(46,'PRTL-TR41-INDS-SAFE',0,'2026-05-03 20:41:28',NULL),(47,'SEC-PETR-XQ73-TOOL',0,'2026-05-03 20:41:28',NULL),(48,'SAFE-LX52-PRTL-INDS',0,'2026-05-03 20:41:28',NULL),(49,'TOOL-PX87-SEC14-PETR',0,'2026-05-03 20:41:28',NULL),(50,'PETR-SAFE-XC68-PRTL',0,'2026-05-03 20:41:28',NULL);
/*!40000 ALTER TABLE `codigos_acceso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materias_sistema`
--

DROP TABLE IF EXISTS `materias_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias_sistema` (
  `ID_MATERIA` int NOT NULL AUTO_INCREMENT,
  `ID_PAIS` int NOT NULL,
  `NOMBRE_MATERIA` varchar(100) NOT NULL,
  `NIVEL_EDUCATIVO` enum('Básica','Superior') NOT NULL,
  `ICONO_EMOJI` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_MATERIA`),
  KEY `ID_PAIS` (`ID_PAIS`),
  CONSTRAINT `materias_sistema_ibfk_1` FOREIGN KEY (`ID_PAIS`) REFERENCES `paises_base` (`ID_PAIS`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materias_sistema`
--

LOCK TABLES `materias_sistema` WRITE;
/*!40000 ALTER TABLE `materias_sistema` DISABLE KEYS */;
INSERT INTO `materias_sistema` VALUES 
(1,1,'Lengua y Literatura','Básica',0xF09F939A),
(2,1,'Matemática','Básica',0xF09FA7AE),
(3,1,'Ciencias Naturales','Básica',0xF09F94AC),
(4,1,'Estudios Sociales','Básica',0xF09FA7AD),
(5,1,'Inglés','Básica',0xF09F92AC),
(6,1,'Educación Física','Básica',0xE29ABD),
(7,1,'Educación Cultural y Artística','Básica',0xF09F8EA8),
(8,1,'Cívica','Básica',0xE29A96),
(9,1,'Biología','Superior',0xF09F928A),
(10,1,'Física','Superior',0xE29AA1),
(11,1,'Química','Superior',0xF09FA7AA),
(12,1,'Historia','Superior',0xF09F939C),
(13,1,'Filosofía','Superior',0xF09FA7A0),
(14,1,'Educación para la Ciudadanía','Superior',0xF09F97B3),
(15,1,'Emprendimiento y Gestión','Superior',0xF09F9A80),
(16,2,'Lenguajes (Español/Inglés)','Básica',0xF09F97A3),
(17,2,'Saberes y Pensamiento Científico','Básica',0xF09FA7AE),
(18,2,'Ética, Naturaleza y Sociedad','Básica',0xF09F8C31),
(19,2,'De lo Humano y lo Comunitario','Básica',0xF09F91A5),
(20,2,'Matemáticas','Básica',0xF09F9390),
(21,2,'Ciencias Naturales','Básica',0xF09F94AC),
(22,2,'Biología','Superior',0xF09F928A),
(23,2,'Física','Superior',0xE29AA1),
(24,2,'Química','Superior',0xF09FA7AA),
(25,2,'Tecnología','Superior',0xF09F92BB),
(26,2,'Historia','Superior',0xF09F939C),
(27,2,'Geografía','Superior',0xF09F97BA),
(28,2,'Formación Cívica y Ética','Superior',0xE29A96),
(29,3,'Lengua Castellana','Básica',0xF09F9396),
(30,3,'Inglés','Básica',0xF09F92AC),
(31,3,'Matemáticas','Básica',0xF09FA7AE),
(32,3,'Ciencias Naturales','Básica',0xF09F94AC),
(33,3,'Ciencias Sociales','Básica',0xF09F8C8D),
(34,3,'Educación Artística','Básica',0xF09F8EAD),
(35,3,'Educación Física','Básica',0xE29ABD),
(36,3,'Tecnología e Informática','Básica',0xF09F97A5),
(37,3,'Filosofía','Superior',0xF09FA7A0),
(38,3,'Ciencias Políticas','Superior',0xF09F97B3),
(39,3,'Economía','Superior',0xF09F92B5),
(40,3,'Física','Superior',0xE29AA1),
(41,3,'Química','Superior',0xF09FA7AA),
(42,3,'Trigonometría','Superior',0xF09F9390),
(43,3,'Cálculo','Superior',0xF09F938A),
(44,3,'Emprendimiento','Superior',0xF09F92BC),
(45,4,'Prácticas del Lenguaje','Básica',0xF09F939D),
(46,4,'Matemática','Básica',0xF09FA7AE),
(47,4,'Ciencias Sociales','Básica',0xF09F8C8D),
(48,4,'Ciencias Naturales','Básica',0xF09F94AC),
(49,4,'Educación Física','Básica',0xE29ABD),
(50,4,'Plástica','Básica',0xF09F8EA8),
(51,4,'Música','Básica',0xF09F8EB5),
(52,4,'Formación Ética y Ciudadana','Básica',0xE29A96),
(53,4,'Lengua y Literatura','Superior',0xF09F939A),
(54,4,'Biología','Superior',0xF09F928A),
(55,4,'Físico-Química','Superior',0xE29A97),
(56,4,'Historia','Superior',0xF09F939C),
(57,4,'Geografía','Superior',0xF09F97BA),
(58,4,'Construcción de Ciudadanía','Superior',0xF09F97B3),
(59,4,'Filosofía','Superior',0xF09FA7A0),
(60,4,'Economía','Superior',0xF09F9388),
(61,5,'Lenguaje y Comunicación','Básica',0xF09F97A3),
(62,5,'Matemática','Básica',0xF09F9390),
(63,5,'Ciencias Naturales','Básica',0xF09F94AC),
(64,5,'Historia, Geografía y Ciencias Sociales','Básica',0xF09F8C8D),
(65,5,'Inglés','Básica',0xF09F92AC),
(66,5,'Artes Visuales','Básica',0xF09F8EA8),
(67,5,'Música','Básica',0xF09F8EB6),
(68,5,'Lengua y Literatura','Superior',0xF09F939A),
(69,5,'Biología','Superior',0xF09F928A),
(70,5,'Física','Superior',0xE29AA1),
(71,5,'Química','Superior',0xF09FA7AA),
(72,5,'Filosofía','Superior',0xF09FA7A0),
(73,5,'Educación Ciudadana','Superior',0xE29A96),
(74,5,'Tecnología','Superior',0xF09F92BB),
(75,6,'Comunicación','Básica',0xF09F97A3),
(76,6,'Matemática','Básica',0xF09FA7AE),
(77,6,'Personal Social','Básica',0xF09FA49D),
(78,6,'Ciencia y Tecnología','Básica',0xF09F92BB),
(79,6,'Arte y Cultura','Básica',0xF09F8EAD),
(80,6,'Educación Física','Básica',0xE29ABD),
(81,6,'Educación Religiosa','Básica',0xE29B8A),
(82,6,'Inglés','Básica',0xF09F92AC),
(83,6,'Desarrollo Personal, Ciudadanía y Cívica','Superior',0xE29A96),
(84,6,'Ciencias Sociales','Superior',0xF09F8C8D),
(85,6,'Biología','Superior',0xF09F928A),
(86,6,'Física','Superior',0xE29AA1),
(87,6,'Química','Superior',0xF09FA7AA),
(88,6,'Economía','Superior',0xF09F92B5),
(89,6,'Filosofía','Superior',0xF09FA7A0),
(90,7,'Língua Portuguesa','Básica',0xF09F939A),
(91,7,'Matemática','Básica',0xF09F9390),
(92,7,'Ciências','Básica',0xF09F94AC),
(93,7,'História','Básica',0xF09F939C),
(94,7,'Geografia','Básica',0xF09F97BA),
(95,7,'Educação Física','Básica',0xE29ABD),
(96,7,'Artes','Básica',0xF09F8EA8),
(97,7,'Inglês','Básica',0xF09F92AC),
(98,7,'Física','Superior',0xE29AA1),
(99,7,'Química','Superior',0xF09FA7AA),
(100,7,'Biologia','Superior',0xF09F928A),
(101,7,'Sociologia','Superior',0xF09F91A5),
(102,7,'Filosofia','Superior',0xF09FA7A0);
/*!40000 ALTER TABLE `materias_sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paises_base`
--

DROP TABLE IF EXISTS `paises_base`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paises_base` (
  `ID_PAIS` int NOT NULL AUTO_INCREMENT,
  `NOMBRE_PAIS` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `BANDERA_EMOJI` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID_PAIS`),
  UNIQUE KEY `NOMBRE_PAIS` (`NOMBRE_PAIS`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paises_base`
--

LOCK TABLES `paises_base` WRITE;
/*!40000 ALTER TABLE `paises_base` DISABLE KEYS */;
INSERT INTO `paises_base` VALUES 
(1,'Ecuador',0xF09F87EAF09F87A8),
(2,'México',0xF09F87B2F09F87BD),
(3,'Colombia',0xF09F87A8F09F87B4),
(4,'Argentina',0xF09F87A6F09F87B7),
(5,'Chile',0xF09F87A8F09F87B1),
(6,'Perú',0xF09F87B5F09F87EA),
(7,'Brasil',0xF09F87A7F09F87B7);
/*!40000 ALTER TABLE `paises_base` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos_arte`
--

DROP TABLE IF EXISTS `recursos_arte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos_arte` (
  `ID_ARTE` int NOT NULL AUTO_INCREMENT,
  `ID_MATERIA` int NOT NULL,
  `RUTA_ARCHIVO` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_ARTE`),
  KEY `ID_MATERIA` (`ID_MATERIA`),
  CONSTRAINT `recursos_arte_ibfk_1` FOREIGN KEY (`ID_MATERIA`) REFERENCES `materias_sistema` (`ID_MATERIA`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos_arte`
--

LOCK TABLES `recursos_arte` WRITE;
/*!40000 ALTER TABLE `recursos_arte` DISABLE KEYS */;
INSERT INTO `recursos_arte` VALUES (1,1,'/caratulas/ecuador/basica/lenguajeBasica.webp'),(2,2,'/caratulas/ecuador/basica/matematicasBasica.webp'),(3,3,'/caratulas/ecuador/basica/cienciasnaturalesBasica.webp'),(4,4,'/caratulas/ecuador/basica/estudiosocialesBasica.webp'),(5,5,'/caratulas/ecuador/basica/inglesBasica.webp'),(6,6,'/caratulas/ecuador/basica/culturafisicaBasica.webp'),(7,7,'/caratulas/ecuador/basica/artesBasica.webp'),(8,8,'/caratulas/ecuador/basica/civicaBasica.webp'),(9,9,'/caratulas/ecuador/superior/biologiaSuperior.webp'),(10,10,'/caratulas/ecuador/superior/fisicaSuperior.webp'),(11,11,'/caratulas/ecuador/superior/quimicaSuperior.webp'),(12,12,'/caratulas/ecuador/superior/historiaSuperior.webp'),(13,13,'/caratulas/ecuador/superior/filosofiaSuperior.webp'),(14,14,'/caratulas/ecuador/superior/civicaSuperior.webp'),(15,15,'/caratulas/ecuador/superior/emprendimientoSuperior.webp'),(16,9,'/caratulas/ecuador/superior/biologiaSuperior.webp'),(17,10,'/caratulas/ecuador/superior/fisicaSuperior.webp'),(18,11,'/caratulas/ecuador/superior/quimicaSuperior.webp'),(19,12,'/caratulas/ecuador/superior/historiaSuperior.webp'),(20,13,'/caratulas/ecuador/superior/filosofiaSuperior.webp'),(21,14,'/caratulas/ecuador/superior/civicaSuperior.webp'),(22,15,'/caratulas/ecuador/superior/emprendimientoSuperior.webp'),(23,16,'/caratulas/mexico/basica/lenguajesBasica.webp'),(24,17,'/caratulas/mexico/basica/saberesBasica.webp'),(25,18,'/caratulas/mexico/basica/eticaBasica.webp'),(26,19,'/caratulas/mexico/basica/humanoBasica.webp'),(27,20,'/caratulas/mexico/basica/matematicasBasica.webp'),(28,21,'/caratulas/mexico/basica/cienciasBasico.webp'),(29,22,'/caratulas/mexico/superior/biologiaSuperior.webp'),(30,23,'/caratulas/mexico/superior/fisicaSuperior.webp'),(31,24,'/caratulas/mexico/superior/quimicaBasica.webp'),(32,25,'/caratulas/mexico/superior/tecnologiaSuperior.webp'),(33,26,'/caratulas/mexico/superior/historiaSuperior.webp'),(34,27,'/caratulas/mexico/superior/geografiaSuperior.webp'),(35,28,'/caratulas/mexico/superior/formacioncivicaSuperior.webp'),(36,29,'/caratulas/colombia/basica/lenguacastellanaBasica.webp'),(37,30,'/caratulas/colombia/basica/inglesBasica.webp'),(38,31,'/caratulas/colombia/basica/matematicaBasica.webp'),(39,32,'/caratulas/colombia/basica/cienciasnaturalesBasica.webp'),(40,33,'/caratulas/colombia/basica/cienciasocialesBasica.webp'),(41,34,'/caratulas/colombia/basica/artisticaBasica.webp'),(42,35,'/caratulas/colombia/basica/educacionfisicaBasica.webp'),(43,36,'/caratulas/colombia/basica/informaticaBasica.webp'),(44,37,'/caratulas/colombia/superior/filosofiaSuperior.webp'),(45,38,'/caratulas/colombia/superior/cienciaspoliticasSuperior.webp'),(46,39,'/caratulas/colombia/superior/economiaSuperior.webp'),(47,40,'/caratulas/colombia/superior/fisicaSuperior.webp'),(48,41,'/caratulas/colombia/superior/quimicaSuperior.webp'),(49,42,'/caratulas/colombia/superior/trigonometriaSuperior.webp'),(50,43,'/caratulas/colombia/superior/calculoSuperior.webp'),(51,44,'/caratulas/colombia/superior/emprendimientoSuperior.webp'),(52,45,'/caratulas/argentina/basica/practicaslenguajeBasica.webp'),(53,46,'/caratulas/argentina/basica/matematicasBasica.webp'),(54,47,'/caratulas/argentina/basica/cienciasocialesBasica.webp'),(55,48,'/caratulas/argentina/basica/cienciasnaturalesBasica.webp'),(56,49,'/caratulas/argentina/basica/educacionfisicaBasica.webp'),(57,50,'/caratulas/argentina/basica/plasticaBasica.webp'),(58,51,'/caratulas/argentina/basica/musicaBasica.webp'),(59,52,'/caratulas/argentina/basica/eticaBasica.webp'),(60,53,'/caratulas/argentina/suoerior/literaturaSuperior.webp'),(61,54,'/caratulas/argentina/suoerior/biologiaSuperior.webp'),(62,55,'/caratulas/argentina/suoerior/fisocoquimicaSperior.webp'),(63,56,'/caratulas/argentina/suoerior/historiaSuperior.webp'),(64,57,'/caratulas/argentina/suoerior/geografiaSuperior.webp'),(65,58,'/caratulas/argentina/suoerior/ciudadaniaSuperior.webp'),(66,59,'/caratulas/argentina/suoerior/filosofiaSuperior.webp'),(67,60,'/caratulas/argentina/suoerior/economia-superior.webp'),(68,61,'/caratulas/chile/basica/lenguajecomunicacionBasica.webp'),(69,62,'/caratulas/chile/basica/matematicaBasica.webp'),(70,63,'/caratulas/chile/basica/cienciasnaturalesBasica.webp'),(71,64,'/caratulas/chile/basica/historiageografiacsBasica.webp'),(72,65,'/caratulas/chile/basica/inglesBasica.webp'),(73,66,'/caratulas/chile/basica/artesvisualesBasica.webp'),(74,67,'/caratulas/chile/basica/musicaBasica.webp'),(75,68,'/caratulas/chile/superior/lengualiteraturaSuperior.webp'),(76,69,'/caratulas/chile/superior/biologiaSperior.webp'),(77,70,'/caratulas/chile/superior/fisicaSuperior.webp'),(78,71,'/caratulas/chile/superior/quimicaSuperior.webp'),(79,73,'/caratulas/chile/superior/educacionciudadanaSuperior.webp'),(80,72,'/caratulas/chile/superior/filosofiaSuperior.webp'),(81,74,'/caratulas/chile/superior/tecnologiaSuperior.webp'),(82,75,'/caratulas/peru/basica/comunicacionBasica.webp'),(83,76,'/caratulas/peru/basica/matematicasBasica.webp'),(84,78,'/caratulas/peru/basica/cienciatecnologiaBasica.webp'),(85,77,'/caratulas/peru/basica/personalsocialBasico.webp'),(86,82,'/caratulas/peru/basica/inglesBasica.webp'),(87,79,'/caratulas/peru/basica/arteculturaBasica.webp'),(88,80,'/caratulas/peru/basica/educacionfisicaBasica.webp'),(89,81,'/caratulas/peru/basica/educacionreligiosaBasica.webp'),(90,85,'/caratulas/peru/superior/biologiaSuperior.webp'),(91,86,'/caratulas/peru/superior/fisicaSuperior.webp'),(92,87,'/caratulas/peru/superior/quimicaSuperior.webp'),(93,84,'/caratulas/peru/superior/cienciassocialesSuperior.webp'),(94,83,'/caratulas/peru/superior/desarrollocivicaSuperior.webp'),(95,89,'/caratulas/peru/superior/filosofiaSuperior.webp'),(96,88,'/caratulas/peru/superior/ecoonomiaSuperior.webp'),(113,96,'/caratulas/brasil/basica/artesBasica.webp'),(114,92,'/caratulas/brasil/basica/cienciasBasica.webp'),(115,95,'/caratulas/brasil/basica/educacion fisicaBasica.webp'),(116,94,'/caratulas/brasil/basica/geografiaBasica.webp'),(117,93,'/caratulas/brasil/basica/historiaBasica.webp'),(118,97,'/caratulas/brasil/basica/inglesBasica.webp'),(119,90,'/caratulas/brasil/basica/linguaportuguesaBasica.webp'),(120,91,'/caratulas/brasil/basica/matematicaBasica.webp'),(121,100,'/caratulas/brasil/superior/biologiaSuperior.webp'),(122,102,'/caratulas/brasil/superior/filosofiaSuperior.webp'),(123,98,'/caratulas/brasil/superior/fisicaSuperior.webp'),(124,99,'/caratulas/brasil/superior/quimicaSuperior.webp'),(125,101,'/caratulas/brasil/superior/sociologiaSuperior.webp');
/*!40000 ALTER TABLE `recursos_arte` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-16 18:48:30