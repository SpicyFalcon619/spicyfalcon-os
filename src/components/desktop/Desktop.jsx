import React from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import ContextMenu from './ContextMenu';

const Desktop = ({ children }) => {
  const icons = useDesktopStore(state => state.icons);
  const clearSelection = useDesktopStore(state => state.clearSelection);
  const showContextMenu = useDesktopStore(state => state.showContextMenu);

  const handlePointerDown = (e) => {
    clearSelection();
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY);
  };

  return (
    <div 
      style={{ width: '100%', height: '100%', position: 'relative' }}
      onPointerDown={handlePointerDown}
      onContextMenu={handleContextMenu}
    >
      {/* Desktop Icons */}
      {icons.map(icon => (
        <DesktopIcon key={icon.id} iconData={icon} />
      ))}

      {/* Application Windows */}
      {children}

      <StartMenu />
      <Taskbar />
      <ContextMenu />
    </div>
  );
};

export default Desktop;
