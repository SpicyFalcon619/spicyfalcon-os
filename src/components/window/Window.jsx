import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import useWindowStore from '../../store/useWindowStore';
import WindowTitleBar from './WindowTitleBar';
import AppRouter from '../apps/AppRouter';

const Window = ({ windowData }) => {
  const { id, title, x, y, width, height, isMinimized, isMaximized, zIndex } = windowData;
  const focusWindow = useWindowStore(state => state.focusWindow);
  const updateWindowSize = useWindowStore(state => state.updateWindowSize);
  const updateWindowPosition = useWindowStore(state => state.updateWindowPosition);
  const activeWindowId = useWindowStore(state => state.activeWindowId);

  const windowRef = useRef(null);
  const resizeRef = useRef({ isResizing: false, direction: '', startX: 0, startY: 0, startWidth: 0, startHeight: 0, startWinX: 0, startWinY: 0 });
  const [isInteracting, setIsInteracting] = React.useState(false);
  
  const isActive = activeWindowId === id;

  if (isMinimized) return null; 

  const windowStyle = {
    position: 'absolute',
    zIndex,
    backgroundColor: 'var(--aero-glass-bg)',
    backdropFilter: 'var(--aero-glass-blur)',
    WebkitBackdropFilter: 'var(--aero-glass-blur)',
    border: '1px solid rgba(0, 0, 0, 0.4)',
    borderRadius: isMaximized ? 0 : '8px',
    boxShadow: isActive ? 'inset 0 1px 1px rgba(255,255,255,0.7), 0 5px 25px rgba(0,0,0,0.5)' : 'inset 0 1px 1px rgba(255,255,255,0.4), 0 2px 10px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'opacity 0.2s', 
  };

  const handlePointerDown = () => {
    focusWindow(id);
  };

  const handleResizeDown = (e, dir) => {
    if (isMaximized) return;
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    resizeRef.current = {
      isResizing: true,
      direction: dir,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: width,
      startHeight: height,
      startWinX: x,
      startWinY: y
    };
    setIsInteracting(true);
  };

  const handleResizeMove = (e) => {
    if (!resizeRef.current.isResizing) return;
    const { direction, startX, startY, startWidth, startHeight, startWinX, startWinY } = resizeRef.current;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newX = startWinX;
    let newY = startWinY;

    if (direction.includes('e')) newWidth = Math.max(300, startWidth + deltaX);
    if (direction.includes('s')) newHeight = Math.max(200, startHeight + deltaY);
    if (direction.includes('w')) {
      const possWidth = startWidth - deltaX;
      if (possWidth > 300) {
        newWidth = possWidth;
        newX = startWinX + deltaX;
      }
    }
    if (direction.includes('n')) {
      const possHeight = startHeight - deltaY;
      if (possHeight > 200) {
        newHeight = possHeight;
        newY = startWinY + deltaY;
      }
    }

    updateWindowSize(id, newWidth, newHeight);
    if (newX !== startWinX || newY !== startWinY) {
      updateWindowPosition(id, newX, newY);
    }
  };

  const handleResizeUp = (e) => {
    if (!resizeRef.current.isResizing) return;
    resizeRef.current.isResizing = false;
    e.target.releasePointerCapture(e.pointerId);
    setIsInteracting(false);
  };

  const renderResizeHandle = (dir, style) => (
    <div 
      style={{ position: 'absolute', zIndex: 10, ...style }}
      onPointerDown={(e) => handleResizeDown(e, dir)}
      onPointerMove={handleResizeMove}
      onPointerUp={handleResizeUp}
    />
  );

  return (
    <motion.div 
      ref={windowRef} 
      style={windowStyle} 
      onPointerDown={handlePointerDown}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        x: isMaximized ? 0 : x, 
        y: isMaximized ? 0 : y, 
        width: isMaximized ? '100vw' : width, 
        height: isMaximized ? 'calc(100vh - var(--taskbar-height))' : height 
      }}
      exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.15 } }}
      transition={isInteracting ? { duration: 0 } : { type: 'spring', bounce: 0, duration: 0.3 }}
    >
      {!isMaximized && (
        <>
          {renderResizeHandle("n", { top: -5, left: 5, right: 5, height: 10, cursor: 'n-resize' })}
          {renderResizeHandle("s", { bottom: -5, left: 5, right: 5, height: 10, cursor: 's-resize' })}
          {renderResizeHandle("e", { top: 5, bottom: 5, right: -5, width: 10, cursor: 'e-resize' })}
          {renderResizeHandle("w", { top: 5, bottom: 5, left: -5, width: 10, cursor: 'w-resize' })}
          {renderResizeHandle("ne", { top: -5, right: -5, width: 15, height: 15, cursor: 'ne-resize' })}
          {renderResizeHandle("nw", { top: -5, left: -5, width: 15, height: 15, cursor: 'nw-resize' })}
          {renderResizeHandle("se", { bottom: -5, right: -5, width: 15, height: 15, cursor: 'se-resize' })}
          {renderResizeHandle("sw", { bottom: -5, left: -5, width: 15, height: 15, cursor: 'sw-resize' })}
        </>
      )}

      <WindowTitleBar 
        windowData={windowData} 
        isActive={isActive} 
        setIsInteracting={setIsInteracting}
      />
      <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.4)', margin: isMaximized ? '0' : '0 8px 8px 8px', overflow: 'hidden' }}>
        <AppRouter windowData={windowData} />
      </div>
    </motion.div>
  );
};

export default Window;
