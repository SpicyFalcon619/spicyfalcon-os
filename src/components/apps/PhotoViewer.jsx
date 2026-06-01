import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconZoomIn, IconZoomOut, IconRotateClockwise, IconInfoCircle } from '@tabler/icons-react';

const MOCK_IMAGES = [
  { id: 1, url: 'https://picsum.photos/seed/1/800/600', title: 'Mountain Hike', description: 'A beautiful trip up the northern trails. The air was crisp and the view was breathtaking. This is one of my favorite memories from 2012.' },
  { id: 2, url: 'https://picsum.photos/seed/2/800/600', title: 'City Lights', description: 'Downtown at midnight. The contrast between the dark sky and the vibrant neon signs always fascinated me. Captured on an old DSLR.' },
  { id: 3, url: 'https://picsum.photos/seed/3/800/600', title: 'Setup 2010', description: 'My old gaming rig before the major upgrades. Nostalgic.' },
];

const PhotoViewer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(true);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % MOCK_IMAGES.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + MOCK_IMAGES.length) % MOCK_IMAGES.length);

  const currentImage = MOCK_IMAGES[currentIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#eef3fa', fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>
      
      {/* File menu (Windows Photo Viewer style) */}
      <div style={{ display: 'flex', gap: '15px', padding: '4px 10px', borderBottom: '1px solid #cdd5e0', backgroundColor: '#f5f8fb', fontSize: '12px' }}>
        <span>File</span>
        <span>Print</span>
        <span>E-mail</span>
        <span>Burn</span>
        <span>Open</span>
      </div>

      {/* Main Image Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#eef3fa', overflow: 'hidden' }}>
        
        {/* Image */}
        <img 
          src={currentImage.url} 
          alt={currentImage.title} 
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} 
        />

        {/* Creative Description Overlay */}
        <div style={{
          position: 'absolute',
          bottom: showInfo ? '0' : '-100px',
          left: 0,
          right: 0,
          padding: '20px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
          color: 'white',
          transition: 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {currentImage.title}
          </h2>
          <p style={{ margin: 0, fontSize: '13px', maxWidth: '80%', lineHeight: '1.4', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            {currentImage.description}
          </p>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div style={{ height: '40px', backgroundColor: '#f0f4f9', borderTop: '1px solid #d9e1eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <button style={btnStyle}><IconZoomIn size={20} color="#333" /></button>
        <button style={btnStyle}><IconZoomOut size={20} color="#333" /></button>
        
        <div style={{ width: '1px', height: '24px', backgroundColor: '#ccc' }}></div>
        
        <button style={btnStyle} onClick={prevImage}><IconChevronLeft size={24} color="#0058d6" /></button>
        <button style={btnStyle} onClick={nextImage}><IconChevronRight size={24} color="#0058d6" /></button>
        
        <div style={{ width: '1px', height: '24px', backgroundColor: '#ccc' }}></div>
        
        <button style={btnStyle}><IconRotateClockwise size={20} color="#333" /></button>
        <button style={btnStyle} onClick={() => setShowInfo(!showInfo)}>
          <IconInfoCircle size={20} color={showInfo ? '#0058d6' : '#333'} />
        </button>
      </div>

    </div>
  );
};

const btnStyle = {
  background: 'none',
  border: '1px solid transparent',
  borderRadius: '3px',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export default PhotoViewer;
