import React, { useRef } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import useWindowStore from '../../store/useWindowStore';

const DesktopIcon = ({ iconData }) => {
  const { id, title, icon, x, y } = iconData;
  const isSelected = useDesktopStore(state => state.selectedIconIds.includes(id));
  const selectIcon = useDesktopStore(state => state.selectIcon);
  const updateIconPosition = useDesktopStore(state => state.updateIconPosition);
  const openWindow = useWindowStore(state => state.openWindow);
  
  const iconRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handlePointerDown = (e) => {
    e.stopPropagation(); 
    selectIcon(id, e.ctrlKey || e.shiftKey);
    
    if (e.button !== 0) return;

    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: x,
      initialY: y,
    };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging) return;
    
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    updateIconPosition(id, dragRef.current.initialX + deltaX, dragRef.current.initialY + deltaY);
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;
    e.target.releasePointerCapture(e.pointerId);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    openWindow({
      id: `app-${id}`,
      title: title,
      component: id,
      width: 800,
      height: 600
    });
  };

  const containerStyle = {
    position: 'absolute',
    left: x,
    top: y,
    width: '74px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '4px',
    cursor: 'default',
    zIndex: 'var(--z-desktop-icons)',
    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
    border: isSelected ? '1px dotted rgba(255, 255, 255, 0.6)' : '1px solid transparent',
    borderRadius: '4px',
    boxShadow: isSelected ? 'inset 0 0 5px rgba(255,255,255,0.4)' : 'none',
  };

  return (
    <div 
      ref={iconRef}
      style={containerStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
    >
      <div style={{ fontSize: '32px', marginBottom: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
        {icon}
      </div>
      <div style={{
        color: 'white',
        fontSize: '12px',
        textAlign: 'center',
        textShadow: '0 1px 2px black',
        lineHeight: '1.2',
        wordBreak: 'break-word',
        backgroundColor: isSelected ? '#0b59a6' : 'transparent',
        padding: '0 2px',
        pointerEvents: 'none'
      }}>
        {title}
      </div>
    </div>
  );
};

export default DesktopIcon;
