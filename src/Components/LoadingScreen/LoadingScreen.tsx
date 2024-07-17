import React from 'react';
import "./LoadingScreen.css"



function LoadingScreen() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
     <div className="loader"></div>
    </div>
  );
}

export default LoadingScreen;