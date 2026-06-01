import React from 'react';

function App() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: '50%', left: '50%', 
        transform: 'translate(-50%, -50%)', 
        color: 'white', 
        fontSize: '2rem',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }}>
        SpicyFalcon OS - Phase 0 Complete
      </div>
    </div>
  );
}

export default App;
