import React, { useState, useEffect } from 'react';
import { IconVolume } from '@tabler/icons-react';

export const CalendarPopup = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      bottom: '100%',
      right: '10px',
      width: '240px',
      background: 'linear-gradient(to bottom, #f0f4f9, #dce6f2)',
      border: '1px solid #7a96df',
      borderBottom: 'none',
      borderTopLeftRadius: '5px',
      borderTopRightRadius: '5px',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.2), inset 0 1px 1px white',
      padding: '15px',
      color: '#003366',
      zIndex: 9999
    }} onPointerDown={(e) => e.stopPropagation()}>
      <div style={{ textAlign: 'center', fontSize: '14px', borderBottom: '1px solid #a3bde3', paddingBottom: '10px', marginBottom: '10px', textShadow: '0 1px white' }}>
        {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      <div style={{ textAlign: 'center', fontSize: '36px', fontWeight: '300', textShadow: '0 1px white', color: '#111' }}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      
      {/* Mock Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginTop: '15px', fontSize: '12px', textAlign: 'center' }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} style={{ fontWeight: 'bold' }}>{d}</div>)}
        {Array.from({length: 31}).map((_, i) => (
          <div key={i} style={{ 
            padding: '4px', 
            backgroundColor: (i+1) === time.getDate() ? '#c1d5ed' : 'transparent',
            border: (i+1) === time.getDate() ? '1px solid #7a96df' : '1px solid transparent',
            borderRadius: '2px'
          }}>{i+1}</div>
        ))}
      </div>
    </div>
  );
};

export const VolumePopup = () => {
  const [vol, setVol] = useState(50);
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '100%',
      right: '60px',
      width: '70px',
      height: '160px',
      background: 'linear-gradient(to bottom, #f0f4f9, #dce6f2)',
      border: '1px solid #7a96df',
      borderBottom: 'none',
      borderTopLeftRadius: '5px',
      borderTopRightRadius: '5px',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.2), inset 0 1px 1px white',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 9999
    }} onPointerDown={(e) => e.stopPropagation()}>
      <div style={{ fontSize: '12px', textShadow: '0 1px white', marginBottom: '10px' }}>Mixer</div>
      <div style={{ flex: 1, padding: '5px 0' }}>
        <input 
          type="range" 
          min="0" max="100" 
          value={vol}
          onChange={(e) => setVol(e.target.value)}
          style={{
            writingMode: 'bt-lr',
            WebkitAppearance: 'slider-vertical',
            width: '12px',
            height: '100%'
          }} 
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <IconVolume size={20} color="#003366" />
      </div>
    </div>
  );
};
