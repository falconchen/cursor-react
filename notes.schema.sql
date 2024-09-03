DROP TABLE IF EXISTS notes;
CREATE TABLE notes (
  id UUID PRIMARY KEY,
  user_id UUID,
  content TEXT,
  location_note TEXT,
  location TEXT,
  images TEXT,  -- 存储图片URL或路径的JSON数组
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 添加索引以提高查询性能
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_notes_is_deleted ON notes(is_deleted);
