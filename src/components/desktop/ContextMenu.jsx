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
  const menuWidth = 200;
  const menuHeight = 150;
  const safeX = x + menuWidth > window.innerWidth ? window.innerWidth - menuWidth : x;
  const safeY = y + menuHeight > window.innerHeight ? window.innerHeight - menuHeight : y;

  const style = {
    position: 'absolute',
    left: safeX,
    top: safeY,
    width: `${menuWidth}px`,
    backgroundColor: '#f2f2f2',
    border: '1px solid #999',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
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
    margin: '2px 4px',
    border: 'none',
    borderTop: '1px solid #ccc',
    borderBottom: '1px solid #fff'
  };

  const handleRefresh = (e) => {
    e.stopPropagation();
    hideContextMenu();
    const bg = document.getElementById('desktop-bg');
    if (bg) {
      bg.style.display = 'none';
      setTimeout(() => bg.style.display = 'block', 50);
    }
  };

  const handlePersonalize = (e) => {
    e.stopPropagation();
    hideContextMenu();
    openWindow({
      id: 'app-control-panel',
      title: 'Control Panel',
      component: 'control-panel',
      width: 600,
      height: 450
    });
  };

  return (
    <div style={style} onMouseDown={(e) => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()}>
      <div style={itemStyle} onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#3399ff'; e.currentTarget.style.color = '#fff'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#000'}}>View</div>
      <div style={itemStyle} onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#3399ff'; e.currentTarget.style.color = '#fff'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#000'}}>Sort by</div>
      <div onClick={handleRefresh} style={itemStyle} onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#3399ff'; e.currentTarget.style.color = '#fff'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#000'}}>Refresh</div>
      <hr style={hrStyle} />
      <div onClick={handlePersonalize} style={itemStyle} onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#3399ff'; e.currentTarget.style.color = '#fff'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#000'}}>Personalize</div>
    </div>
  );
};

export default ContextMenu;
