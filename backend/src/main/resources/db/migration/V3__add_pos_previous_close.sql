-- 使用预处理语句实现幂等性：如果列已存在则跳过，不存在则添加
SET @dbname = DATABASE();
SET @tablename = 'portfolio_positions';
SET @columnname = 'previous_close';

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1 AS status_info', -- 列已存在，执行一个无副作用的查询
  'ALTER TABLE portfolio_positions ADD COLUMN previous_close DECIMAL(19, 4) DEFAULT NULL AFTER last_price'
));

PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
