CREATE TABLE IF NOT EXISTS wallet_account (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL DEFAULT 'default_user' COMMENT '用户标识（预留）',
    balance DECIMAL(18, 2) NOT NULL DEFAULT 0.00 COMMENT '钱包余额',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新记录',
    UNIQUE KEY uk_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='全局钱包账户表';

-- 初始化默认用户（即当前客户端）的钱包配置，初始余额为 0
INSERT IGNORE INTO wallet_account (id, user_id, balance) VALUES (1, 'default_user', 0.00);
