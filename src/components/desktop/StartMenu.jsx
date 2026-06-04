import React from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import useWindowStore from '../../store/useWindowStore';
import useConfigStore from '../../store/useConfigStore';
import { IconFileText, IconPalette, IconCalculator, IconMusic, IconBomb, IconTerminal2, IconInfoCircle, IconUser } from '@tabler/icons-react';
import { portfolioData } from '../../data/portfolioData';

const StartMenu = () => {
  const visible = useDesktopStore(state => state.startMenuVisible);
  const hideStartMenu = useDesktopStore(state => state.hideStartMenu);
  const openWindow = useWindowStore(state => state.openWindow);
  
  const username = portfolioData.personal.name;

  if (!visible) return null;

  const menuStyle = {
    position: 'absolute',
    bottom: 'var(--taskbar-height)',
    left: 0,
    width: '380px',
    height: '450px',
    zIndex: 'var(--z-start-menu)',
    background: 'rgba(25, 45, 60, 0.65)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: '1px solid rgba(0, 0, 0, 0.5)',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
    borderBottom: 'none',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 2px -2px 10px rgba(0,0,0,0.5)',
    display: 'flex',
    padding: '6px',
    color: '#fff'
  };

  const handleAppClick = (e, appId, title, component) => {
    e.stopPropagation();
    hideStartMenu();
    const sizeMap = {
      'portfolio': { width: 740, height: 560 },
      'my-computer': { width: 740, height: 500 },
      'task-manager': { width: 720, height: 540 },
      'minesweeper': { width: 340, height: 440 },
      'calculator': { width: 280, height: 380 },
      'spicyver': { width: 450, height: 580 },
      'soundboard': { width: 420, height: 360 }
    };
    const size = sizeMap[appId] || { width: 600, height: 450 };
    openWindow({
      id: `app-${appId}`,
      title,
      component: component || appId,
      ...size
    });
  };

  const apps = [
    { id: 'portfolio', title: 'About Me', icon: '/assets/icons/notepad.png', fallbackIcon: <IconFileText size={24} color="#3b82f6" /> },
    { id: 'my-computer', title: 'My Computer', icon: '/assets/icons/computer.png', fallbackIcon: <IconInfoCircle size={24} color="#2c89f0" /> },
    { id: 'task-manager', title: 'GitHub Activity', icon: '/assets/icons/task-manager.svg', fallbackIcon: <IconCalculator size={24} color="#64748b" /> },
    { id: 'spicetify', title: 'Spicetify', icon: '/assets/icons/spicetify.svg', fallbackIcon: <IconMusic size={24} color="#22c55e" /> },
    { id: 'minesweeper', title: 'Minesweeper', icon: '/assets/icons/minesweeper.png', fallbackIcon: <IconBomb size={24} color="#ef4444" /> },
    { id: 'cmd', title: 'Command Prompt', icon: '/assets/icons/cmd.png', fallbackIcon: <IconTerminal2 size={24} color="#333" /> },
    { id: 'paint', title: 'MS Paint', icon: '/assets/icons/paint.png', fallbackIcon: <IconPalette size={24} color="#f97316" /> },
    { id: 'device-manager', title: 'Device Manager', icon: '/assets/icons/device-manager.png', fallbackIcon: <IconInfoCircle size={24} color="#64748b" /> },
    { id: 'soundboard', title: 'Soundboard.exe', icon: '/assets/icons/spicetify.png', fallbackIcon: <IconMusic size={24} color="#eab308" /> },
  ];

  return (
    <div style={menuStyle} onContextMenu={(e) => e.preventDefault()}>
      {/* Left pane - Pinned Apps */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#fff', 
        border: '1px solid rgba(0,0,0,0.5)', 
        borderRadius: '3px', 
        padding: '2px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        color: '#000'
      }}>
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }} className="os-scrollbar">
          {apps.map(app => (
            <div 
              key={app.id}
              onPointerDown={(e) => handleAppClick(e, app.id, app.title)}
              style={{
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                borderRadius: '3px',
                fontSize: '13px',
                fontWeight: 'normal',
                margin: '2px'
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 145, 255, 0.2)'; e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(0, 145, 255, 0.4)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img 
                  src={app.icon || `/assets/icons/${app.id}.png`} 
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  alt="" 
                />
                <span style={{ display: 'none' }}>{app.fallbackIcon}</span>
              </div>
              <span>{app.title}</span>
            </div>
          ))}
        </div>
        
        {/* Search Bar */}
        <div style={{ padding: '6px', borderTop: '1px solid #d9d9d9', backgroundColor: '#f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #abadb3', borderRadius: '3px', padding: '2px 6px' }}>
            <input type="text" placeholder="Search programs and files" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '12px', fontStyle: 'italic', color: '#999' }} />
          </div>
        </div>
      </div>
      
      {/* Right pane - Folders */}
      <div style={{ width: '140px', padding: '6px 4px', display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: 'transparent' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', marginTop: '-20px' }}>
          <div style={{ 
            width: '56px', height: '56px', 
            borderRadius: '5px', 
            border: '2px solid rgba(255,255,255,0.8)', 
            boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
            backgroundColor: '#003366',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            overflow: 'hidden',
            zIndex: 10
          }}>
            <img src="/assets/my-logo.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          <span style={{ display: 'none', color: '#fff', fontSize: 28 }}>SF</span>
          </div>
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '13px', padding: '4px 8px', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.8)', marginBottom: '8px', textAlign: 'center' }}>
          {username}
        </div>
        
        <div style={{ fontSize: '13px', cursor: 'pointer', padding: '6px 8px', color: '#fff', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }} onPointerDown={() => window.open(portfolioData.personal.github, '_blank')} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>GitHub</div>
        <div style={{ fontSize: '13px', cursor: 'pointer', padding: '6px 8px', color: '#fff', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }} onPointerDown={() => window.open(portfolioData.personal.linkedin, '_blank')} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>LinkedIn</div>
        <div style={{ fontSize: '13px', cursor: 'pointer', padding: '6px 8px', color: '#fff', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }} onPointerDown={() => window.location.href = `mailto:${portfolioData.personal.email}`} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>Email</div>
        
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.3)', margin: '4px 6px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}></div>
        
        <div style={{ fontSize: '13px', cursor: 'pointer', padding: '6px 8px', color: '#fff', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }} onPointerDown={(e) => handleAppClick(e, 'my-computer', 'My Computer')} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>My Computer</div>
        <div style={{ fontSize: '13px', cursor: 'pointer', padding: '6px 8px', color: '#fff', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }} onPointerDown={(e) => handleAppClick(e, 'spicyver', 'System Info')} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>System Info</div>

        
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.3)', margin: '4px 6px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}></div>
        
        <div style={{ fontSize: '13px', cursor: 'pointer', padding: '6px 8px', color: '#fff', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }} onPointerDown={(e) => { 
          e.stopPropagation(); 
          hideStartMenu(); 
          openWindow({ id: `app-ie-wastopia`, title: 'Wastopia', component: 'ie', width: 800, height: 600, appData: { url: portfolioData.projects[0].link } }); 
        }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>View Wastopia ↗</div>
      </div>
    </div>
  );
};

export default StartMenu;
