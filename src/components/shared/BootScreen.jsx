import React, { useEffect, useState } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import { IconBrandWindows } from '@tabler/icons-react';

const BootScreen = () => {
  const hasBooted = useDesktopStore(state => state.hasBooted);
  const setHasBooted = useDesktopStore(state => state.setHasBooted);
  const [opacity, setOpacity] = useState(1);
  const [visible, setVisible] = useState(!hasBooted);

  useEffect(() => {
    if (hasBooted) return;

    // Simulate boot sequence
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => {
        setVisible(false);
        setHasBooted();
      }, 1000); // Fade out duration
    }, 2500); // Time spent on boot screen

    return () => clearTimeout(timer);
  }, [hasBooted, setHasBooted]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#000',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: opacity,
      transition: 'opacity 1s ease-in-out',
      color: '#fff',
      cursor: 'wait'
    }}>
      <div style={{
        animation: 'pulse 2s infinite ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px'
      }}>
        <div style={{ filter: 'drop-shadow(0 0 15px rgba(0, 164, 239, 0.8))' }}>
          <IconBrandWindows size={120} color="#00a4ef" stroke={1.5} />
        </div>
        <div style={{ 
          fontSize: '22px', 
          fontFamily: '"Segoe UI", Tahoma, sans-serif', 
          letterSpacing: '1px', 
          fontWeight: '300',
          textShadow: '0 0 10px rgba(255,255,255,0.5)'
        }}>
          Starting Windows
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { filter: brightness(1); transform: scale(0.98); }
          50% { filter: brightness(1.3); transform: scale(1.02); }
          100% { filter: brightness(1); transform: scale(0.98); }
        }
      `}</style>
    </div>
  );
};

export default BootScreen;
