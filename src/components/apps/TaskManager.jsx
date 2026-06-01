import React, { useState, useEffect } from 'react';
import { IconCpu, IconDeviceAnalytics } from '@tabler/icons-react';

const TaskManager = () => {
  const [cpuUsage, setCpuUsage] = useState(12);
  const [ramUsage, setRamUsage] = useState(42);
  
  // Fake graph data
  const [cpuHistory, setCpuHistory] = useState(Array(20).fill(12));
  const [ramHistory, setRamHistory] = useState(Array(20).fill(42));

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const val = Math.max(1, Math.min(100, prev + (Math.random() * 10 - 5)));
        setCpuHistory(history => [...history.slice(1), val]);
        return val;
      });
      setRamUsage(prev => {
        const val = Math.max(30, Math.min(60, prev + (Math.random() * 2 - 1)));
        setRamHistory(history => [...history.slice(1), val]);
        return val;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [activeTab, setActiveTab] = useState('Performance');

  const renderGraph = (history, color) => {
    return (
      <div style={{ flex: 1, backgroundColor: '#000', border: '1px solid #000', display: 'flex', alignItems: 'flex-end', gap: '2px', padding: '2px', height: '100px' }}>
        {history.map((val, i) => (
          <div key={i} style={{ flex: 1, height: `${val}%`, backgroundColor: color, transition: 'height 0.2s' }}></div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f0f0f0', fontFamily: '"Tahoma", sans-serif', fontSize: '12px' }}>
      
      {/* Menu bar */}
      <div style={{ display: 'flex', gap: '15px', padding: '2px 8px', borderBottom: '1px solid #dfdfdf', backgroundColor: '#fafafa' }}>
        <span>File</span>
        <span>Options</span>
        <span>View</span>
        <span>Help</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #888', marginTop: '10px', padding: '0 5px' }}>
        {['Applications', 'Processes', 'Services', 'Performance', 'Networking', 'Users'].map(tab => (
          <div 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '4px 10px',
              border: '1px solid #888',
              borderBottom: activeTab === tab ? '1px solid #f0f0f0' : '1px solid #888',
              backgroundColor: activeTab === tab ? '#f0f0f0' : '#e0e0e0',
              marginBottom: activeTab === tab ? '-1px' : '0',
              borderTopLeftRadius: '3px',
              borderTopRightRadius: '3px',
              cursor: 'pointer'
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '15px', backgroundColor: '#fff', border: '1px solid #888', borderTop: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {activeTab === 'Performance' ? (
          <>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '5px' }}>CPU Usage</div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '40px', textAlign: 'right', fontSize: '18px', color: '#00cc00', backgroundColor: '#000', padding: '5px', border: '1px solid #888' }}>
                    {Math.round(cpuUsage)}%
                  </div>
                  {renderGraph(cpuHistory, '#17fc03')}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '5px' }}>Memory</div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '40px', textAlign: 'right', fontSize: '18px', color: '#00cc00', backgroundColor: '#000', padding: '5px', border: '1px solid #888' }}>
                    {Math.round(ramUsage)}%
                  </div>
                  {renderGraph(ramHistory, '#17fc03')}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '10px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <IconDeviceAnalytics size={16} /> Rig Specifications
              </h3>
              <table style={{ width: '100%', fontSize: '12px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 'bold', width: '100px' }}>Processor:</td>
                    <td>Intel Core i9-13900K @ 3.00GHz (24 Cores)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Memory (RAM):</td>
                    <td>64.0 GB DDR5</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Graphics:</td>
                    <td>NVIDIA GeForce RTX 4090 (24GB VRAM)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 'bold' }}>OS Build:</td>
                    <td>SpicyFalcon OS - Developer Edition (64-bit)</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: '10px', color: '#666', fontStyle: 'italic' }}>
                * Note: These are placeholder specs. Let me know what your real rig is to update them!
              </div>
            </div>
          </>
        ) : (
          <div style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '40px' }}>
            This tab is not fully implemented in the mock version.
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div style={{ display: 'flex', gap: '20px', padding: '4px 15px', borderTop: '1px solid #dfdfdf', backgroundColor: '#fafafa', color: '#444' }}>
        <span>Processes: 84</span>
        <span>CPU Usage: {Math.round(cpuUsage)}%</span>
        <span>Physical Memory: {Math.round(ramUsage)}%</span>
      </div>

    </div>
  );
};

export default TaskManager;
