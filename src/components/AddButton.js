import React from 'react';
import { useNavigate } from 'react-router-dom';


function AddButton() {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/detail');
    };
  

  return (
    <div className="add-button" onClick={handleClick}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
    </div>
  );
}

export default AddButton;