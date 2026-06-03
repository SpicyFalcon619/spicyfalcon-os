import React, { useState } from 'react';
import useWindowStore from '../../store/useWindowStore';
import { portfolioData } from '../../data/portfolioData';
const SECTIONS = [
  {
    id: 'drives',
    label: 'Portfolio Drives',
    items: [
      { id: 'drive-c', icon: '/assets/icons/drive-windows.png', label: 'SpicyFalcon OS (C:)', sub: 'System Drive', action: 'system-properties', actionData: {} },
      { id: 'drive-p', icon: '/assets/icons/explorer.png',  label: 'Projects (P:)', sub: '3 items', action: 'portfolio', actionData: { section: 'projects' } },
      { id: 'drive-g', icon: '/assets/icons/ie.png',         label: 'GitHub (G:)', sub: 'Network Location', action: 'task-manager', actionData: {} }
    ]
  },
  {
    id: 'folders',
    label: 'Personal Folders',
    items: [
      { id: 'folder-about', icon: '/assets/icons/notepad.png',   label: 'About Me',  sub: 'Bio & Background', action: 'portfolio', actionData: { section: 'about' } },
      { id: 'folder-skills', icon: '/assets/icons/control-panel.png', label: 'Skills', sub: 'Languages & Tools', action: 'portfolio', actionData: { section: 'skills' } },
      { id: 'folder-edu',   icon: '/assets/icons/winver.png',    label: 'Education', sub: '2 Institutes', action: 'portfolio', actionData: { section: 'education' } },
      { id: 'folder-waste', icon: '/assets/icons/ie.png',         label: 'Wastopia',  sub: 'Blockchain Project', action: 'ie', actionData: { url: 'https://project-wastopia.vercel.app' } }
    ]
  }
];

const MyComputer = ({ windowData }) => {
  const openWindow = useWindowStore(state => state.openWindow);
  const [selected, setSelected] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleDoubleClick = (item) => {
    if (item.action === 'portfolio') {
      openWindow({ id: 'app-portfolio-' + item.id, title: 'Ahmad Maruf Hossain — Portfolio', component: 'portfolio', width: 740, height: 560, appData: item.actionData });
    } else if (item.action === 'ie') {
      openWindow({ id: 'app-ie-' + item.id, title: item.label, component: 'ie', width: 1000, height: 680, appData: item.actionData });
    } else if (item.action === 'task-manager') {
      openWindow({ id: 'app-task-manager', title: 'GitHub Activity', component: 'task-manager', width: 720, height: 540 });
    } else if (item.action === 'system-properties') {
      openWindow({ id: 'app-system-properties', title: 'System', component: 'system-properties', width: 900, height: 600 });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff', fontFamily: '"Tahoma", sans-serif', color: '#000' }}>

      {/* Address bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', backgroundColor: '#eceff1', borderBottom: '1px solid #c4c8cc', gap: '8px', flexShrink: 0 }}>
        <button style={{ padding: '2px 10px', fontSize: '11px', border: '1px solid #b0b8c0', background: 'linear-gradient(180deg,#f5f5f5,#e0e0e0)', borderRadius: '2px', cursor: 'default', color: '#999' }}>←</button>
        <button style={{ padding: '2px 10px', fontSize: '11px', border: '1px solid #b0b8c0', background: 'linear-gradient(180deg,#f5f5f5,#e0e0e0)', borderRadius: '2px', cursor: 'default', color: '#999' }}>→</button>
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '3px 8px', border: '1px solid #abadb3', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <img src="/assets/icons/computer.png" alt="" style={{ width: 16, height: 16 }} />
          Computer
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left sidebar */}
        <div style={{ width: '190px', borderRight: '1px solid #d8dde0', padding: '12px', backgroundColor: '#f5f6f7', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#003366', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>System Tasks</div>
          {['View system info', 'Add or remove programs', 'Change a setting'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 2px', cursor: 'pointer', color: '#1a56b0', fontSize: '12px' }}
              onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}>
              ▶ {t}
            </div>
          ))}

          <div style={{ borderTop: '1px solid #c8cdd0', margin: '10px 0' }} />
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#003366', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Links</div>
          {[
            { label: 'About Me',  prefix: '[Bio]',  cb: () => openWindow({ id: 'app-portfolio', title: 'Portfolio', component: 'portfolio', width: 740, height: 560 }) },
            { label: 'GitHub',    prefix: '[Git]',  cb: () => window.open(portfolioData.personal.github, '_blank') },
            { label: 'LinkedIn',  prefix: '[In]',   cb: () => window.open(portfolioData.personal.linkedin, '_blank') },
            { label: 'Email',     prefix: '[Mail]', cb: () => window.location.href = `mailto:${portfolioData.personal.email}` },
          ].map(link => (
            <div key={link.label} onClick={link.cb} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 2px', cursor: 'pointer', color: '#1a56b0', fontSize: '12px' }}
              onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}>
              <span style={{ color: '#555', fontWeight: 'bold' }}>{link.prefix}</span> {link.label}
            </div>
          ))}

          {/* Mini system info */}
          <div style={{ borderTop: '1px solid #c8cdd0', margin: '10px 0' }} />
          <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.8' }}>
            <div style={{ fontWeight: 'bold', color: '#003366', marginBottom: '4px' }}>System Info</div>
            <div>User: SpicyFalcon619</div>
            <div>CPU: i7-13650HX</div>
            <div>RAM: 16 GB</div>
            <div>GPU: RTX 4050</div>
            <div>OS: SpicyFalcon OS</div>
          </div>
        </div>

        {/* Main area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {SECTIONS.map(section => (
            <div key={section.id} style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '11px', fontWeight: 'bold', color: '#1a3a6a',
                textTransform: 'uppercase', letterSpacing: '0.6px',
                borderBottom: '1px solid #b0c4de',
                paddingBottom: '4px', marginBottom: '10px'
              }}>{section.label}</div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {section.items.map(item => {
                  const isSel = selected === item.id;
                  const isHov = hoveredItem === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelected(item.id)}
                      onDoubleClick={() => handleDoubleClick(item)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px',
                        width: '210px',
                        cursor: 'default',
                        borderRadius: '3px',
                        backgroundColor: isSel ? 'rgba(0,88,214,0.25)' : isHov ? 'rgba(0,88,214,0.07)' : 'transparent',
                        border: isSel ? '1px dotted rgba(0,88,214,0.5)' : '1px solid transparent',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ marginRight: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {typeof item.icon === 'string' ? (
                          <img src={item.icon} alt="" width={48} height={48} style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))' }} />
                        ) : (
                          item.icon
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a2c4a' }}>{item.label}</div>
                        <div style={{ fontSize: '10px', color: '#777' }}>{item.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div style={{ padding: '3px 12px', borderTop: '1px solid #c4c8cc', backgroundColor: '#f0f2f4', fontSize: '11px', color: '#555', flexShrink: 0 }}>
        {selected ? `1 object selected` : `${SECTIONS.reduce((a, s) => a + s.items.length, 0)} items`}
      </div>
    </div>
  );
};

export default MyComputer;
