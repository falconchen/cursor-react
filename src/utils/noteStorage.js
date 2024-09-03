let db;
const DB_NAME = 'GeoNotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

async function initDB() {
  if (!db) {
    db = await openDatabase();
  }
  return db;
}

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
      // if (!database.objectStoreNames.contains(STORE_NAME)) {
      //   reject(new Error(`对象存储 '${STORE_NAME}' 不存在`));
      //   return;
      // }
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
      // 重试保存过程
      return saveNoteToIndexedDB(noteData);
    } else {
      throw error;
    }
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject('打开数据库失败');

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function resetDatabase() {
  if (db) {
    db.close();
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onerror = () => reject('重置数据库失败');
    request.onsuccess = () => {
      console.log('数据库已重置');
      db = null;
      resolve();
    };
  });
}