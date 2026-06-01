import React from 'react';
import useWindowStore from '../../store/useWindowStore';
import useDesktopStore from '../../store/useDesktopStore';

const Taskbar = () => {
  const windows = useWindowStore(state => state.windows);
  const activeWindowId = useWindowStore(state => state.activeWindowId);
  const focusWindow = useWindowStore(state => state.focusWindow);
  const restoreWindow = useWindowStore(state => state.restoreWindow);
  const minimizeWindow = useWindowStore(state => state.minimizeWindow);
  
  const toggleStartMenu = useDesktopStore(state => state.toggleStartMenu);

  const taskbarStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100vw',
    height: 'var(--taskbar-height)',
    zIndex: 'var(--z-taskbar)',
    background: 'linear-gradient(to bottom, rgba(185, 209, 234, 0.7) 0%, rgba(135, 179, 224, 0.8) 40%, rgba(85, 149, 214, 0.9) 100%)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.8)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
  };

  const startButtonStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #5ceb5c 0%, #158f15 70%, #0d4a0d 100%)',
    border: '2px solid rgba(255,255,255,0.7)',
    boxShadow: '0 0 10px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.8)',
    cursor: 'pointer',
    marginRight: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    transition: 'filter 0.2s, transform 0.1s',
  };

  const handleStartClick = (e) => {
    e.stopPropagation();
    toggleStartMenu();
  };

  const handleTaskbarItemClick = (win) => {
    if (win.isMinimized) {
      restoreWindow(win.id);
    } else if (activeWindowId === win.id) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  };

  return (
    <div style={taskbarStyle} onContextMenu={(e) => e.preventDefault()}>
      <div 
        style={startButtonStyle} 
        onClick={handleStartClick}
        onMouseOver={(e) => e.target.style.filter = 'brightness(1.2)'}
        onMouseOut={(e) => e.target.style.filter = 'brightness(1)'}
        onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
      >
        🏁
      </div>
      
      {/* Active Windows Buttons */}
      <div style={{ display: 'flex', gap: '4px', flex: 1, overflowX: 'hidden' }}>
        {windows.map(win => {
          const isActive = activeWindowId === win.id && !win.isMinimized;
          return (
            <div 
              key={win.id} 
              onClick={() => handleTaskbarItemClick(win)}
              style={{
                width: '140px',
                height: '32px',
                background: isActive 
                  ? 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.2))' 
                  : 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.0))',
                border: isActive ? '1px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '3px',
                boxShadow: isActive ? 'inset 0 0 5px rgba(255,255,255,0.8), 0 0 5px rgba(255,255,255,0.5)' : 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                cursor: 'pointer',
                color: '#111',
                fontSize: '12px',
                fontWeight: isActive ? '600' : '400',
                textShadow: '0 1px 1px rgba(255,255,255,0.5)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {win.title}
            </div>
          );
        })}
      </div>

      {/* Tray area */}
      <div style={{
        padding: '0 10px',
        color: 'white',
        fontSize: '12px',
        textShadow: '0 1px 2px black',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderLeft: '1px solid rgba(255,255,255,0.3)'
      }}>
        <span>🔊</span>
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};

export default Taskbar;
