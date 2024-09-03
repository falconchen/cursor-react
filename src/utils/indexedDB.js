let db;
const DB_NAME = 'GeoNotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

export async function initDB() {
  if (!db) {
    db = await openDatabase();
  }
  return db;
}

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject('打开数据库失败');
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function resetDatabase() {
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