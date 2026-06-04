import React, { useState, useEffect } from 'react';
import useWindowStore from '../../store/useWindowStore';
import useDesktopStore from '../../store/useDesktopStore';
import { CalendarPopup, VolumePopup, BatteryIcon } from './SystemTrayPopups';

// Map component names to icon paths
const ICON_MAP = {
  'portfolio': '/assets/icons/notepad.png',
  'notepad': '/assets/icons/notepad.png',
  'my-computer': '/assets/icons/computer.png',
  'task-manager': '/assets/icons/task-manager.svg',
  'spicetify': '/assets/icons/spicetify.png',
  'minesweeper': '/assets/icons/minesweeper.png',
  'cmd': '/assets/icons/cmd.png',
  'paint': '/assets/icons/paint.png',
  'device-manager': '/assets/icons/device-manager.png',
  'soundboard': '/assets/icons/volume.png',
  'ie': '/assets/icons/ie.png',
  'spicyver': '/assets/icons/winver.png',
  'calculator': '/assets/icons/calculator.png',
  'photo-viewer': '/assets/icons/photo-viewer.png',
  'explorer': '/assets/icons/explorer.png',
  'recycle-bin': '/assets/icons/recycle-bin.png',
  'control-panel': '/assets/icons/control-panel.png',
};

const getIconForWindow = (win) => {
  // Check explicit icon first
  if (win.icon) return win.icon;
  // Try component name
  if (win.component && ICON_MAP[win.component]) return ICON_MAP[win.component];
  // Try parsing from id
  const idParts = win.id.replace('app-', '');
  if (ICON_MAP[idParts]) return ICON_MAP[idParts];
  // Fallback
  return '/assets/icons/notepad.png';
};

const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ lineHeight: '1.25', textAlign: 'center' }}>
      <div style={{ fontSize: '12px', fontWeight: '600' }}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div style={{ fontSize: '11px' }}>
        {time.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })}
      </div>
    </div>
  );
};

const Taskbar = () => {
  const [taskbarMenu, setTaskbarMenu] = useState({ visible: false, x: 0, winId: null });
  const [hoveredId, setHoveredId] = useState(null);
  const windows = useWindowStore(s => s.windows);
  const activeWindowId = useWindowStore(s => s.activeWindowId);
  const focusWindow = useWindowStore(s => s.focusWindow);
  const restoreWindow = useWindowStore(s => s.restoreWindow);
  const minimizeWindow = useWindowStore(s => s.minimizeWindow);
  const closeWindow = useWindowStore(s => s.closeWindow);

  const toggleStartMenu = useDesktopStore(s => s.toggleStartMenu);
  const systemTrayPopup = useDesktopStore(s => s.systemTrayPopup);
  const setSystemTrayPopup = useDesktopStore(s => s.setSystemTrayPopup);

  const handleTaskbarItemClick = (win) => {
    if (win.isMinimized) {
      restoreWindow(win.id);
    } else if (activeWindowId === win.id) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  };

  const handleContextMenu = (e, winId) => {
    e.preventDefault();
    e.stopPropagation();
    setTaskbarMenu({ visible: true, x: e.clientX, winId });
    setSystemTrayPopup(null);
  };

  const dismissAll = () => {
    setTaskbarMenu({ ...taskbarMenu, visible: false });
    setSystemTrayPopup(null);
  };

  return (
    <>
      {/* ── TASKBAR ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'var(--taskbar-height, 48px)',
          zIndex: 'var(--z-taskbar, 9000)',
          /* Win7 Aero glass — darker, more saturated */
          background: 'linear-gradient(180deg, rgba(55,110,155,0.80) 0%, rgba(30,75,120,0.90) 40%, rgba(18,55,95,0.95) 41%, rgba(10,40,75,0.97) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.30)',
          boxShadow: '0 -1px 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18)',
          display: 'flex',
          alignItems: 'center',
          padding: '0',
          gap: 0,
          userSelect: 'none',
        }}
        onPointerDown={dismissAll}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* ── START BUTTON ── */}
        <button
          id="start-button"
          onPointerDown={(e) => { e.stopPropagation(); toggleStartMenu(); }}
          style={{
            width: 54,
            height: '100%',
            border: 'none',
            background: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            outline: 'none',
          }}
        >
          <img
            src="/assets/start.png"
            alt="Start"
            style={{ width: 44, height: 44, objectFit: 'contain', pointerEvents: 'none' }}
          />
        </button>

        {/* ── WINDOW ICON BUTTONS (Superbar style — icons only) ── */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: '100%', gap: '1px', padding: '3px 2px', overflowX: 'hidden' }}>
          {windows.map(win => {
            const isActive = activeWindowId === win.id && !win.isMinimized;
            const isHovered = hoveredId === win.id;
            const iconSrc = getIconForWindow(win);

            // Background styling based on state
            let bgStyle, boxShadowStyle;
            if (isActive) {
              bgStyle = 'linear-gradient(180deg, rgba(130,185,235,0.55) 0%, rgba(90,150,210,0.60) 40%, rgba(55,115,180,0.65) 41%, rgba(40,90,150,0.70) 100%)';
              boxShadowStyle = 'inset 0 0 0 1px rgba(255,255,255,0.35), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 4px rgba(100,170,240,0.3)';
            } else if (isHovered) {
              bgStyle = 'linear-gradient(180deg, rgba(120,175,225,0.45) 0%, rgba(80,140,200,0.50) 40%, rgba(50,110,175,0.55) 41%, rgba(35,85,145,0.60) 100%)';
              boxShadowStyle = 'inset 0 0 0 1px rgba(255,255,255,0.25), inset 0 1px 0 rgba(255,255,255,0.3)';
            } else {
              bgStyle = 'linear-gradient(180deg, rgba(80,130,180,0.20) 0%, rgba(50,100,155,0.25) 100%)';
              boxShadowStyle = 'inset 0 0 0 1px rgba(255,255,255,0.08)';
            }

            return (
              <button
                key={win.id}
                onPointerDown={(e) => { if (e.button !== 0) return; e.stopPropagation(); handleTaskbarItemClick(win); }}
                onContextMenu={(e) => handleContextMenu(e, win.id)}
                onMouseEnter={() => setHoveredId(win.id)}
                onMouseLeave={() => setHoveredId(null)}
                title={win.title}
                style={{
                  width: 42,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  outline: 'none',
                  background: bgStyle,
                  boxShadow: boxShadowStyle,
                  transition: 'background 0.15s, box-shadow 0.15s',
                  flexShrink: 0,
                  position: 'relative',
                  padding: 0,
                }}
              >
                <img
                  src={iconSrc}
                  alt=""
                  style={{ width: 24, height: 24, objectFit: 'contain', pointerEvents: 'none', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                {/* Active indicator line at the bottom */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: 1,
                    left: '20%',
                    right: '20%',
                    height: 2,
                    borderRadius: 1,
                    background: 'rgba(180,220,255,0.9)',
                    boxShadow: '0 0 4px rgba(120,180,255,0.8)',
                  }} />
                )}
                {/* Running but not active — small dot indicator */}
                {!isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'rgba(180,220,255,0.6)',
                    boxShadow: '0 0 2px rgba(120,180,255,0.5)',
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* ── SYSTEM TRAY ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            borderLeft: '1px solid rgba(255,255,255,0.12)',
            gap: 0,
            flexShrink: 0,
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Tray notification area arrow */}
          <div style={{ 
            padding: '0 4px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '10px',
          }}>
            ▲
          </div>

          {/* Network / battery / volume icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px', color: '#fff', fontSize: '11px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            <BatteryIcon />
            <div
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onPointerDown={(e) => { e.stopPropagation(); setSystemTrayPopup(systemTrayPopup === 'volume' ? null : 'volume'); }}
            >
              <img src="/assets/icons/volume-windows.png" alt="Volume" style={{ width: 16, height: 16, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }} />
            </div>
          </div>

          {/* Popups rendered via portals on the fixed layer */}
          {systemTrayPopup === 'volume'   && <VolumePopup />}
          {systemTrayPopup === 'calendar' && <CalendarPopup />}

          {/* Clock — clicking opens calendar */}
          <div
            onPointerDown={(e) => { e.stopPropagation(); setSystemTrayPopup(systemTrayPopup === 'calendar' ? null : 'calendar'); }}
            style={{
              cursor: 'pointer',
              padding: '0 10px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.9)',
              fontSize: '12px',
              fontFamily: '"Segoe UI", Tahoma, sans-serif',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Clock />
          </div>

          {/* Show Desktop sliver */}
          <div
            title="Show Desktop"
            style={{
              width: 12,
              height: '100%',
              borderLeft: '1px solid rgba(170,200,230,0.25)',
              background: 'rgba(255,255,255,0.04)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onPointerDown={(e) => {
              e.stopPropagation();
              // Minimize all windows
              windows.forEach(w => { if (!w.isMinimized) minimizeWindow(w.id); });
            }}
          />
        </div>
      </div>

      {/* ── WINDOW CONTEXT MENU ── */}
      {taskbarMenu.visible && (
        <div
          style={{
            position: 'fixed',
            left: taskbarMenu.x,
            bottom: 50,
            width: 160,
            backgroundColor: '#f0f0f0',
            border: '1px solid #999',
            boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
            zIndex: 99999,
            fontFamily: '"Segoe UI", Tahoma, sans-serif',
            fontSize: '12px',
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {[
            { label: 'Restore', action: () => restoreWindow(taskbarMenu.winId) },
            { label: 'Minimize', action: () => minimizeWindow(taskbarMenu.winId) },
            { label: 'Maximize', action: () => restoreWindow(taskbarMenu.winId) },
            null, // separator
            { label: 'Close window', action: () => closeWindow(taskbarMenu.winId), bold: true },
          ].map((item, i) =>
            item === null ? (
              <div key={i} style={{ height: 1, backgroundColor: '#c0c0c0', margin: '3px 0' }} />
            ) : (
              <div
                key={item.label}
                onClick={() => { item.action(); setTaskbarMenu({ ...taskbarMenu, visible: false }); }}
                style={{
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontWeight: item.bold ? 'bold' : 'normal',
                  color: '#000',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3399ff'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#000'; }}
              >
                {item.label}
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};

export default Taskbar;
