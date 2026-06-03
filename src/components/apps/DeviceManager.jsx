import React, { useState } from 'react';

// Device tree data — real specs from your rig
const DEVICE_TREE = [
  {
    id: 'processors',
    label: 'Processors',
    icon: '⚙',
    devices: [
      { name: '13th Gen Intel(R) Core(TM) i7-13650HX @ 2.60GHz', status: 'ok', driver: '10.0.22621.2506', mfg: 'Intel' },
      { name: '13th Gen Intel(R) Core(TM) i7-13650HX (Core 2)', status: 'ok', driver: '10.0.22621.2506', mfg: 'Intel' },
      { name: '... 12 more logical processors', status: 'ok', driver: '', mfg: '' },
    ],
  },
  {
    id: 'display',
    label: 'Display adapters',
    icon: '🖥',
    devices: [
      { name: 'NVIDIA GeForce RTX 4050 Laptop GPU', status: 'ok', driver: '31.0.15.5222', mfg: 'NVIDIA' },
      { name: 'Intel(R) UHD Graphics', status: 'ok', driver: '31.0.101.5186', mfg: 'Intel' },
    ],
  },
  {
    id: 'memory',
    label: 'Memory technology devices',
    icon: '💾',
    devices: [
      { name: 'Samsung LPDDR5X 16 GB (Slot 0)', status: 'ok', driver: 'N/A', mfg: 'Samsung' },
    ],
  },
  {
    id: 'disk',
    label: 'Disk drives',
    icon: '💿',
    devices: [
      { name: 'SAMSUNG MZVL2512HDJD-00BL2 (512 GB NVMe SSD)', status: 'ok', driver: '10.0.22621.3810', mfg: 'Samsung' },
    ],
  },
  {
    id: 'network',
    label: 'Network adapters',
    icon: '🌐',
    devices: [
      { name: 'Realtek PCIe GbE Family Controller', status: 'ok', driver: '10.60.0.79', mfg: 'Realtek' },
      { name: 'Intel(R) Wi-Fi 6E AX211 160MHz', status: 'ok', driver: '22.240.0.5', mfg: 'Intel' },
      { name: 'Bluetooth Device (Personal Area Network)', status: 'ok', driver: '10.0.22621.4601', mfg: 'Microsoft' },
    ],
  },
  {
    id: 'audio',
    label: 'Sound, video and game controllers',
    icon: '🔊',
    devices: [
      { name: 'Realtek High Definition Audio', status: 'ok', driver: '6.0.9498.1', mfg: 'Realtek' },
      { name: 'NVIDIA Virtual Audio Device (Wave Extensible)', status: 'ok', driver: '1.4.1.1', mfg: 'NVIDIA' },
    ],
  },
  {
    id: 'usb',
    label: 'Universal Serial Bus controllers',
    icon: '🔌',
    devices: [
      { name: 'Intel(R) USB 3.2 eXtensible Host Controller - 1.10 (Microsoft)', status: 'ok', driver: '10.0.22621.3810', mfg: 'Intel' },
      { name: 'USB Root Hub (USB 3.0)', status: 'ok', driver: '10.0.22621.3810', mfg: 'Microsoft' },
    ],
  },
  {
    id: 'keyboard',
    label: 'Keyboards',
    icon: '⌨',
    devices: [
      { name: 'HID Keyboard Device', status: 'ok', driver: '10.0.22621.1', mfg: 'Microsoft' },
    ],
  },
  {
    id: 'mice',
    label: 'Mice and other pointing devices',
    icon: '🖱',
    devices: [
      { name: 'HID-compliant mouse', status: 'ok', driver: '10.0.22621.1', mfg: 'Microsoft' },
    ],
  },
  {
    id: 'battery',
    label: 'Batteries',
    icon: '🔋',
    devices: [
      { name: 'Microsoft AC Adapter', status: 'ok', driver: '10.0.22621.1', mfg: 'Microsoft' },
      { name: 'Microsoft ACPI-Compliant Control Method Battery', status: 'ok', driver: '10.0.22621.1', mfg: 'Microsoft' },
    ],
  },
];

const STATUS_COLORS = { ok: '#2a9d2a', warn: '#d48a00', error: '#c00' };
const STATUS_ICONS  = { ok: '✔', warn: '⚠', error: '✖' };

const DeviceManager = () => {
  const [expanded, setExpanded] = useState({ processors: true });
  const [selected, setSelected] = useState(null); // { catId, devIdx }

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const selectDev = (catId, devIdx) => setSelected(s => (s?.catId === catId && s?.devIdx === devIdx) ? null : { catId, devIdx });

  const selectedCat = selected ? DEVICE_TREE.find(c => c.id === selected.catId) : null;
  const selectedDev = selectedCat ? selectedCat.devices[selected.devIdx] : null;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      backgroundColor: '#fff', fontFamily: '"Segoe UI", Tahoma, sans-serif', fontSize: '12px',
    }}>
      {/* ── MENU BAR ── */}
      <div style={{
        display: 'flex', gap: 0, borderBottom: '1px solid #c0c0c0',
        backgroundColor: '#f0f0f0',
      }}>
        {['File', 'Action', 'View', 'Help'].map(m => (
          <div key={m} style={{
            padding: '3px 10px', cursor: 'default', color: '#000',
            fontSize: 12,
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#3399ff'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >{m}</div>
        ))}
      </div>

      {/* ── TOOLBAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, padding: '3px 6px',
        borderBottom: '1px solid #c8c8c8', backgroundColor: '#fafafa',
      }}>
        {[
          { icon: '⟳', title: 'Refresh' },
          { icon: '⬆', title: 'Update Driver' },
          { icon: '⬇', title: 'Disable Device' },
          { icon: '✕', title: 'Uninstall Device' },
          { icon: '⚙', title: 'Properties', bold: true },
        ].map(btn => (
          <button key={btn.icon} title={btn.title} style={{
            width: 26, height: 22, border: '1px solid #bbb', borderRadius: 2,
            background: '#e8e8e8', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 13,
            fontFamily: 'Tahoma', userSelect: 'none',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#d0e8ff'}
            onMouseLeave={e => e.currentTarget.style.background = '#e8e8e8'}
          >
            {btn.icon}
          </button>
        ))}
        <div style={{ width: 1, height: 18, background: '#c0c0c0', margin: '0 4px' }} />
        <span style={{ fontSize: 11, color: '#555' }}>SPICYFALCON-PC</span>
      </div>

      {/* ── SPLIT CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Tree panel */}
        <div style={{
          width: selectedDev ? '55%' : '100%', borderRight: selectedDev ? '1px solid #c8c8c8' : 'none',
          overflowY: 'auto', transition: 'width 0.2s',
        }}>
          {/* Root computer node */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', fontWeight: 'bold', color: '#000',
            borderBottom: '1px solid #eee',
          }}>
            <img src="/assets/icons/computer.png" alt="" width={16} height={16}
              onError={e => { e.target.style.display = 'none'; }} />
            SPICYFALCON-PC
          </div>

          {/* Categories */}
          {DEVICE_TREE.map(cat => (
            <div key={cat.id}>
              {/* Category row */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', cursor: 'pointer', userSelect: 'none',
                  borderBottom: '1px solid #f0f0f0',
                  background: expanded[cat.id] ? '#e8f0fb' : 'transparent',
                }}
                onClick={() => toggle(cat.id)}
                onMouseEnter={e => { if (!expanded[cat.id]) e.currentTarget.style.background = '#f4f8ff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = expanded[cat.id] ? '#e8f0fb' : 'transparent'; }}
              >
                <span style={{
                  width: 12, fontSize: 9, color: '#666', display: 'inline-block', textAlign: 'center',
                }}>{expanded[cat.id] ? '▼' : '▶'}</span>
                <span style={{ fontSize: 14 }}>{cat.icon}</span>
                <span style={{ fontWeight: expanded[cat.id] ? '600' : 'normal', color: '#000' }}>{cat.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: '#888' }}>
                  {cat.devices.length} {cat.devices.length === 1 ? 'device' : 'devices'}
                </span>
              </div>

              {/* Devices */}
              {expanded[cat.id] && cat.devices.map((dev, di) => {
                const isSel = selected?.catId === cat.id && selected?.devIdx === di;
                return (
                  <div
                    key={di}
                    onClick={() => selectDev(cat.id, di)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '3px 10px 3px 36px', cursor: 'pointer',
                      background: isSel ? '#0078d4' : 'transparent',
                      color: isSel ? '#fff' : '#000',
                      borderBottom: '1px solid #f8f8f8',
                    }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = '#cce4ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isSel ? '#0078d4' : 'transparent'; }}
                  >
                    <span style={{ color: isSel ? '#fff' : STATUS_COLORS[dev.status], fontSize: 11, flexShrink: 0 }}>
                      {STATUS_ICONS[dev.status]}
                    </span>
                    <span style={{ flex: 1, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {dev.name}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Properties panel */}
        {selectedDev && (
          <div style={{
            flex: 1, padding: '16px', overflowY: 'auto',
            background: '#fafafa', display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              paddingBottom: 10, borderBottom: '1px solid #ddd',
            }}>
              <span style={{ fontSize: 28 }}>{selectedCat?.icon}</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 13, color: '#000' }}>{selectedDev.name}</div>
                <div style={{ fontSize: 11, color: STATUS_COLORS[selectedDev.status], fontWeight: '600', marginTop: 2 }}>
                  {STATUS_ICONS[selectedDev.status]}&nbsp;
                  {selectedDev.status === 'ok' ? 'This device is working properly.' : 'Device has an issue.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '6px 0', fontSize: 12 }}>
              {[
                ['Category', selectedCat?.label],
                ['Manufacturer', selectedDev.mfg || 'N/A'],
                ['Driver Version', selectedDev.driver || 'N/A'],
                ['Device Status', selectedDev.status === 'ok' ? 'Working properly' : 'Error'],
              ].map(([label, value]) => (
                <React.Fragment key={label}>
                  <span style={{ color: '#555', paddingRight: 8 }}>{label}:</span>
                  <span style={{ color: '#000', fontWeight: '500' }}>{value}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Fake action buttons */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              {['Update Driver', 'Disable Device', 'Properties'].map(lbl => (
                <button key={lbl} style={{
                  padding: '4px 14px', border: '1px solid #aaa', borderRadius: 3,
                  background: 'linear-gradient(180deg, #f0f0f0 0%, #ddd 100%)',
                  cursor: 'pointer', fontSize: 12, fontFamily: 'Tahoma, sans-serif',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(180deg,#e0efff 0%,#b8d8ff 100%)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(180deg,#f0f0f0 0%,#ddd 100%)'}
                  onClick={() => {}}
                >{lbl}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── STATUS BAR ── */}
      <div style={{
        height: 20, background: '#f0f0f0', borderTop: '1px solid #c8c8c8',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 8px', fontSize: 11, color: '#555', flexShrink: 0,
      }}>
        <span>{selectedDev ? selectedDev.name : 'SPICYFALCON-PC'}</span>
        <span>{DEVICE_TREE.reduce((sum, c) => sum + c.devices.length, 0)} devices total</span>
      </div>
    </div>
  );
};

export default DeviceManager;
