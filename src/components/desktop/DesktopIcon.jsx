import React, { useRef } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import useWindowStore from '../../store/useWindowStore';
import { IconDeviceDesktop, IconTrash, IconFolder, IconBrowser, IconPalette } from '@tabler/icons-react';

const getIconComponent = (id) => {
  switch(id) {
    case 'computer': return <IconDeviceDesktop size={40} stroke={1.5} color="#fff" fill="#2c89f0" />;
    case 'recycle-bin': return <IconTrash size={40} stroke={1.5} color="#fff" fill="#888" />;
    case 'explorer': return <IconFolder size={40} stroke={1.5} color="#fff" fill="#fcd34d" />;
    case 'ie': return <IconBrowser size={40} stroke={1.5} color="#fff" fill="#38bdf8" />;
    case 'paint': return <IconPalette size={40} stroke={1.5} color="#fff" fill="#fb923c" />;
    case 'task-manager': return <IconDeviceDesktop size={40} stroke={1.5} color="#fff" fill="#10b981" />;
    case 'device-manager': return <IconDeviceDesktop size={40} stroke={1.5} color="#fff" fill="#6366f1" />;
    case 'photo-viewer': return <IconPalette size={40} stroke={1.5} color="#fff" fill="#ec4899" />;
    default: return <IconFolder size={40} stroke={1.5} color="#fff" fill="#fcd34d" />;
  }
};

const DesktopIcon = ({ iconData }) => {
  const { id, title, x, y } = iconData;
  // For recycle-bin: use iconFull when it has items (isEmpty=false), icon when empty
  const iconSrc = (iconData.iconFull && iconData.isEmpty === false)
    ? iconData.iconFull
    : (iconData.icon || `/assets/icons/${id}.png`);
  const [imgError, setImgError] = React.useState(false);
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
    if (iconData.component === 'external-link') {
      openWindow({
        id: `app-ie-${id}`,
        title: title || 'Internet Explorer',
        component: 'ie',
        width: 800,
        height: 600,
        appData: { url: iconData.appData.url }
      });
      return;
    }
    openWindow({
      id: `app-${id}`,
      title: title,
      component: iconData.component || id,
      width: 800,
      height: 600,
      appData: iconData.appData || null
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
    backgroundColor: isSelected ? 'rgba(0, 88, 214, 0.3)' : 'transparent',
    border: isSelected ? '1px dotted rgba(255, 255, 255, 0.5)' : '1px solid transparent',
    borderRadius: '4px',
    boxShadow: isSelected ? '0 0 4px rgba(0,0,0,0.2)' : 'none',
  };

  return (
    <div 
      ref={iconRef}
      data-desktop-icon="true"
      className="desktop-icon-container"
      style={containerStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
    >
      <div style={{ marginBottom: '4px', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))', pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '40px', height: '40px' }}>
        {!imgError ? (
          <img 
            src={iconSrc} 
            onError={() => setImgError(true)} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            alt="" 
          />
        ) : getIconComponent(id)}
      </div>
      <div style={{
        color: 'white',
        fontSize: '12px',
        textAlign: 'center',
        textShadow: '0 1px 2px black, 0 1px 4px black',
        lineHeight: '1.2',
        backgroundColor: 'transparent',
        padding: '2px 4px',
        pointerEvents: 'none'
      }}>
        {title}
      </div>
    </div>
  );
};

export default DesktopIcon;
