import React, { useState, useEffect } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import ContextMenu from './ContextMenu';
import BootScreen from '../shared/BootScreen';
import { IconDeviceMobileMessage } from '@tabler/icons-react';

const Desktop = ({ children }) => {
  const icons = useDesktopStore(state => state.icons);
  const clearSelection = useDesktopStore(state => state.clearSelection);
  const showContextMenu = useDesktopStore(state => state.showContextMenu);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePointerDown = (e) => {
    clearSelection();
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
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

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        backgroundImage: "url('/assets/wallpapers/windows7-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#00539c' // Fallback color
      }}
      onPointerDown={handlePointerDown}
      onContextMenu={handleContextMenu}
    >
      <BootScreen />

      {/* Desktop Icons */}
      {icons.map(icon => (
        <DesktopIcon key={icon.id} iconData={icon} />
      ))}

      {/* Application Windows */}
      {children}

      <StartMenu />
      <Taskbar />
      <ContextMenu />
    </div>
  );
};

export default Desktop;
