import React from 'react';
import useWindowStore from '../../store/useWindowStore';
import { portfolioData } from '../../data/portfolioData';
import { IconFolder } from '@tabler/icons-react';

const WindowsExplorer = () => {
  const openWindow = useWindowStore(state => state.openWindow);
  
  const items = portfolioData.projects;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff', color: '#000' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px', backgroundColor: '#e9eef4', borderBottom: '1px solid #ccc', gap: '10px' }}>
        <button style={{ padding: '2px 12px', border: '1px solid #ccc', borderRadius: '3px' }}>←</button>
        <button style={{ padding: '2px 12px', border: '1px solid #ccc', borderRadius: '3px' }}>→</button>
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '4px 8px', border: '1px solid #abadb3', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <IconFolder size={16} color="#fcd34d" />
          <span style={{ fontSize: '13px' }}>C:\Users\SpicyFalcon\Projects</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: '200px', borderRight: '1px solid #e0e0e0', padding: '15px', backgroundColor: '#f5f6f7', overflowY: 'auto' }}>
          <div style={{ fontWeight: 'bold', color: '#003366', marginBottom: '10px', fontSize: '13px' }}>Favorite Links</div>
          <div style={{ padding: '4px', cursor: 'pointer', color: '#333', fontSize: '13px' }}>[★] Recent Places</div>
          <div style={{ padding: '4px', cursor: 'pointer', color: '#333', fontSize: '13px' }}>[D] Desktop</div>
          <div style={{ padding: '4px', cursor: 'pointer', color: '#333', fontSize: '13px' }}>[↓] Downloads</div>
        </div>
        
        {/* Main Content */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignContent: 'flex-start', overflowY: 'auto' }}>
          {items.map((item, i) => (
            <div 
              key={i}
              onClick={() => {
                if (item.id === 'wastopia') {
                  window.open(item.link, '_blank');
                } else if (item.link) {
                  openWindow({
                    id: `ie-${Date.now()}`,
                    title: 'Internet Explorer',
                    component: 'ie',
                    width: 1000,
                    height: 700,
                    appData: { url: item.link }
                  });
                }
              }}
              style={{
                width: '110px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                cursor: 'pointer',
                borderRadius: '4px',
                border: '1px solid transparent'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,120,215,0.1)';
                e.currentTarget.style.border = '1px solid rgba(0,120,215,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.border = '1px solid transparent';
              }}
            >
              <img src={item.icon} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div style={{ textAlign: 'center', fontSize: '13px', marginTop: '8px', wordBreak: 'break-word', color: '#222' }}>{item.name}</div>
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#777' }}>{item.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WindowsExplorer;
