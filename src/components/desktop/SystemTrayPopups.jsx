import React, { useState, useEffect, useRef } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import { IconBattery, IconBatteryCharging, IconBattery1, IconBattery2, IconBattery3, IconBattery4, IconVolume, IconDeviceSpeaker } from '@tabler/icons-react';

export const BatteryIcon = () => {
  const [level, setLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    let batteryPromise;
    if ('getBattery' in navigator) {
      batteryPromise = navigator.getBattery().then(battery => {
        const updateBattery = () => {
          setLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
        
        return () => {
          battery.removeEventListener('levelchange', updateBattery);
          battery.removeEventListener('chargingchange', updateBattery);
        };
      });
    }
  }, []);

  const getBatteryIcon = () => {
    // White battery SVG matching Windows 7 system tray style
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))' }}>
        <rect x="1" y="4" width="12" height="9" rx="1" stroke="white" strokeWidth="1.2" fill="none" />
        <rect x="13" y="6" width="2" height="5" rx="0.5" fill="white" />
        {level > 75 && <rect x="2.5" y="5.5" width="9.5" height="6" rx="0.5" fill="rgba(255,255,255,0.85)" />}
        {level > 50 && level <= 75 && <rect x="2.5" y="5.5" width="7" height="6" rx="0.5" fill="rgba(255,255,255,0.85)" />}
        {level > 25 && level <= 50 && <rect x="2.5" y="5.5" width="4.5" height="6" rx="0.5" fill="rgba(255,255,255,0.85)" />}
        {level <= 25 && <rect x="2.5" y="5.5" width="2.5" height="6" rx="0.5" fill="rgba(255,255,255,0.85)" />}
      </svg>
    );
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }} title={`${level}% remaining`}>
      {getBatteryIcon()}
      <span style={{ color: '#fff', fontSize: '11px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{level}%</span>
    </div>
  );
};

export const CalendarPopup = () => {
  const [time, setTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 'var(--taskbar-height)',
      right: '0px',
      width: '240px',
      background: 'linear-gradient(to right, #eef4fc, #e1eaf5)',
      border: '1px solid rgba(0, 0, 0, 0.5)',
      borderTop: '1px solid rgba(255, 255, 255, 0.5)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
      borderBottom: 'none',
      borderTopLeftRadius: '5px',
      borderTopRightRadius: '5px',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 2px -2px 10px rgba(0,0,0,0.5)',
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
        {Array.from({length: 31}).map((_, i) => {
          const isToday = (i+1) === time.getDate();
          const isSelected = (i+1) === selectedDate;
          return (
            <div 
              key={i} 
              onClick={() => setSelectedDate(i+1)}
              style={{ 
                padding: '4px', 
                backgroundColor: isSelected ? '#3399ff' : (isToday ? '#c1d5ed' : 'transparent'),
                color: isSelected ? '#fff' : '#003366',
                border: isToday && !isSelected ? '1px solid #7a96df' : '1px solid transparent',
                borderRadius: '2px',
                cursor: 'pointer'
              }}>
              {i+1}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export const VolumePopup = () => {
  const globalVolume = useDesktopStore(state => state.globalVolume);
  const setGlobalVolume = useDesktopStore(state => state.setGlobalVolume);
  const sliderRef = useRef(null);

  const handlePointerDown = (e) => {
    if (!sliderRef.current) return;
    const updateVolume = (e) => {
      const rect = sliderRef.current.getBoundingClientRect();
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      const percentage = 100 - (y / rect.height) * 100;
      setGlobalVolume(Math.round(percentage));
    };
    updateVolume(e);
    
    const handlePointerMove = (e) => updateVolume(e);
    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
    
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 'var(--taskbar-height)',
      right: '40px',
      padding: '4px',
      background: 'rgba(25, 60, 90, 0.5)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 0, 0, 0.4)',
      borderTop: '1px solid rgba(255, 255, 255, 0.3)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '6px 6px 0 0',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 2px -2px 10px rgba(0,0,0,0.5)',
      zIndex: 9999
    }} onPointerDown={(e) => e.stopPropagation()}>
      
      {/* Inner White Container */}
      <div style={{
        width: '80px',
        height: '320px',
        backgroundColor: '#fff',
        border: '1px solid #7a96df',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        {/* Top Device Button */}
        <div style={{ padding: '10px 0 5px 0' }}>
          <div 
            title="Speakers (High Definition Audio Device)"
            style={{
              width: '42px',
              height: '42px',
              border: '1px solid #ccc',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(to bottom, #fff, #f0f0f0)',
              cursor: 'pointer'
            }}>
            <img src="/assets/icons/volume-windows.png" alt="Speaker" style={{ width: 24, height: 24, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }} />
          </div>
        </div>
        
        {/* Slider Area */}
        <div style={{ flex: 1, position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
          {/* Tick marks behind slider */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
             {[...Array(5)].map((_, i) => (
                <div key={i} style={{ width: '30px', height: '1px', backgroundColor: '#e0e0e0' }}></div>
             ))}
          </div>
          
          {/* The Slider Track */}
          <div 
            ref={sliderRef}
            onPointerDown={handlePointerDown}
            style={{
              position: 'relative',
              width: '8px',
              height: '100%',
              backgroundColor: '#fff',
              border: '1px solid #a0a0a0',
              borderRight: '1px solid #fff',
              borderBottom: '1px solid #fff',
              boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              zIndex: 2
            }}
          >
             {/* Volume level indicator fill */}
             <div style={{
               position: 'absolute',
               bottom: 0,
               left: 0,
               width: '100%',
               height: `${globalVolume}%`,
               background: 'linear-gradient(to right, #2ab125 0%, #3fe739 100%)',
               opacity: 0.2
             }}></div>
          </div>
          
          {/* The Slider Thumb */}
          <div style={{
            position: 'absolute',
            bottom: `calc(${globalVolume}% - 8px)`,
            left: 'calc(50% - 14px)',
            width: '18px',
            height: '16px',
            pointerEvents: 'none',
            zIndex: 3
          }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,0 60,0 100,50 60,100 0,100" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="5" />
            </svg>
          </div>
        </div>

        {/* Bottom Speaker Icon */}
        <div style={{ marginBottom: '10px' }}>
          <IconVolume size={20} color="#0058d6" />
        </div>

        {/* Mixer Label */}
        <div style={{
          width: '100%',
          padding: '8px 0',
          borderTop: '1px solid #dfdfdf',
          textAlign: 'center',
          fontSize: '12px',
          color: '#0058d6',
          cursor: 'pointer',
          background: 'linear-gradient(to bottom, #f9f9f9, #e0e0e0)'
        }}>
          Mixer
        </div>
        
      </div>
    </div>
  );
};
