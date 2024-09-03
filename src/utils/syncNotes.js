// src/utils/syncNotes.js
import { saveNoteToD1 } from './noteStorage';
import { initDB, resetDatabase } from './indexedDB';

const DB_NAME = 'GeoNotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

export async function syncNotesWithServer() {
  try {
    await initDB();
    const notes = await getAllNotes();
    
    for (const note of notes) {
      try {
        // 保存笔记到 D1 数据库
        await saveNoteToD1(note);
        
        // 从本地 IndexedDB 删除笔记
        await deleteNoteFromIndexedDB(note.id);
        
        console.log(`笔记 ${note.id} 已同步并从本地删除`);
      } catch (error) {
        console.error(`同步笔记 ${note.id} 失败:`, error);
        // 可以选择在这里添加重试逻辑或跳过继续下一个
      }
    }
    
    console.log('所有笔记同步完成');
  } catch (error) {
    console.error('同步笔记时出错:', error);
    if (error.name === 'NotFoundError' || error instanceof DOMException) {
      console.log('数据库或对象存储不存在，尝试重置数据库');
      await resetDatabase();
      await initDB();
      // 重试同步过程
      await syncNotesWithServer();
    }
  }
}

async function getAllNotes() {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    if (!database.objectStoreNames.contains(STORE_NAME)) {
      reject(new Error(`对象存储 '${STORE_NAME}' 不存在`));
      return;
    }
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onerror = () => reject('获取笔记失败');
    request.onsuccess = () => resolve(request.result);
  });
}

function deleteNoteFromIndexedDB(noteId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(noteId);
      deleteRequest.onerror = () => reject('删除笔记失败');
      deleteRequest.onsuccess = () => resolve();
    };
  });
}