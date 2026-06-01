import React from 'react';
import { IconDeviceDesktop, IconCpu, IconDeviceSdCard, IconVideo, IconNetwork, IconSpeakerphone, IconUsb } from '@tabler/icons-react';

const DeviceManager = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff', fontFamily: '"Tahoma", sans-serif', fontSize: '12px' }}>
      
      {/* Menu bar */}
      <div style={{ display: 'flex', gap: '15px', padding: '4px 8px', borderBottom: '1px solid #dfdfdf', backgroundColor: '#f0f0f0' }}>
        <span>File</span>
        <span>Action</span>
        <span>View</span>
        <span>Help</span>
      </div>

      <div style={{ padding: '5px', borderBottom: '1px solid #dfdfdf', backgroundColor: '#fafafa', display: 'flex', gap: '10px' }}>
        <IconDeviceDesktop size={16} color="#555" />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '10px 20px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
          <IconDeviceDesktop size={16} /> SPICYFALCON-PC
        </div>

        <div style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <IconCpu size={16} color="#444" /> Processors
            </div>
            <div style={{ paddingLeft: '25px', color: '#333' }}>Intel Core i9-13900K @ 3.00GHz</div>
            <div style={{ paddingLeft: '25px', color: '#333' }}>Intel Core i9-13900K @ 3.00GHz</div>
            <div style={{ paddingLeft: '25px', color: '#888', fontStyle: 'italic' }}>... (22 more cores)</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <IconVideo size={16} color="#444" /> Display adapters
            </div>
            <div style={{ paddingLeft: '25px', color: '#333' }}>NVIDIA GeForce RTX 4090</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <IconDeviceSdCard size={16} color="#444" /> Memory technology devices
            </div>
            <div style={{ paddingLeft: '25px', color: '#333' }}>64.0 GB DDR5 RAM (6000MHz)</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <IconNetwork size={16} color="#444" /> Network adapters
            </div>
            <div style={{ paddingLeft: '25px', color: '#333' }}>Realtek PCIe GbE Family Controller</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <IconSpeakerphone size={16} color="#444" /> Sound, video and game controllers
            </div>
            <div style={{ paddingLeft: '25px', color: '#333' }}>Realtek High Definition Audio</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <IconUsb size={16} color="#444" /> Universal Serial Bus controllers
            </div>
            <div style={{ paddingLeft: '25px', color: '#333' }}>Intel(R) USB 3.2 eXtensible Host Controller</div>
          </div>

        </div>
        
        <div style={{ marginTop: '30px', color: '#666', fontStyle: 'italic', borderTop: '1px solid #eee', paddingTop: '10px' }}>
          These are placeholder specs for your rig. You can update them in DeviceManager.jsx!
        </div>
      </div>
    </div>
  );
};

export default DeviceManager;
