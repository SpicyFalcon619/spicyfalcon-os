import React, { useEffect } from 'react';
import useDesktopStore from '../../store/useDesktopStore';

const ContextMenu = () => {
  const { visible, x, y } = useDesktopStore(state => state.contextMenu);
  const hideContextMenu = useDesktopStore(state => state.hideContextMenu);

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

  return (
    <div style={style} onMouseDown={(e) => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()}>
      <div style={itemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3399ff'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>View</div>
      <div style={itemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3399ff'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Sort by</div>
      <div style={itemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3399ff'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Refresh</div>
      <hr style={hrStyle} />
      <div style={itemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3399ff'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Personalize</div>
    </div>
  );
};

export default ContextMenu;
