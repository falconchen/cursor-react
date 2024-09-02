    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      github_id TEXT UNIQUE,
      google_id TEXT UNIQUE,
      name TEXT,
      avatar_url TEXT,
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    