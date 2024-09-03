const DB_NAME = 'GeoNotesDB';
const DB_VERSION = 1;
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
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
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
}

function openDatabase() {
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