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
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GeoNotesDB', 1);

    request.onerror = (event) => reject('打开数据库失败');

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');

      const addRequest = store.add(noteData);

      addRequest.onerror = (event) => reject('添加数据失败');
      addRequest.onsuccess = (event) => resolve();
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
    };
  });
}