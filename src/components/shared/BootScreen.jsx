import React, { useEffect, useState } from 'react';
import useDesktopStore from '../../store/useDesktopStore';

const Windows7Logo = ({ size = 120, animated = false }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: `${size * 0.05}px`,
      width: size,
      height: size,
      transform: 'perspective(200px) rotateY(-15deg)',
      filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.4))'
    }}>
      {/* Red */}
      <div className={`win-pane ${animated ? 'pane-red' : ''}`} style={{
        backgroundColor: '#f05025',
        borderTopLeftRadius: '30%',
        borderBottomLeftRadius: '10%',
        borderBottomRightRadius: '5%',
        borderTopRightRadius: '5%',
        boxShadow: 'inset -2px -2px 10px rgba(0,0,0,0.3), inset 2px 2px 10px rgba(255,255,255,0.5)'
      }}></div>
      {/* Green */}
      <div className={`win-pane ${animated ? 'pane-green' : ''}`} style={{
        backgroundColor: '#7fb900',
        borderTopRightRadius: '30%',
        borderBottomRightRadius: '10%',
        borderBottomLeftRadius: '5%',
        borderTopLeftRadius: '5%',
        boxShadow: 'inset -2px -2px 10px rgba(0,0,0,0.3), inset 2px 2px 10px rgba(255,255,255,0.5)'
      }}></div>
      {/* Blue */}
      <div className={`win-pane ${animated ? 'pane-blue' : ''}`} style={{
        backgroundColor: '#00a4ef',
        borderBottomLeftRadius: '30%',
        borderTopLeftRadius: '10%',
        borderTopRightRadius: '5%',
        borderBottomRightRadius: '5%',
        boxShadow: 'inset -2px -2px 10px rgba(0,0,0,0.3), inset 2px 2px 10px rgba(255,255,255,0.5)'
      }}></div>
      {/* Yellow */}
      <div className={`win-pane ${animated ? 'pane-yellow' : ''}`} style={{
        backgroundColor: '#ffb900',
        borderBottomRightRadius: '30%',
        borderTopRightRadius: '10%',
        borderTopLeftRadius: '5%',
        borderBottomLeftRadius: '5%',
        boxShadow: 'inset -2px -2px 10px rgba(0,0,0,0.3), inset 2px 2px 10px rgba(255,255,255,0.5)'
      }}></div>
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
          Starting Windows
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
