import React from 'react';
import { Windows7Logo } from '../shared/BootScreen';

const Winver = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff', color: '#000', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid #ccc', paddingBottom: '20px', marginBottom: '20px' }}>
        <Windows7Logo size={60} animated={false} />
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', color: '#003366', fontWeight: '300' }}>SpicyFalcon OS</h2>
          <div style={{ color: '#666' }}>Version 1.0.0 (Build 7601)</div>
        </div>
      </div>
      
      <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.6' }}>
        <p>Copyright © 2026 SpicyFalcon. All rights reserved.</p>
        <p>
          The SpicyFalcon OS operating system and its user interface are protected by trademark and other pending or existing intellectual property rights. This is a retro-inspired web portfolio mimicking the aesthetic of early 2010s desktop environments.
        </p>
        <p style={{ marginTop: '20px' }}>
          This product is licensed to:<br />
          <strong>The User</strong>
        </p>
      </div>
    </div>
  );
};

export default Winver;
