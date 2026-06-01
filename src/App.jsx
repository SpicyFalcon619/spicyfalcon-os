import React from 'react';
import useWindowStore from './store/useWindowStore';
import Window from './components/window/Window';
import Desktop from './components/desktop/Desktop';

function App() {
  const windows = useWindowStore(state => state.windows);

  return (
    <Desktop>
      {/* Render all open windows inside the desktop environment */}
      {windows.map(win => (
        <Window key={win.id} windowData={win} />
      ))}
    </Desktop>
  );
}

export default App;
