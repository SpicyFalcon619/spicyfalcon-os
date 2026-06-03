import React, { useEffect, useState } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
const Windows7Logo = ({ size = 120, animated = false }) => {
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
  const [opacity, setOpacity] = useState(1);
  const [visible, setVisible] = useState(!hasBooted);

  useEffect(() => {
    if (hasBooted) return;

    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => {
        setVisible(false);
        setHasBooted();
      }, 1000);
    }, 4000); // Wait 4 seconds for full animation

    return () => clearTimeout(timer);
  }, [hasBooted, setHasBooted]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#000',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: opacity,
      transition: 'opacity 1s ease-in-out',
      color: '#fff',
      cursor: 'wait'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px'
      }}>
        <div style={{ filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.4))' }}>
          <Windows7Logo size={140} animated={true} />
        </div>
        <div className="boot-text" style={{ 
          fontSize: '24px', 
          fontFamily: '"Segoe UI", Tahoma, sans-serif', 
          letterSpacing: '1px', 
          fontWeight: '300',
          color: '#fff'
        }}>
          Starting SpicyFalcon OS
        </div>
      </div>
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
