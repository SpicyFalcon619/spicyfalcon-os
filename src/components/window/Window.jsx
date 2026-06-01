import React, { useRef } from 'react';
import useWindowStore from '../../store/useWindowStore';
import WindowTitleBar from './WindowTitleBar';

const Window = ({ windowData }) => {
  const { id, title, x, y, width, height, isMinimized, isMaximized, zIndex } = windowData;
  const focusWindow = useWindowStore(state => state.focusWindow);
  const activeWindowId = useWindowStore(state => state.activeWindowId);

  const windowRef = useRef(null);
  const isActive = activeWindowId === id;

  if (isMinimized) {
    // Hidden completely for Phase 1. In Phase 2 we will animate to taskbar
    return null; 
  }

  // Windows 7 Aero Glass styles
  const windowStyle = {
    position: 'absolute',
    left: isMaximized ? 0 : x,
    top: isMaximized ? 0 : y,
    width: isMaximized ? '100vw' : width,
    height: isMaximized ? 'calc(100vh - var(--taskbar-height))' : height,
    zIndex,
    backgroundColor: 'var(--aero-glass-bg)',
    backdropFilter: 'var(--aero-glass-blur)',
    WebkitBackdropFilter: 'var(--aero-glass-blur)',
    border: '1px solid var(--aero-glass-border)',
    borderRadius: isMaximized ? 0 : 'var(--window-border-radius)',
    boxShadow: isActive ? 'var(--aero-glass-shadow)' : '0 2px 10px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'width 0.1s, height 0.1s', // Smooth maximizing, but no transition on left/top to avoid drag lag
  };

  const handlePointerDown = () => {
    focusWindow(id);
  };

  return (
    <div 
      ref={windowRef} 
      style={windowStyle} 
      onPointerDown={handlePointerDown}
    >
      <WindowTitleBar 
        windowData={windowData} 
        isActive={isActive} 
      />
      <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #ccc', margin: '0 4px 4px 4px', overflow: 'auto' }}>
        {/* Content goes here based on window component type in Phase 3 */}
        <div style={{ padding: '20px', color: '#000' }}>
          <h2>{title}</h2>
          <p>This is a draggable Windows 7 style window component.</p>
        </div>
      </div>
    </div>
  );
};

export default Window;
