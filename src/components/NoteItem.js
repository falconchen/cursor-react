import React from 'react';
import { useNavigate } from 'react-router-dom';

function NoteItem({ note }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/note/${note.id}`); // 修改为跳转到笔记详情页
  };

  return (
    <div className="note-item" onClick={handleClick}>
      <div className="note-content">
        <div>{note.content}</div>
        <div className="note-meta">          
          {note.location_note && <div>{note.location_note}</div>}
          {/* <span>距离当前位置 {note.distance} 米</span> */}          
          <span>更新时间: {note.updated_at}</span>
          
        </div>
      </div>
      {note.images && note.images.length > 0 && (
        <div className="note-image">
          <img src={note.images[0]} alt="note" />
        </div>
      )}
    </div>
  );
}

export default NoteItem;
