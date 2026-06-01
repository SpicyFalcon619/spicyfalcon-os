import React from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import useWindowStore from '../../store/useWindowStore';
import { IconFileText, IconPalette, IconCalculator, IconMusic, IconBomb, IconTerminal2, IconInfoCircle } from '@tabler/icons-react';

const StartMenu = () => {
  const visible = useDesktopStore(state => state.startMenuVisible);
  const hideStartMenu = useDesktopStore(state => state.hideStartMenu);
  const openWindow = useWindowStore(state => state.openWindow);

  if (!visible) return null;

  const menuStyle = {
    position: 'absolute',
    bottom: 'var(--taskbar-height)',
    left: 0,
    width: '380px',
    height: '450px',
    zIndex: 'var(--z-start-menu)',
    background: 'linear-gradient(135deg, rgba(230, 240, 255, 0.9) 0%, rgba(185, 209, 234, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.8)',
    borderBottom: 'none',
    borderTopRightRadius: '8px',
    boxShadow: '4px -4px 15px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.9)',
    display: 'flex',
    padding: '8px',
    color: '#333'
  };

  const handleAppClick = (appId, title) => {
    hideStartMenu();
    openWindow({
      id: `app-${appId}`,
      title,
      component: appId,
      width: 600,
      height: 450
    });
  };

  const apps = [
    { id: 'notepad', title: 'Notepad', icon: <IconFileText size={24} color="#3b82f6" /> },
    { id: 'paint', title: 'MS Paint', icon: <IconPalette size={24} color="#f97316" /> },
    { id: 'calculator', title: 'Calculator', icon: <IconCalculator size={24} color="#64748b" /> },
    { id: 'spotify', title: 'Retro Spotify', icon: <IconMusic size={24} color="#22c55e" /> },
    { id: 'minesweeper', title: 'Minesweeper', icon: <IconBomb size={24} color="#ef4444" /> },
    { id: 'cmd', title: 'Command Prompt', icon: <IconTerminal2 size={24} color="#333" /> },
    { id: 'winver', title: 'About SpicyFalcon', icon: <IconInfoCircle size={24} color="#00a4ef" /> },
  ];

  return (
    <div style={menuStyle} onContextMenu={(e) => e.preventDefault()}>
      {/* Left pane - Pinned Apps */}
      <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', padding: '4px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
        {apps.map(app => (
          <div 
            key={app.id}
            onClick={() => handleAppClick(app.id, app.title)}
            style={{
              padding: '10px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,120,215,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ display: 'flex', filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.2))' }}>{app.icon}</span>
            <span>{app.title}</span>
          </div>
        ))}
      </div>
      
      {/* Right pane - Folders */}
      <div style={{ width: '130px', paddingLeft: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ padding: '8px 4px', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid rgba(0,0,0,0.1)', color: '#003366' }}>
          SpicyFalcon
        </div>
        <div style={{ fontSize: '13px', cursor: 'pointer', padding: '4px' }} onClick={() => handleAppClick('documents', 'Documents')}>Documents</div>
        <div style={{ fontSize: '13px', cursor: 'pointer', padding: '4px' }} onClick={() => handleAppClick('pictures', 'Pictures')}>Pictures</div>
        <div style={{ fontSize: '13px', cursor: 'pointer', padding: '4px' }} onClick={() => handleAppClick('music', 'Music')}>Music</div>
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', margin: '8px 0' }}></div>
        <div style={{ fontSize: '13px', cursor: 'pointer', padding: '4px' }} onClick={() => handleAppClick('control-panel', 'Control Panel')}>Control Panel</div>
        <div style={{ fontSize: '13px', cursor: 'pointer', padding: '4px' }}>Run...</div>
      </div>
    </div>
  );
};

export default StartMenu;
