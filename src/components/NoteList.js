import React, { useEffect, useState } from 'react';
import NoteItem from './NoteItem';

function NoteList() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch('/api/notes')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('请求失败');
      })
      .then(data => {
        if (data.success) {
          setNotes(data.notes);
        } else {
          throw new Error('返回数据异常');
        }
      })
      .catch(error => console.error('获取notes出错:', error));
  }, []);

  return (
    <div className="note-list">
      {notes.map((note, index) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  );
}

export default NoteList;
