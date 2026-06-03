import React, { useEffect } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import useWindowStore from '../../store/useWindowStore';

const ContextMenu = () => {
  const { visible, x, y } = useDesktopStore(state => state.contextMenu);
  const hideContextMenu = useDesktopStore(state => state.hideContextMenu);
  const openWindow = useWindowStore(state => state.openWindow);

  useEffect(() => {
    const handleGlobalClick = () => {
      if (visible) hideContextMenu();
    };
    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, [visible, hideContextMenu]);

  if (!visible) return null;

  // Prevent menu from overflowing screen
  const menuWidth = 150;
  const menuHeight = 150;
  const safeX = x + menuWidth > window.innerWidth ? window.innerWidth - menuWidth : x;
  const safeY = y + menuHeight > window.innerHeight ? window.innerHeight - menuHeight : y;

  const style = {
    position: 'absolute',
    left: safeX,
    top: safeY,
    width: `${menuWidth}px`,
    backgroundColor: '#f2f2f2',
    background: 'linear-gradient(to right, #e3e3e3 0px, #e3e3e3 26px, #f2f2f2 27px)',
    border: '1px solid #979797',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
    padding: '2px',
    zIndex: 10000,
    fontSize: '12px',
    color: '#000',
    display: 'flex',
    flexDirection: 'column'
  };

  const itemStyle = {
    padding: '4px 20px 4px 30px',
    cursor: 'default',
  };

  const hrStyle = {
    margin: '3px 2px 3px 28px',
    border: 'none',
    borderTop: '1px solid #e0e0e0',
    borderBottom: '1px solid #fff'
  };

  const handleRefresh = (e) => {
    e.stopPropagation();
    hideContextMenu();
    const icons = document.querySelectorAll('.desktop-icon-container');
    icons.forEach(icon => {
      icon.style.opacity = '0';
      setTimeout(() => icon.style.opacity = '1', 100);
    });
  };

  return (
    <div style={style} onMouseDown={(e) => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()}>
      <div 
        style={itemStyle} 
        onMouseOver={(e) => {e.currentTarget.style.backgroundColor = 'rgba(51, 153, 255, 0.2)'; e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(51, 153, 255, 0.6)'}} 
        onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'}}
      >View</div>
      <div 
        style={itemStyle} 
        onMouseOver={(e) => {e.currentTarget.style.backgroundColor = 'rgba(51, 153, 255, 0.2)'; e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(51, 153, 255, 0.6)'}} 
        onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'}}
      >Sort by</div>
      <div 
        onPointerDown={handleRefresh} 
        style={itemStyle} 
        onMouseOver={(e) => {e.currentTarget.style.backgroundColor = 'rgba(51, 153, 255, 0.2)'; e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(51, 153, 255, 0.6)'}} 
        onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'}}
      >Refresh</div>
    </div>
  );
};

export default ContextMenu;
