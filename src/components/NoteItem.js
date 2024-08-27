import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function NoteItem({ note }) {
  const qrRef = useRef(null);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/detail');
  };
  useEffect(() => {
    if (note.hasQR && qrRef.current && !qrRef.current.hasChildNodes()) {
      const canvas = document.createElement('canvas');
      canvas.width = 60;
      canvas.height = 60;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000';
      for(let i = 0; i < 5; i++) {
        for(let j = 0; j < 5; j++) {
          if(Math.random() > 0.5) {
            ctx.fillRect(i*12, j*12, 10, 10);
          }
        }
      }
      qrRef.current.appendChild(canvas);
    }
  }, [note.hasQR]);


  return (
    <div className="note-item" onClick={handleClick}>
      <div className="note-content">
        <div>{note.content}</div>
        <div className="note-meta">距离当前位置 {note.distance} 米</div>
      </div>
      {note.hasQR && <div className="qr-code" ref={qrRef}></div>}
    </div>
  );
}

export default NoteItem;
