import React, { useState, useEffect } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import useConfigStore from '../../store/useConfigStore';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import ContextMenu from './ContextMenu';
import BootScreen from '../shared/BootScreen';
import { IconDeviceMobileMessage } from '@tabler/icons-react';
import { AnimatePresence } from 'framer-motion';

const Desktop = ({ children }) => {
  const icons = useDesktopStore(state => state.icons);
  const clearSelection = useDesktopStore(state => state.clearSelection);
  const setSelection = useDesktopStore(state => state.setSelection);
  const showContextMenu = useDesktopStore(state => state.showContextMenu);
  const [isMobile, setIsMobile] = useState(false);
  const [selectionBox, setSelectionBox] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePointerDown = (e) => {
    if (e.target.id === 'desktop-bg') {
      clearSelection();
      setSelectionBox({
        startX: e.clientX,
        startY: e.clientY,
        x: e.clientX,
        y: e.clientY,
        width: 0,
        height: 0
      });
      e.currentTarget.setPointerCapture(e.pointerId);
    } else if (e.target.closest && !e.target.closest('[data-no-deselect]')) {
      clearSelection();
    }
  };

  const handlePointerMove = (e) => {
    if (selectionBox) {
      const currentX = e.clientX;
      const currentY = e.clientY;
      const x = Math.min(selectionBox.startX, currentX);
      const y = Math.min(selectionBox.startY, currentY);
      const width = Math.abs(currentX - selectionBox.startX);
      const height = Math.abs(currentY - selectionBox.startY);
      
      setSelectionBox(prev => ({ ...prev, x, y, width, height }));

      const selectedIds = [];
      icons.forEach(icon => {
         const ix = icon.x;
         const iy = icon.y;
         const iw = 74;
         const ih = 80;

         if (ix < x + width && ix + iw > x && iy < y + height && iy + ih > y) {
           selectedIds.push(icon.id);
         }
      });
      setSelection(selectedIds);
    }
  };

  const handlePointerUp = (e) => {
    if (selectionBox) {
      setSelectionBox(null);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    // Only show desktop context menu when clicking on the actual desktop bg or desktop icons
    // If a window or app consumed the event, it should have called stopPropagation
    const target = e.target;
    const isDesktopBg = target.id === 'desktop-bg' || target.closest('[data-desktop-icon]');
    if (!isDesktopBg) return;
    showContextMenu(e.clientX, e.clientY);
  };

  if (isMobile) {
    return (
      <div style={{ 
        width: '100%', height: '100%', 
        backgroundColor: '#00539c', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <IconDeviceMobileMessage size={64} style={{ marginBottom: '20px' }} />
        <h2 style={{ marginBottom: '10px' }}>Best Viewed on Desktop</h2>
        <p style={{ lineHeight: '1.5' }}>
          This experience is a fully-featured window manager designed for desktop environments with a mouse and keyboard.
          Please visit on a wider screen to enjoy the nostalgic SpicyFalcon OS!
        </p>
      </div>
    );
  }

  const wallpaper = useConfigStore(state => state.wallpaper);

  return (
    <div 
      id="desktop-bg"
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        backgroundImage: wallpaper.startsWith('#') || wallpaper.startsWith('rgb') ? 'none' : `url('${wallpaper}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: wallpaper.startsWith('#') || wallpaper.startsWith('rgb') ? wallpaper : '#00539c',
        overflow: 'hidden'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={handleContextMenu}
    >
      <BootScreen />

      {selectionBox && (
        <div style={{
          position: 'absolute',
          left: selectionBox.x,
          top: selectionBox.y,
          width: selectionBox.width,
          height: selectionBox.height,
          backgroundColor: 'rgba(0, 88, 214, 0.3)',
          border: '1px solid rgba(0, 88, 214, 0.8)',
          pointerEvents: 'none',
          zIndex: 9999
        }} />
      )}

      {/* Desktop Icons */}
      {icons.map(icon => (
        <DesktopIcon key={icon.id} iconData={icon} />
      ))}

      {/* Application Windows */}
      <AnimatePresence>
        {children}
      </AnimatePresence>

      <StartMenu />
      <Taskbar />
      <ContextMenu />
    </div>
  );
};

export default Desktop;
