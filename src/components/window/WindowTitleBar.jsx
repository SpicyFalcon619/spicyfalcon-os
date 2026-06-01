import React, { useRef } from 'react';
import useWindowStore from '../../store/useWindowStore';
import { IconDeviceDesktop, IconTrash, IconFolder, IconBrowser, IconFileText, IconPalette, IconCalculator, IconMusic, IconBomb, IconTerminal2, IconSettings } from '@tabler/icons-react';

const WindowTitleBar = ({ windowData, isActive }) => {
  const { id, title, isMaximized } = windowData;
  const closeWindow = useWindowStore(state => state.closeWindow);
  const toggleMaximize = useWindowStore(state => state.toggleMaximize);
  const minimizeWindow = useWindowStore(state => state.minimizeWindow);
  const updateWindowPosition = useWindowStore(state => state.updateWindowPosition);
  
  const titleBarRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initialWinX: 0, initialWinY: 0 });

  const handlePointerDown = (e) => {
    if (e.button !== 0 || isMaximized) return;

    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialWinX: windowData.x,
      initialWinY: windowData.y
    };
    
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging) return;
    
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    updateWindowPosition(
      id, 
      dragRef.current.initialWinX + deltaX, 
      dragRef.current.initialWinY + deltaY
    );
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;
    e.target.releasePointerCapture(e.pointerId);
  };

  const titleBarStyle = {
    height: 'var(--titlebar-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 6px 0 10px',
    background: isActive 
      ? 'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.0) 100%)' 
      : 'linear-gradient(to bottom, rgba(230,230,230,0.6) 0%, rgba(230,230,230,0.2) 50%, rgba(230,230,230,0.0) 100%)',
    cursor: isMaximized ? 'default' : 'default',
    userSelect: 'none',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '2px',
    height: '20px',
  };

  const baseButtonStyle = {
    width: '28px',
    height: '20px',
    border: '1px solid rgba(0,0,0,0.4)',
    borderRadius: '3px',
    background: 'linear-gradient(to bottom, #f0f0f0, #c0c0c0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#000',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,1)',
  };

  const closeButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(to bottom, #f5a5a5, #c22929)',
    color: 'white',
    boxShadow: 'inset 0 1px 1px rgba(255,200,200,1)',
    border: '1px solid #701010',
  };

  const getTitleIcon = () => {
    const comp = windowData.component || '';
    if (comp.includes('computer')) return <IconDeviceDesktop size={16} stroke={2} />;
    if (comp.includes('recycle-bin')) return <IconTrash size={16} stroke={2} />;
    if (comp.includes('explorer')) return <IconFolder size={16} stroke={2} />;
    if (comp.includes('ie')) return <IconBrowser size={16} stroke={2} />;
    if (comp.includes('notepad')) return <IconFileText size={16} stroke={2} />;
    if (comp.includes('paint')) return <IconPalette size={16} stroke={2} />;
    if (comp.includes('calculator')) return <IconCalculator size={16} stroke={2} />;
    if (comp.includes('spotify')) return <IconMusic size={16} stroke={2} />;
    if (comp.includes('minesweeper')) return <IconBomb size={16} stroke={2} />;
    if (comp.includes('cmd')) return <IconTerminal2 size={16} stroke={2} />;
    return <IconSettings size={16} stroke={2} />;
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
        <button style={baseButtonStyle} onClick={() => minimizeWindow(id)}>_</button>
        <button style={baseButtonStyle} onClick={() => toggleMaximize(id)}>{isMaximized ? '❐' : '□'}</button>
        <button style={closeButtonStyle} onClick={() => closeWindow(id)}>X</button>
      </div>
    </div>
  );
};

export default WindowTitleBar;
