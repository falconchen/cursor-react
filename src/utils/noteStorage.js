import { initDB, resetDatabase } from './indexedDB';

const STORE_NAME = 'notes';

export async function saveNoteToD1(noteData) {
  const response = await fetch('/api/save-note', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    throw new Error('保存到D1数据库失败');
  }
}

export async function saveNoteToIndexedDB(noteData) {
  try {
    const database = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const noteWithTimestamp = {
        ...noteData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: false
      };

      const addRequest = store.add(noteWithTimestamp);

      addRequest.onerror = () => reject('添加数据失败');
      addRequest.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error('保存笔记到IndexedDB时出错:', error);
    if (error.name === 'NotFoundError' || error instanceof DOMException) {
      console.log('数据库或对象存储不存在，尝试重置数据库');
      await resetDatabase();
      await initDB();
      // 重试���存过程
      return saveNoteToIndexedDB(noteData);
    } else {
      throw error;
    }
  }
}