import React, { useState } from 'react';
import useConfigStore from '../../store/useConfigStore';
import useWindowStore from '../../store/useWindowStore';

const WALLPAPERS = [
  {
    id: 'default',
    name: 'Windows 7 Default',
    value: '/assets/wallpapers/windows7-bg.jpg',
    preview: 'url("/assets/wallpapers/windows7-bg.jpg")'
  },
  {
    id: 'architecture',
    name: 'Architecture',
    value: '/assets/wallpapers/architecture.jpg',
    preview: 'url("/assets/wallpapers/architecture.jpg")'
  },
  {
    id: 'characters',
    name: 'Characters',
    value: '/assets/wallpapers/characters.jpg',
    preview: 'url("/assets/wallpapers/characters.jpg")'
  },
  {
    id: 'landscapes',
    name: 'Landscapes',
    value: '/assets/wallpapers/landscapes.jpg',
    preview: 'url("/assets/wallpapers/landscapes.jpg")'
  },
  {
    id: 'nature',
    name: 'Nature',
    value: '/assets/wallpapers/nature.jpg',
    preview: 'url("/assets/wallpapers/nature.jpg")'
  },
  {
    id: 'scenes',
    name: 'Scenes',
    value: '/assets/wallpapers/scenes.jpg',
    preview: 'url("/assets/wallpapers/scenes.jpg")'
  },
  {
    id: 'dark',
    name: 'Solid Dark',
    value: '#1e1e1e',
    preview: '#1e1e1e'
  }
];

const DisplayProperties = ({ windowData }) => {
  const currentWallpaper = useConfigStore(state => state.wallpaper);
  const setWallpaper = useConfigStore(state => state.setWallpaper);
  const closeWindow = useWindowStore(state => state.closeWindow);
  
  const [selected, setSelected] = useState(() => {
    const found = WALLPAPERS.find(w => w.value === currentWallpaper);
    return found ? found.id : 'default';
  });

  const selectedWallpaper = WALLPAPERS.find(w => w.id === selected) || WALLPAPERS[0];

  const handleApply = () => {
    setWallpaper(selectedWallpaper.value);
  };

  const handleOk = () => {
    handleApply();
    closeWindow(windowData.id);
  };

  const handleCancel = () => {
    closeWindow(windowData.id);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Segoe UI", Tahoma, sans-serif',
      fontSize: '12px',
      color: '#000'
    }}>
      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, padding: '15px', gap: '20px', overflow: 'hidden' }}>
        
        {/* Left Column: Wallpaper List */}
        <div style={{ flex: '0 0 200px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Desktop Background:</label>
          <div style={{
            flex: 1,
            backgroundColor: '#fff',
            border: '1px solid #999',
            overflowY: 'auto',
            padding: '5px'
          }}>
            {WALLPAPERS.map(wp => (
              <div 
                key={wp.id}
                onClick={() => setSelected(wp.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  cursor: 'pointer',
                  backgroundColor: selected === wp.id ? '#3399ff' : 'transparent',
                  color: selected === wp.id ? '#fff' : '#000',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '24px',
                  marginRight: '8px',
                  border: '1px solid #ccc',
                  background: wp.value.includes('url') ? wp.preview : wp.value
                }} />
                <span>{wp.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Preview Pane */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ marginBottom: '5px', alignSelf: 'flex-start', fontWeight: 'bold' }}>Preview:</label>
          <div style={{
            width: '280px',
            height: '210px',
            border: '1px solid #666',
            borderRadius: '4px',
            position: 'relative',
            background: selectedWallpaper.value.includes('url') ? selectedWallpaper.preview : selectedWallpaper.value,
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Fake desktop elements in preview */}
            <div style={{ padding: '10px', display: 'flex', gap: '5px', flexDirection: 'column' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '2px' }} />
              <div style={{ width: '20px', height: '20px', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '2px' }} />
            </div>
            
            {/* Fake taskbar in preview */}
            <div style={{ 
              height: '20px', 
              width: '100%', 
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(100,100,100,0.4))',
              backdropFilter: 'blur(4px)',
              borderTop: '1px solid rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 5px'
            }}>
               <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#0078d7' }} />
            </div>
          </div>
          
          <div style={{ marginTop: '15px', color: '#666', textAlign: 'center', maxWidth: '280px' }}>
            Select a background from the list to preview it here. Click Apply to save changes.
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div style={{
        padding: '12px 15px',
        backgroundColor: '#f0f0f0',
        borderTop: '1px solid #dfdfdf',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px'
      }}>
        <button onClick={handleOk} style={btnStyle}>OK</button>
        <button onClick={handleCancel} style={btnStyle}>Cancel</button>
        <button onClick={handleApply} style={btnStyle}>Apply</button>
      </div>
    </div>
  );
};

const btnStyle = {
  minWidth: '75px',
  padding: '4px 12px',
  fontFamily: '"Segoe UI", Tahoma, sans-serif',
  fontSize: '12px',
  border: '1px solid #999',
  borderRadius: '3px',
  backgroundColor: '#e1e1e1',
  cursor: 'pointer'
};

export default DisplayProperties;
