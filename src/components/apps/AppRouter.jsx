import React, { lazy, Suspense } from 'react';

const Notepad = lazy(() => import('./Notepad'));
const WindowsExplorer = lazy(() => import('./WindowsExplorer'));
const InternetExplorer = lazy(() => import('./InternetExplorer'));
const MSPaint = lazy(() => import('./MSPaint'));
const Minesweeper = lazy(() => import('./Minesweeper'));
const Spicefify = lazy(() => import('./Spicefify'));
const CommandPrompt = lazy(() => import('./CommandPrompt'));
const ControlPanel = lazy(() => import('./ControlPanel'));
const Calculator = lazy(() => import('./Calculator'));
const SystemFolder = lazy(() => import('./SystemFolder'));
const Winver = lazy(() => import('./Winver'));

const AppRouter = ({ windowData }) => {
  const { component } = windowData;
  
  const getComponent = () => {
    switch(component) {
      case 'notepad': return <Notepad windowData={windowData} />;
      case 'explorer': return <WindowsExplorer windowData={windowData} />;
      case 'ie': return <InternetExplorer windowData={windowData} />;
      case 'paint': return <MSPaint windowData={windowData} />;
      case 'minesweeper': return <Minesweeper windowData={windowData} />;
      case 'spotify': return <Spicefify windowData={windowData} />;
      case 'cmd': return <CommandPrompt windowData={windowData} />;
      case 'control-panel': return <ControlPanel windowData={windowData} />;
      case 'calculator': return <Calculator windowData={windowData} />;
      case 'winver': return <Winver windowData={windowData} />;
      case 'computer':
      case 'recycle-bin':
      case 'documents':
      case 'pictures':
      case 'music':
        return <SystemFolder windowData={windowData} />;
      default: return <div style={{ padding: '20px' }}>Application "{component}" not found.</div>;
    }
  };

  return (
    <Suspense fallback={<div style={{ padding: '20px', color: '#000' }}>Loading...</div>}>
      {getComponent()}
    </Suspense>
  );
};

export default AppRouter;
