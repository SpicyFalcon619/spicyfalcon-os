import React from 'react';
import useWindowStore from './store/useWindowStore';
import Window from './components/window/Window';

function App() {
  const windows = useWindowStore(state => state.windows);
  const openWindow = useWindowStore(state => state.openWindow);

  const handleSpawnTest = () => {
    openWindow({
      id: `test-window-${Date.now()}`,
      title: `Test Window ${windows.length + 1}`,
      component: 'TestApp',
      width: 500,
      height: 350
    });
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      
      {/* Temporary Desktop Testing UI */}
      <div style={{ 
        position: 'absolute', 
        top: '50%', left: '50%', 
        transform: 'translate(-50%, -50%)', 
        color: 'white', 
        textAlign: 'center',
        zIndex: 1
      }}>
        <h1 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '20px' }}>
          SpicyFalcon OS - Phase 1 Complete
        </h1>
        <button 
          onClick={handleSpawnTest}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid white',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          Spawn Test Window
        </button>
      </div>

      {/* Render all open windows */}
      {windows.map(win => (
        <Window key={win.id} windowData={win} />
      ))}
      
    </div>
  );
}

export default App;
