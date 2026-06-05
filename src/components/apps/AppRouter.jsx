import React, { lazy, Suspense } from 'react';

const Notepad = lazy(() => import('./Notepad'));
const WindowsExplorer = lazy(() => import('./WindowsExplorer'));
const InternetExplorer = lazy(() => import('./InternetExplorer'));
const MSPaint = lazy(() => import('./MSPaint'));
const Minesweeper = lazy(() => import('./Minesweeper'));
const Spicetify = lazy(() => import('./Spicetify'));
const CommandPrompt = lazy(() => import('./CommandPrompt'));
const Calculator = lazy(() => import('./Calculator'));
const SystemFolder = lazy(() => import('./SystemFolder'));
const Spicyver = lazy(() => import('./Spicyver'));
const SystemProperties = lazy(() => import('./SystemProperties'));
const TaskManager = lazy(() => import('./TaskManager'));
const DeviceManager = lazy(() => import('./DeviceManager'));
const PhotoViewer = lazy(() => import('./PhotoViewer'));
const Portfolio = lazy(() => import('./Portfolio'));
const MyComputer = lazy(() => import('./MyComputer'));
const RecycleBin = lazy(() => import('./RecycleBin'));
const DisplayProperties = lazy(() => import('./DisplayProperties'));

const AppRouter = ({ windowData }) => {
  const { component } = windowData;
  
  const getComponent = () => {
    switch(component) {
      case 'notepad': return <Notepad windowData={windowData} />;
      case 'explorer': return <WindowsExplorer windowData={windowData} />;
      case 'ie': return <InternetExplorer windowData={windowData} />;
      case 'paint': return <MSPaint windowData={windowData} />;
      case 'minesweeper': return <Minesweeper windowData={windowData} />;
      case 'spicetify': return <Spicetify windowData={windowData} />;
      case 'cmd': return <CommandPrompt windowData={windowData} />;
      case 'calculator': return <Calculator windowData={windowData} />;
      case 'spicyver': return <Spicyver windowData={windowData} />;
      case 'system-properties': return <SystemProperties windowData={windowData} />;
      case 'task-manager': return <TaskManager windowData={windowData} />;
      case 'device-manager': return <DeviceManager windowData={windowData} />;
      case 'photo-viewer': return <PhotoViewer windowData={windowData} />;
      case 'portfolio': return <Portfolio windowData={windowData} />;
      case 'my-computer': return <MyComputer windowData={windowData} />;
      case 'recycle-bin': return <RecycleBin windowData={windowData} />;
      case 'display-properties': return <DisplayProperties windowData={windowData} />;
      case 'computer':
      case 'documents':
      case 'pictures':
      case 'music':
        return <SystemFolder windowData={windowData} />;
      default: return <div style={{ padding: '20px' }}>Application not found.</div>;
    }
  };

  return (
    <Suspense fallback={<div style={{ padding: '20px', color: '#000' }}>Loading...</div>}>
      {getComponent()}
    </Suspense>
  );
};

export default AppRouter;

