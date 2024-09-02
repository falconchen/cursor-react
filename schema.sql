    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id UUID PRIMARY KEY,      
      platform_uid TEXT UNIQUE,
      name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP      
    );
    -- 添加索引
    CREATE INDEX idx_platform_uid ON users(platform_uid);