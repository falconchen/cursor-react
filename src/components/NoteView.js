import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function NoteView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // 在这里从服务器获取指定 id 的笔记数据
    fetch(`/api/notes/${id}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('请求失败');
      })
      .then(data => {
        if (data.success) {
          setNote(data.note);
        } else {
          throw new Error('返回数据异常');
        }
      })
      .catch(error => {
        console.error('获取笔记数据失败:', error);
        setError(error.message);
      });
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  const handleEdit = () => {
    navigate(`/detail/edit/${id}`);
  };

  const handleImageClick = (image, index) => {
    setSelectedImage({ image, index });
  };

  const handleCloseViewer = () => {
    setSelectedImage(null);
  };

  const handlePrevImage = (event) => {
    event.stopPropagation();
    if (selectedImage.index > 0) {
      setSelectedImage({
        image: note.images[selectedImage.index - 1],
        index: selectedImage.index - 1,
      });
    } else {
      setSelectedImage({
        image: note.images[note.images.length - 1],
        index: note.images.length - 1,
      });
    }
  };

  const handleNextImage = (event) => {
    event.stopPropagation();
    if (selectedImage.index < note.images.length - 1) {
      setSelectedImage({
        image: note.images[selectedImage.index + 1],
        index: selectedImage.index + 1,
      });
    } else {
      setSelectedImage({
        image: note.images[0],
        index: 0,
      });
    }
  };

  if (error) {
    return <div>错误: {error}</div>;
  }

  if (!note) {
    return <div>加载中...</div>;
  }

  return (
    <>
      <header>
        <svg className="icon" viewBox="0 0 24 24" fill="#333" onClick={handleBack}>
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        <span className="header-title">笔记详情</span>
        <div className="header-actions">
          <svg className="icon" viewBox="0 0 24 24" fill="#333" onClick={handleEdit}>
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </div>
      </header>
      
      <div className="view-container">
        <div className="view-section">
          <div className="view-content">{note.content}</div>
        </div>
        
        {note.images && note.images.length > 0 && (
          <div className="view-section image-preview-section">
            {note.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`笔记图片 ${index + 1}`} 
                className="preview-image"
                onClick={() => handleImageClick(image, index)}
              />
            ))}
          </div>
        )}
        
        {note.location && (
          <div className="view-section location-section">
            <div className="location-info">
              <svg className="location-icon" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>{note.location}</span>
            </div>
            {note.location_note && (
              <div className="location-note">{note.location_note}</div>
            )}
          </div>
        )}
        
        <div className="view-section time-section">
          <span>创建时间: {note.created_at}</span>
          <span>更新时间: {note.updated_at}</span>
        </div>
      </div>
      
      {selectedImage && (
        <div className="image-viewer" onClick={handleCloseViewer}>
          <img
            src={selectedImage.image}
            alt="放大的图片"
            className="viewer-image"
            draggable="false"
            onDragStart={() => {}} // 空函数，防止拖拽
            onClick={(event) => event.stopPropagation()}
          />
          {note.images.length > 1 && (
            <>
              <div className="prev-arrow" onClick={handlePrevImage}></div>
              <div className="next-arrow" onClick={handleNextImage}></div>
            </>
          )}
          <div className="close-viewer" onClick={handleCloseViewer}>
            &times;
          </div>
        </div>
      )}
    </>
  );
}

export default NoteView;