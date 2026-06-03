import React, { useRef } from 'react';
import useWindowStore from '../../store/useWindowStore';
import { IconDeviceDesktop, IconTrash, IconFolder, IconBrowser, IconFileText, IconPalette, IconCalculator, IconMusic, IconBomb, IconTerminal2, IconSettings, IconInfoCircle } from '@tabler/icons-react';

const WindowTitleBar = ({ windowData, isActive, setIsInteracting }) => {
  const { id, title, isMaximized } = windowData;
  const closeWindow = useWindowStore(state => state.closeWindow);
  const toggleMaximize = useWindowStore(state => state.toggleMaximize);
  const minimizeWindow = useWindowStore(state => state.minimizeWindow);
  const updateWindowPosition = useWindowStore(state => state.updateWindowPosition);
  
  const titleBarRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initialWinX: 0, initialWinY: 0 });

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;

    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialWinX: windowData.x,
      initialWinY: windowData.y,
      lastY: windowData.y
    };
    
    setIsInteracting?.(true);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging) return;
    
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    // Aero Snap Restore
    if (isMaximized) {
      if (deltaY > 5) {
        toggleMaximize(id);
        
        // Adjust the window's state X to center around the cursor so it doesn't jump
        const assumedWidth = windowData.width || 600;
        const newInitialX = e.clientX - (assumedWidth / 2);
        dragRef.current.initialWinX = newInitialX;
        dragRef.current.initialWinY = 0; // it was attached to the top
        dragRef.current.startX = e.clientX;
        dragRef.current.startY = e.clientY;
      }
      return; 
    }

    let newX = dragRef.current.initialWinX + deltaX;
    let newY = dragRef.current.initialWinY + deltaY;

    // Constrain Y to not go above screen or below taskbar
    if (newY < 0) newY = 0;
    if (newY > window.innerHeight - 60) newY = window.innerHeight - 60;
    
    // Constrain X so at least 50px of titlebar is grabbable
    const minX = -(windowData.width || 600) + 50;
    const maxX = window.innerWidth - 50;
    if (newX < minX) newX = minX;
    if (newX > maxX) newX = maxX;

    dragRef.current.lastY = newY;
    updateWindowPosition(id, newX, newY);
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;
    e.target.releasePointerCapture(e.pointerId);
    setIsInteracting?.(false);
    
    // Aero Snap to Maximize
    if (dragRef.current.lastY <= 0 && !isMaximized) {
      toggleMaximize(id);
    }
  };

  const titleBarStyle = {
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 4px 0 8px',
    cursor: isMaximized ? 'default' : 'default',
    userSelect: 'none',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1px',
    height: '20px',
  };

  const baseButtonStyle = {
    width: '26px',
    height: '20px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderTop: 'none',
    borderBottomLeftRadius: '3px',
    borderBottomRightRadius: '3px',
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(200,200,200,0.1))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 'normal',
    color: '#000',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -3px 5px rgba(255,255,255,0.2), 0 1px 3px rgba(0,0,0,0.3)',
    transition: 'all 0.1s',
    textShadow: '0 0 2px rgba(255,255,255,0.8)'
  };

  const closeButtonStyle = {
    ...baseButtonStyle,
    width: '43px',
    borderTopRightRadius: isMaximized ? '0' : '6px',
    background: 'linear-gradient(to bottom, rgba(220,100,100,0.7), rgba(180,30,30,0.6))',
    color: 'white',
    boxShadow: 'inset 0 1px 1px rgba(255,180,180,0.8), inset 0 -3px 5px rgba(200,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)',
    border: '1px solid rgba(150,0,0,0.6)',
    borderTop: 'none',
    textShadow: '0 0 2px rgba(0,0,0,0.8)'
  };

  const getTitleIcon = () => {
    const comp = windowData.component || '';
    const iconId = comp.replace('app-', '');
    return <img src={`/assets/icons/${iconId}.png`} onError={(e) => { e.target.style.display = 'none'; }} style={{ width: '16px', height: '16px' }} alt="" />;
  };

  return (
    <div 
      ref={titleBarRef}
      style={titleBarStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={() => toggleMaximize(id)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', color: isActive ? '#000' : '#555', filter: isActive ? 'drop-shadow(0px 0px 2px rgba(255,255,255,0.8))' : 'none' }}>
          {getTitleIcon()}
        </div>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: 'bold', 
          color: isActive ? '#000' : '#444',
          textShadow: isActive ? '0 0 5px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,1)' : 'none',
          letterSpacing: '0.2px'
        }}>
          {title}
        </span>
      </div>
      
      <div style={buttonContainerStyle} onPointerDown={(e) => e.stopPropagation()}>
        <button 
          style={baseButtonStyle} 
          onClick={() => minimizeWindow(id)}
          onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(200,230,255,0.7))'; e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 5px rgba(100,200,255,0.6), 0 1px 3px rgba(0,0,0,0.3)' }}
          onMouseOut={e => { e.currentTarget.style.background = baseButtonStyle.background; e.currentTarget.style.boxShadow = baseButtonStyle.boxShadow }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="1" y="7" width="8" height="2" fill="currentColor" />
          </svg>
        </button>
        <button 
          style={baseButtonStyle} 
          onClick={() => toggleMaximize(id)}
          onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(200,230,255,0.7))'; e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 5px rgba(100,200,255,0.6), 0 1px 3px rgba(0,0,0,0.3)' }}
          onMouseOut={e => { e.currentTarget.style.background = baseButtonStyle.background; e.currentTarget.style.boxShadow = baseButtonStyle.boxShadow }}
        >
          {isMaximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M 2 4 L 2 2 L 8 2 L 8 8 L 6 8" fill="none" stroke="currentColor" stroke-width="1.5" />
              <rect x="0.5" y="4.5" width="6" height="5" fill="none" stroke="currentColor" stroke-width="1.5" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1" />
              <rect x="1" y="1" width="8" height="2" fill="currentColor" />
            </svg>
          )}
        </button>
        <button 
          style={closeButtonStyle} 
          onClick={() => closeWindow(id)}
          onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(250,150,150,0.9), rgba(220,30,30,0.8))'; e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255,200,200,1), inset 0 -3px 5px rgba(255,50,50,0.8), 0 1px 3px rgba(0,0,0,0.3)' }}
          onMouseOut={e => { e.currentTarget.style.background = closeButtonStyle.background; e.currentTarget.style.boxShadow = closeButtonStyle.boxShadow }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M 1 1 L 11 11 M 1 11 L 11 1" stroke="white" stroke-width="2" stroke-linecap="round" />
            <path d="M 1 1 L 11 11 M 1 11 L 11 1" stroke="black" stroke-width="0.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WindowTitleBar;
