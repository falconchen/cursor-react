import React from 'react';
import NoteItem from './NoteItem';

function NoteList() {
  const notes = [
    { content: 'WiFi名: Xs\nWiFi密码: Mi******nh05', distance: 2.37 },
    { content: '启迪停车场', distance: 48.46, hasQR: true },
    { content: '世贸广场停车缴费', distance: 503.0, hasQR: true },
    { content: '门禁密码 *2254', distance: 2004.04 },
    { content: '青龙湖停车场', distance: 2304.05, hasQR: true },
  ];

  return (
    <div className="note-list">
      {notes.map((note, index) => (
        <NoteItem key={index} note={note} />
      ))}
    </div>
  );
}

export default NoteList;
