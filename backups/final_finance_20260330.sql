-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: localhost    Database: final_finance
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assets`
--
create database   final_finance;
use final_finance;

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `symbol` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exchange` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_zh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `asset_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sector` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `industry` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isin` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_assets_symbol_exchange` (`symbol`,`exchange`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `script` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','<< Flyway Baseline >>','BASELINE','<< Flyway Baseline >>',NULL,'root','2026-03-30 08:17:28',0,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_positions`
--

DROP TABLE IF EXISTS `portfolio_positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_positions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `portfolio_id` bigint NOT NULL,
  `asset_id` bigint NOT NULL,
  `quantity` decimal(20,6) NOT NULL DEFAULT '0.000000',
  `avg_cost` decimal(20,6) NOT NULL DEFAULT '0.000000',
  `cost_basis` decimal(20,2) NOT NULL DEFAULT '0.00',
  `market_value` decimal(20,2) NOT NULL DEFAULT '0.00',
  `unrealized_pnl` decimal(20,2) NOT NULL DEFAULT '0.00',
  `unrealized_pnl_pct` decimal(10,4) NOT NULL DEFAULT '0.0000',
  `portfolio_weight` decimal(10,4) NOT NULL DEFAULT '0.0000',
  `last_price` decimal(20,6) DEFAULT NULL,
  `price_as_of` datetime DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_positions_portfolio_asset` (`portfolio_id`,`asset_id`),
  KEY `fk_positions_asset` (`asset_id`),
  KEY `idx_positions_portfolio` (`portfolio_id`),
  CONSTRAINT `fk_positions_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`),
  CONSTRAINT `fk_positions_portfolio` FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_positions`
--

LOCK TABLES `portfolio_positions` WRITE;
/*!40000 ALTER TABLE `portfolio_positions` DISABLE KEYS */;
/*!40000 ALTER TABLE `portfolio_positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolios`
--

DROP TABLE IF EXISTS `portfolios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base_currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolios`
--

LOCK TABLES `portfolios` WRITE;
/*!40000 ALTER TABLE `portfolios` DISABLE KEYS */;
INSERT INTO `portfolios` VALUES (1,'Default Portfolio','USD',1,'Single-user default portfolio','2026-03-30 16:14:37','2026-03-30 16:14:37');
/*!40000 ALTER TABLE `portfolios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `portfolio_id` bigint NOT NULL,
  `asset_id` bigint NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trade_date` date NOT NULL,
  `quantity` decimal(20,6) NOT NULL,
  `price` decimal(20,6) NOT NULL,
  `gross_amount` decimal(20,2) NOT NULL,
  `commission` decimal(20,2) NOT NULL DEFAULT '0.00',
  `tax` decimal(20,2) NOT NULL DEFAULT '0.00',
  `net_amount` decimal(20,2) NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_transactions_portfolio_trade_date` (`portfolio_id`,`trade_date`),
  KEY `idx_transactions_asset_trade_date` (`asset_id`,`trade_date`),
  CONSTRAINT `fk_transactions_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`),
  CONSTRAINT `fk_transactions_portfolio` FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'final_finance'
--

--
-- Dumping routines for database 'final_finance'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-30 16:20:02

-- ============================================================
-- Mock Test Data (inserted 2026-03-31)
-- ============================================================

USE final_finance;

-- -----------------------------------------------------------
-- 1. Assets (10只热门美股 / ETF)
-- -----------------------------------------------------------
INSERT INTO `assets` (`symbol`, `exchange`, `name`, `name_zh`, `asset_type`, `currency`, `country`, `sector`, `industry`, `isin`, `icon_url`, `status`) VALUES
('AAPL',  'NASDAQ', 'Apple Inc.',                     '苹果公司',       'STOCK', 'USD', 'US', 'Technology',      'Consumer Electronics',       'US0378331005', NULL, 'ACTIVE'),
('MSFT',  'NASDAQ', 'Microsoft Corporation',           '微软公司',       'STOCK', 'USD', 'US', 'Technology',      'Software - Infrastructure',  'US5949181045', NULL, 'ACTIVE'),
('GOOGL', 'NASDAQ', 'Alphabet Inc.',                   '谷歌母公司',     'STOCK', 'USD', 'US', 'Communication',   'Internet Content',           'US02079K3059', NULL, 'ACTIVE'),
('AMZN',  'NASDAQ', 'Amazon.com Inc.',                 '亚马逊',         'STOCK', 'USD', 'US', 'Consumer Cyclical','Internet Retail',            'US0231351067', NULL, 'ACTIVE'),
('TSLA',  'NASDAQ', 'Tesla Inc.',                      '特斯拉',         'STOCK', 'USD', 'US', 'Consumer Cyclical','Auto Manufacturers',         'US88160R1014', NULL, 'ACTIVE'),
('NVDA',  'NASDAQ', 'NVIDIA Corporation',              '英伟达',         'STOCK', 'USD', 'US', 'Technology',      'Semiconductors',             'US67066G1040', NULL, 'ACTIVE'),
('META',  'NASDAQ', 'Meta Platforms Inc.',             'Meta (脸书)',    'STOCK', 'USD', 'US', 'Communication',   'Internet Content',           'US30303M1027', NULL, 'ACTIVE'),
('JPM',   'NYSE',   'JPMorgan Chase & Co.',            '摩根大通',       'STOCK', 'USD', 'US', 'Financial',       'Banks - Diversified',        'US46625H1005', NULL, 'ACTIVE'),
('VOO',   'NYSE',   'Vanguard S&P 500 ETF',            '标普500ETF',    'ETF',   'USD', 'US', NULL,              NULL,                         'US9229083632', NULL, 'ACTIVE'),
('QQQ',   'NASDAQ', 'Invesco QQQ Trust',               '纳指100ETF',    'ETF',   'USD', 'US', NULL,              NULL,                         'US46090E1038', NULL, 'ACTIVE');

-- -----------------------------------------------------------
-- 2. Portfolio Positions (基于 portfolio_id=1 的默认作品集)
--    假设上面 INSERT 后 assets id 从 1 开始
-- -----------------------------------------------------------
INSERT INTO `portfolio_positions` (`portfolio_id`, `asset_id`, `quantity`, `avg_cost`, `cost_basis`, `market_value`, `unrealized_pnl`, `unrealized_pnl_pct`, `portfolio_weight`, `last_price`, `price_as_of`) VALUES
(1, 1,   50.000000,  165.320000,   8266.00,  10850.00,   2584.00, 31.2600, 0.1950, 217.000000, '2026-03-30 16:00:00'),
(1, 2,   30.000000,  310.500000,   9315.00,  12600.00,   3285.00, 35.2700, 0.2270, 420.000000, '2026-03-30 16:00:00'),
(1, 3,   20.000000,  130.800000,   2616.00,   3520.00,    904.00, 34.5600, 0.0630, 176.000000, '2026-03-30 16:00:00'),
(1, 4,   15.000000,  145.200000,   2178.00,   2805.00,    627.00, 28.7900, 0.0500, 187.000000, '2026-03-30 16:00:00'),
(1, 5,   25.000000,  220.600000,   5515.00,   4450.00,  -1065.00,-19.3100, 0.0800, 178.000000, '2026-03-30 16:00:00'),
(1, 6,   40.000000,  480.250000,  19210.00,  36000.00,  16790.00, 87.4000, 0.6480, 900.000000, '2026-03-30 16:00:00'),
(1, 7,   18.000000,  290.100000,   5221.80,   9180.00,   3958.20, 75.8000, 0.1650, 510.000000, '2026-03-30 16:00:00'),
(1, 8,   35.000000,  155.400000,   5439.00,   7350.00,   1911.00, 35.1300, 0.1320, 210.000000, '2026-03-30 16:00:00'),
(1, 9,   60.000000,  420.000000,  25200.00,  30000.00,   4800.00, 19.0500, 0.5400, 500.000000, '2026-03-30 16:00:00'),
(1, 10,  45.000000,  380.200000,  17109.00,  21600.00,   4491.00, 26.2500, 0.3890, 480.000000, '2026-03-30 16:00:00');

-- -----------------------------------------------------------
-- 3. Transactions (模拟买入/卖出交易记录)
-- -----------------------------------------------------------
INSERT INTO `transactions` (`portfolio_id`, `asset_id`, `type`, `trade_date`, `quantity`, `price`, `gross_amount`, `commission`, `tax`, `net_amount`, `currency`, `note`) VALUES
-- AAPL 买入
(1, 1, 'BUY',  '2025-06-15', 30.000000, 155.800000,  4674.00, 4.99, 0.00,  4678.99, 'USD', '初始建仓 Apple'),
(1, 1, 'BUY',  '2025-09-20', 20.000000, 179.600000,  3592.00, 4.99, 0.00,  3596.99, 'USD', '加仓 Apple'),
-- MSFT 买入
(1, 2, 'BUY',  '2025-05-10', 30.000000, 310.500000,  9315.00, 4.99, 0.00,  9319.99, 'USD', '建仓 Microsoft'),
-- GOOGL 买入
(1, 3, 'BUY',  '2025-07-08', 20.000000, 130.800000,  2616.00, 4.99, 0.00,  2620.99, 'USD', '建仓 Google'),
-- AMZN 买入
(1, 4, 'BUY',  '2025-08-12', 15.000000, 145.200000,  2178.00, 4.99, 0.00,  2182.99, 'USD', '建仓 Amazon'),
-- TSLA 买入 + 部分卖出
(1, 5, 'BUY',  '2025-04-01', 40.000000, 210.300000,  8412.00, 4.99, 0.00,  8416.99, 'USD', '建仓 Tesla'),
(1, 5, 'SELL', '2025-11-15', 15.000000, 245.000000,  3675.00, 4.99, 0.00,  3670.01, 'USD', '部分止盈 Tesla'),
-- NVDA 买入
(1, 6, 'BUY',  '2025-03-20', 25.000000, 450.000000, 11250.00, 4.99, 0.00, 11254.99, 'USD', '建仓 NVIDIA'),
(1, 6, 'BUY',  '2025-10-05', 15.000000, 530.670000,  7960.05, 4.99, 0.00,  7965.04, 'USD', '加仓 NVIDIA'),
-- META 买入
(1, 7, 'BUY',  '2025-06-22', 18.000000, 290.100000,  5221.80, 4.99, 0.00,  5226.79, 'USD', '建仓 Meta'),
-- JPM 买入
(1, 8, 'BUY',  '2025-07-30', 35.000000, 155.400000,  5439.00, 4.99, 0.00,  5443.99, 'USD', '建仓 JPMorgan'),
-- VOO 定投
(1, 9, 'BUY',  '2025-01-15', 20.000000, 410.000000,  8200.00, 0.00, 0.00,  8200.00, 'USD', 'VOO 定投第1期'),
(1, 9, 'BUY',  '2025-04-15', 20.000000, 425.000000,  8500.00, 0.00, 0.00,  8500.00, 'USD', 'VOO 定投第2期'),
(1, 9, 'BUY',  '2025-07-15', 20.000000, 435.000000,  8700.00, 0.00, 0.00,  8700.00, 'USD', 'VOO 定投第3期'),
-- QQQ 买入
(1, 10, 'BUY', '2025-02-10', 25.000000, 370.000000,  9250.00, 4.99, 0.00,  9254.99, 'USD', '建仓 QQQ'),
(1, 10, 'BUY', '2025-08-20', 20.000000, 392.950000,  7859.00, 4.99, 0.00,  7863.99, 'USD', '加仓 QQQ');
