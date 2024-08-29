import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import markerIcon from '../images/markerDefault.png'; // 导入图片

function NoteDetail() {
  const navigate = useNavigate();
  const { mode } = useParams();
  const [note, setNote] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [location, setLocation] = useState('正在获取位置...');
  const mapRef = useRef(null);
  const imageUploadRef = useRef(null);
  // const [map, setMap] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragStart, setDragStart] = useState(null);

  const initMap = useCallback(() => {
    if (!mapRef.current) return;

    const newMap = new window.TMap.Map(mapRef.current, {      
      center: new window.TMap.LatLng(39.984104, 116.307503),
      zoom:15,   //设置地图缩放级别            
      pitch: 0, // 俯仰度
      rotation: 0, // 旋转角度
      draggable: true, // 允许用户拖动地图
      scrollwheel: true // 允许���使用滚缩放地图
    });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`纬度: ${latitude.toFixed(6)}, 经度: ${longitude.toFixed(6)}`);
          updateMapPosition(newMap, latitude, longitude);
        },
        (error) => {
          console.error("错误: " + error.message);
          setLocation('无法获取位置');
        }
      );
    } else {
      setLocation('不支持地理定位');
    }

    // 添加标记
    const marker = new window.TMap.MultiMarker({
      map: newMap,
      styles: {
        "marker": new window.TMap.MarkerStyle({
          "width": 25,
          "height": 35,
          "anchor": { x: 16, y: 32 },
          // "src": markerIcon // 使用导入的本地图片
        })
      },
      geometries: [{
        "id": "1",
        "styleId": "marker",
        "position": newMap.getCenter(),
        "properties": {
          "title": "当前位置"
        }
      }]
    });

    // 允许用户拖动标记
    marker.on("dragend", (e) => {
      const position = e.geometry.position;
      newMap.setCenter(position);
      setLocation(`纬度: ${position.lat.toFixed(6)}, 经度: ${position.lng.toFixed(6)}`);
    });

  }, []);

  useEffect(() => {
    if (!window.TMap) {
      const script = document.createElement('script');
      script.src = 'https://map.qq.com/api/gljs?v=1.exp&key=WXJBZ-2IS35-GPRIZ-QMI4R-4S6G2-SDBZQ';
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, [initMap]);

  const updateMapPosition = (mapInstance, lat, lng) => {
    const position = new window.TMap.LatLng(lat, lng);
    mapInstance.setCenter(position);

    // 添加检查
    // console.log('mapInstance 是 TMap.Map 的实例:', mapInstance instanceof window.TMap.Map);
    // console.log('mapInstance:', mapInstance);

    new window.TMap.MultiMarker({
      map: mapInstance,
      styles: {
        "marker": new window.TMap.MarkerStyle({
          "width": 25,
          "height": 35,
          "anchor": { x: 16, y: 32 },
          // "src": markerIcon // 使用导入的本地图片
        })
      },
      geometries: [{
        "id": "1",
        "styleId": "marker",
        "position": position,
        "properties": {
          "title": "当前位置"
        }
      }]
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这个笔记吗？')) {
      alert('笔记已删除');
      navigate('/');
    }
  };

  const handleSave = () => {
    alert(`笔记已保存${locationNote ? '，地点备注：' + locationNote : ''}`);
    navigate('/');
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = function (e) {
        uploadedImages.push(e.target.result);
        if (uploadedImages.length === files.length) {
          setPreviewImages([...previewImages, ...uploadedImages]);
        }
      };

      reader.readAsDataURL(file);
    }
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
        image: previewImages[selectedImage.index - 1],
        index: selectedImage.index - 1,
      });
    } else {
      setSelectedImage({
        image: previewImages[previewImages.length - 1],
        index: previewImages.length - 1,
      });
    }
  };

  const handleNextImage = (event) => {
    event.stopPropagation();
    if (selectedImage.index < previewImages.length - 1) {
      setSelectedImage({
        image: previewImages[selectedImage.index + 1],
        index: selectedImage.index + 1,
      });
    } else {
      setSelectedImage({
        image: previewImages[0],
        index: 0,
      });
    }
  };

  const handleDragStart = (event) => {
    setDragStart(event.clientX);
  };

  const handleDragEnd = (event) => {
    const dragEnd = event.clientX;
    if (dragEnd - dragStart > 50) {
      handlePrevImage();
    } else if (dragStart - dragEnd > 50) {
      handleNextImage();
    }
    setDragStart(null);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);

    if (selectedImage && selectedImage.index === index) {
      setSelectedImage(null);
    } else if (selectedImage && selectedImage.index > index) {
      setSelectedImage({
        image: selectedImage.image,
        index: selectedImage.index - 1,
      });
    }
  };

  return (
    <>
      <header>
        <svg className="icon" viewBox="0 0 24 24" fill="#333" onClick={handleBack}>
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        <span className="header-title">{mode === 'add' ? '添加笔记' : '编辑笔记'}</span>
        <div className="header-actions">
          <svg className="icon" viewBox="0 0 24 24" fill="#333" onClick={handleDelete}>
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </div>
      </header>
      
      <div className="edit-container">
        <div className="edit-section">
          <textarea 
            className="edit-textarea" 
            placeholder="输入笔记内容"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        
                
        <div className="edit-section image-upload-section" ref={imageUploadRef} onClick={() => document.getElementById('imageUpload').click()}>
          <svg className="image-upload-icon" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <span className="image-upload-text">上传图片（可选）</span>
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} style={{display: 'none'}} />
        </div>
        
        {previewImages.length > 0 && (
          <div className="image-preview-section">
            {previewImages.map((image, index) => (
              <div
                key={index}
                className="image-container"
                onClick={() => handleImageClick(image, index)}
              >
                <img src={image} alt={`预览图片 ${index + 1}`} className="preview-image" />
                <div className="image-remove" onClick={(event) => {
                  event.stopPropagation();
                  handleRemoveImage(index);
                }}>
                  &times;
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedImage && (
          <div className="image-viewer" onClick={handleCloseViewer}>
            <img
              src={selectedImage.image}
              alt="放大的图片"
              className="viewer-image"
              draggable="false"
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onClick={(event) => event.stopPropagation()}
            />
            {previewImages.length > 1 && (
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
        
        <div className="edit-section location-section">
          <div className="location-info">
            <svg className="location-icon" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span id="locationText">{location}</span>
          </div>
          <input 
            type="text" 
            className="location-note-input" 
            placeholder="地点备注（可选）" 
            value={locationNote}
            onChange={(e) => setLocationNote(e.target.value)}
          />
          <div id="map" ref={mapRef} style={{ height: '300px', width: '100%' }}></div>
        </div>
        
        <button className="save-button" onClick={handleSave}>保存</button>
      </div>
    </>
  );
}

export default NoteDetail;
