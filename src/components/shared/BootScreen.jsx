import React, { useEffect, useState } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
export const Windows7Logo = ({ size = 120, animated = false }) => {
  return (
    <div style={{
      width: size,
      height: size,
      filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.6))',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      animation: animated ? 'glowPulse 3s infinite' : 'none'
    }}>
      <svg 
        viewBox="0 0 400 400" 
        style={{
          width: '100%',
          height: '100%',
          transform: 'perspective(400px) rotateY(-10deg)',
        }}
      >
        <path fill="#f05025" d="M 30 60 C 80 10, 140 10, 190 30 L 190 170 C 140 150, 80 150, 30 200 Z" />
        <path fill="#7fb900" d="M 210 30 C 260 50, 320 70, 370 60 L 370 200 C 320 210, 260 190, 210 170 Z" />
        <path fill="#00a4ef" d="M 30 220 C 80 170, 140 170, 190 190 L 190 330 C 140 310, 80 310, 30 360 Z" />
        <path fill="#ffb900" d="M 210 190 C 260 210, 320 230, 370 220 L 370 360 C 320 370, 260 350, 210 330 Z" />
      </svg>
    </div>
  );
};

const BootScreen = () => {
  const hasBooted = useDesktopStore(state => state.hasBooted);
  const setHasBooted = useDesktopStore(state => state.setHasBooted);
  const [phase, setPhase] = useState('boot'); // 'boot', 'fadeout', 'done'

  useEffect(() => {
    if (hasBooted) return;

    const timer1 = setTimeout(() => {
      setPhase('fadeout');
      
      const timer2 = setTimeout(() => {
        setPhase('done');
        setHasBooted();
      }, 500); // Fade out duration
      
      return () => clearTimeout(timer2);
    }, 2000); // Boot logo duration

    return () => clearTimeout(timer1);
  }, [hasBooted, setHasBooted]);

  if (phase === 'done' || hasBooted) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#000',
      opacity: phase === 'fadeout' ? 0 : 1,
      transition: 'opacity 1s ease-out',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'wait'
    }}>
      
      {phase === 'boot' && (
        <>
          <div style={{ flex: 1 }} />
          <img src="/assets/my-logo.png" alt="Logo" style={{ width: 140, height: 'auto', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.4))' }} />
          <div style={{ 
            color: '#fff', 
            fontSize: '24px', 
            fontFamily: '"Segoe UI", sans-serif',
            marginTop: '30px',
            textShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}>
            Starting SpicyFalcon OS
          </div>
          <div style={{ flex: 1 }} />
        </>
      )}
      <style>{`
        @keyframes flyInRed {
          0% { transform: translate(-200px, -200px) scale(0); opacity: 0; }
          40% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes flyInGreen {
          0% { transform: translate(200px, -200px) scale(0); opacity: 0; }
          50% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes flyInBlue {
          0% { transform: translate(-200px, 200px) scale(0); opacity: 0; }
          60% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes flyInYellow {
          0% { transform: translate(200px, 200px) scale(0); opacity: 0; }
          70% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
        @keyframes textFade {
          0%, 40% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .pane-red { animation: flyInRed 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards, glowPulse 3s infinite; }
        .pane-green { animation: flyInGreen 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards, glowPulse 3s infinite; }
        .pane-blue { animation: flyInBlue 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards, glowPulse 3s infinite; }
        .pane-yellow { animation: flyInYellow 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards, glowPulse 3s infinite; }
        .boot-text { animation: textFade 3s ease forwards; }
      `}</style>
    </div>
  );
};

export { Windows7Logo };
export default BootScreen;
