// src/utils/syncNotes.js
import { saveNoteToD1 } from './noteStorage';

export async function syncNotesWithServer() {
  const db = await openDatabase();
  const notes = await getAllNotes(db);

  for (const note of notes) {
    try {
      await saveNoteToD1(note);
      await deleteNoteFromIndexedDB(note.id);
    } catch (error) {
      console.error('同步笔记失败:', error);
      // 可以在这里添加重试逻辑或通知用户
    }
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GeoNotesDB', 1);
    request.onerror = () => reject('打开数据库失败');
    request.onsuccess = (event) => resolve(event.target.result);
  });
}

function getAllNotes(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['notes'], 'readonly');
    const store = transaction.objectStore('notes');
    const request = store.getAll();
    request.onerror = () => reject('获取笔记失败');
    request.onsuccess = () => resolve(request.result);
  });
}

function deleteNoteFromIndexedDB(noteId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GeoNotesDB', 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const deleteRequest = store.delete(noteId);
      deleteRequest.onerror = () => reject('删除笔记失败');
      deleteRequest.onsuccess = () => resolve();
    };
  });
}