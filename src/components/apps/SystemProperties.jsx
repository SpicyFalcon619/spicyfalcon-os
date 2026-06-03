import React, { useState } from 'react';
import useWindowStore from '../../store/useWindowStore';
import { portfolioData } from '../../data/portfolioData';
import { Windows7Logo } from '../shared/BootScreen';

const SystemProperties = () => {
  const openWindow = useWindowStore(state => state.openWindow);
  
  // Left Sidebar Links
  const sidebarLinks = [
    { label: 'Control Panel Home', action: 'control-panel', icon: '/assets/icons/control-panel.png' },
    { label: 'Device Manager', action: 'device-manager', icon: '/assets/icons/computer.png' },
    { label: 'Remote settings', action: 'none' },
    { label: 'System protection', action: 'none' },
    { label: 'Advanced system settings', action: 'none' },
  ];

  const handleSidebarClick = (action) => {
    if (action === 'device-manager') {
      openWindow({ id: 'app-device-manager', title: 'Device Manager', component: 'device-manager', width: 800, height: 600 });
    } else if (action === 'control-panel') {
      openWindow({ id: 'app-control-panel', title: 'Control Panel', component: 'control-panel', width: 800, height: 600 });
    }
  };

  const hrStyle = {
    border: 0,
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.1) 90%, transparent)',
    margin: '12px 0'
  };

  const sectionHeaderStyle = {
    color: '#003399',
    fontSize: '13px',
    fontWeight: 'normal',
    marginBottom: '8px'
  };

  const rowStyle = {
    display: 'flex',
    marginBottom: '4px',
    fontSize: '12px',
    color: '#333'
  };
  
  const labelStyle = {
    width: '180px',
    paddingLeft: '16px'
  };

  const valueStyle = {
    flex: 1
  };

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#f0f4f9', fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>
      
      {/* ── LEFT SIDEBAR ── */}
      <div style={{ width: '180px', backgroundColor: '#d9e4f1', padding: '16px 12px', borderRight: '1px solid #b9c9dc' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sidebarLinks.map((link, idx) => (
            <React.Fragment key={idx}>
              <div 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', 
                  fontSize: '12px', color: '#003399', cursor: link.action !== 'none' ? 'pointer' : 'default' 
                }}
                onClick={() => handleSidebarClick(link.action)}
                onMouseEnter={e => { if (link.action !== 'none') e.currentTarget.style.textDecoration = 'underline'; }}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                {link.icon ? (
                  <img src={link.icon} alt="" width={16} height={16} onError={e => e.target.style.display = 'none'} />
                ) : (
                  <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 12, height: 12, border: '1px solid #7d9ebd', backgroundColor: '#eef3f8' }} />
                  </div>
                )}
                <span>{link.label}</span>
              </div>
              {idx === 1 && <hr style={{ border: 0, height: 1, backgroundColor: '#b9c9dc', margin: '4px 0' }} />}
            </React.Fragment>
          ))}
        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
          <div style={{ fontSize: '12px', color: '#003399', marginBottom: '8px', cursor: 'pointer' }}>See also</div>
          <div style={{ fontSize: '12px', color: '#003399', paddingLeft: '12px', cursor: 'pointer' }} onClick={() => openWindow({ id: 'app-task-manager', title: 'GitHub Activity', component: 'task-manager', width: 720, height: 540 })}>Action Center</div>
          <div style={{ fontSize: '12px', color: '#003399', paddingLeft: '12px', marginTop: '4px', cursor: 'pointer' }}>Windows Update</div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', backgroundColor: '#fff' }}>
        <div style={{ fontSize: '16px', color: '#003399', marginBottom: '20px' }}>View basic information about your computer</div>

        {/* Windows Edition */}
        <div style={sectionHeaderStyle}>Windows edition</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', paddingLeft: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000' }}>SpicyFalcon OS - Developer Edition</div>
            <div style={{ fontSize: '12px', color: '#333', marginTop: '2px' }}>Copyright (c) 2026 SpicyFalcon. All rights reserved.</div>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>Service Pack 1</div>
          </div>
          <div style={{ paddingRight: '20px' }}>
            <Windows7Logo size={80} animated={false} />
          </div>
        </div>

        <hr style={hrStyle} />

        {/* System */}
        <div style={sectionHeaderStyle}>System</div>
        <div style={rowStyle}>
          <div style={labelStyle}>Rating:</div>
          <div style={{ ...valueStyle, display: 'flex', alignItems: 'center', gap: '6px', color: '#003399', cursor: 'pointer' }} onClick={() => window.open(portfolioData.personal.github, '_blank')}>
            <span style={{ backgroundColor: '#217346', color: '#fff', padding: '1px 8px', borderRadius: '2px', fontWeight: 'bold' }}>7.9</span>
            <span style={{ textDecoration: 'underline' }}>Windows Experience Index</span>
          </div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Processor:</div>
          <div style={valueStyle}>13th Gen Intel(R) Core(TM) i7-13650HX 2.60 GHz</div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Installed memory (RAM):</div>
          <div style={valueStyle}>16.0 GB (15.8 GB usable)</div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>System type:</div>
          <div style={valueStyle}>64-bit Operating System</div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Pen and Touch:</div>
          <div style={valueStyle}>No Pen or Touch Input is available for this Display</div>
        </div>

        <hr style={hrStyle} />

        {/* Computer name, domain, and workgroup settings */}
        <div style={sectionHeaderStyle}>Computer name, domain, and workgroup settings</div>
        <div style={rowStyle}>
          <div style={labelStyle}>Computer name:</div>
          <div style={valueStyle}>{portfolioData.personal.gamertag}-PC</div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Full computer name:</div>
          <div style={valueStyle}>{portfolioData.personal.gamertag}-PC</div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Computer description:</div>
          <div style={valueStyle}>{portfolioData.personal.name}'s Main Rig</div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Workgroup:</div>
          <div style={valueStyle}>WORKGROUP</div>
        </div>

        <hr style={hrStyle} />

        {/* Windows activation */}
        <div style={sectionHeaderStyle}>Windows activation</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', paddingLeft: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#333' }}>Windows is activated</div>
            <div style={{ fontSize: '12px', color: '#333', marginTop: '2px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              Product ID: 00326-10000-00000-AA619
            </div>
            <div style={{ fontSize: '12px', color: '#003399', marginTop: '12px', cursor: 'pointer', display: 'inline-block' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
              Read the Microsoft Software License Terms
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '20px' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#1874cd', position: 'relative', overflow: 'hidden', border: '2px solid #ccc' }}>
               <div style={{ position: 'absolute', top: '15%', left: '15%', width: '70%', height: '70%', border: '4px solid #fff', borderTopColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(45deg)' }} />
            </div>
            <span style={{ fontWeight: 'bold', color: '#555', fontSize: '16px' }}>genuine</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemProperties;
