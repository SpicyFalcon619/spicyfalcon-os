import React, { useState, useEffect } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
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
  const globalVolume = useDesktopStore(state => state.globalVolume);
  const setGlobalVolume = useDesktopStore(state => state.setGlobalVolume);
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '100%',
      right: '60px',
      width: '80px',
      height: '240px',
      background: 'linear-gradient(to bottom, #f0f4f9, #c0d2f0)',
      border: '1px solid #7a96df',
      borderBottom: 'none',
      borderTopLeftRadius: '5px',
      borderTopRightRadius: '5px',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.2), inset 0 1px 1px white',
      padding: '15px 10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 9999
    }} onPointerDown={(e) => e.stopPropagation()}>
      <div style={{ fontSize: '13px', textShadow: '0 1px white', marginBottom: '15px', color: '#003366', fontWeight: 'bold' }}>Mixer</div>
      <div style={{ flex: 1, padding: '5px 0', display: 'flex', justifyContent: 'center' }}>
        <input 
          type="range" 
          min="0" max="100" 
          value={globalVolume}
          onChange={(e) => setGlobalVolume(parseInt(e.target.value))}
          style={{
            writingMode: 'bt-lr',
            WebkitAppearance: 'slider-vertical',
            width: '24px',
            height: '100%'
          }} 
        />
      </div>
      <div style={{ marginTop: '15px' }}>
        <IconVolume size={28} color="#003366" style={{ filter: 'drop-shadow(0 1px 1px white)' }} />
      </div>
      <div style={{ fontSize: '12px', marginTop: '5px', color: '#003366' }}>{globalVolume}%</div>
    </div>
  );
};
