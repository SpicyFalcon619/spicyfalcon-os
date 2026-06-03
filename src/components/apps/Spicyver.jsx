import React from 'react';
import { Windows7Logo } from '../shared/BootScreen';
import useConfigStore from '../../store/useConfigStore';

const Spicyver = () => {
  const osName = useConfigStore(state => state.osName);
  const username = useConfigStore(state => state.username);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff', color: '#000', padding: '20px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid #ccc', paddingBottom: '20px', marginBottom: '20px' }}>
        <Windows7Logo size={60} animated={false} />
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', color: '#003366', fontWeight: '300' }}>{osName}</h2>
          <div style={{ color: '#666' }}>Version 1.0.0 (Build 7601: Retro Edition)</div>
        </div>
      </div>
      
      <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.6' }}>
        <p>Copyright © 2026 SpicyFalcon. All rights reserved.</p>
        
        <div style={{ margin: '15px 0', padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <strong style={{ color: '#003366' }}>Project Information:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li><strong>Tech Stack:</strong> React, Zustand, Framer Motion, Vite</li>
            <li><strong>Design Language:</strong> Early 2000s Windows (Skeuomorphic)</li>
            <li><strong>Features:</strong> Full Window Manager, Resizable/Draggable Windows, Z-Index stacking, Authentic Taskbar & Start Menu</li>
            <li><strong>Core Apps:</strong> My Computer, Notepad, MS Paint, Calculator, Minesweeper</li>
          </ul>
        </div>
        
        <p>
          The SpicyFalcon OS operating system and its user interface are protected by trademark and other pending or existing intellectual property rights. This is a retro-inspired web portfolio mimicking the aesthetic of early 2010s desktop environments.
        </p>
        <p style={{ marginTop: '20px' }}>
          This product is licensed to:<br />
          <strong>{username}</strong>
        </p>
      </div>
    </div>
  );
};

export default Spicyver;
