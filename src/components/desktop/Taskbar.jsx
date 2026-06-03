import React, { useState, useEffect } from 'react';
import useWindowStore from '../../store/useWindowStore';
import useDesktopStore from '../../store/useDesktopStore';
import { CalendarPopup, VolumePopup, BatteryIcon } from './SystemTrayPopups';
import { IconVolume } from '@tabler/icons-react';

// Small SVG icon helper — renders a simple app icon from the /assets/icons/ folder
const AppIcon = ({ src, size = 16 }) => (
  <img
    src={src}
    alt=""
    width={size}
    height={size}
    style={{ objectFit: 'contain', flexShrink: 0 }}
    onError={(e) => { e.target.style.display = 'none'; }}
  />
);

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
          height: 'var(--taskbar-height, 40px)',
          zIndex: 'var(--z-taskbar, 9000)',
          /* Win7 Aero glass */
          background: 'linear-gradient(180deg, rgba(70,120,160,0.82) 0%, rgba(30,70,110,0.92) 48%, rgba(20,55,90,0.96) 49%, rgba(10,40,75,0.98) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.30)',
          boxShadow: '0 -1px 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
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

        {/* ── WINDOW BUTTONS ── */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: '100%', gap: '2px', padding: '3px 4px', overflowX: 'hidden' }}>
          {windows.map(win => {
            const isActive = activeWindowId === win.id && !win.isMinimized;
            return (
              <button
                key={win.id}
                onPointerDown={(e) => { if (e.button !== 0) return; e.stopPropagation(); handleTaskbarItemClick(win); }}
                onContextMenu={(e) => handleContextMenu(e, win.id)}
                title={win.title}
                style={{
                  minWidth: 120,
                  maxWidth: 200,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '0 8px',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  outline: 'none',
                  overflow: 'hidden',
                  // Active: brighter, inset glow
                  background: isActive
                    ? 'linear-gradient(180deg, rgba(140,190,230,0.55) 0%, rgba(80,140,200,0.65) 45%, rgba(50,110,170,0.7) 50%, rgba(30,80,140,0.75) 100%)'
                    : 'linear-gradient(180deg, rgba(100,150,200,0.25) 0%, rgba(60,110,170,0.3) 100%)',
                  boxShadow: isActive
                    ? 'inset 0 0 0 1px rgba(255,255,255,0.3), inset 0 1px 0 rgba(255,255,255,0.4)'
                    : 'inset 0 0 0 1px rgba(255,255,255,0.10)',
                  color: '#fff',
                  fontSize: '12px',
                  fontFamily: '"Segoe UI", Tahoma, sans-serif',
                  fontWeight: isActive ? '600' : '400',
                  textShadow: '0 1px 2px rgba(0,0,0,0.9)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  transition: 'background 0.1s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'linear-gradient(180deg,rgba(130,180,230,0.45) 0%,rgba(80,140,200,0.5) 100%)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'linear-gradient(180deg,rgba(100,150,200,0.25) 0%,rgba(60,110,170,0.3) 100%)';
                }}
              >
                {/* App icon from assets */}
                <AppIcon
                  src={`/assets/icons/${win.component || win.id.split('-')[1] || 'notepad'}.png`}
                  size={16}
                />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, textAlign: 'left' }}>
                  {win.title}
                </span>
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
            borderLeft: '1px solid rgba(255,255,255,0.15)',
            gap: 0,
            flexShrink: 0,
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Network / battery / volume icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', color: '#fff', fontSize: '11px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
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
              width: 10,
              height: '100%',
              borderLeft: '1px solid rgba(255,255,255,0.2)',
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
            bottom: 42,
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
