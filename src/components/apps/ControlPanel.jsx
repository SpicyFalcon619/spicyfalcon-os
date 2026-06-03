import React, { useState } from 'react';
import useConfigStore from '../../store/useConfigStore';
import { IconShield, IconLockOpen, IconLock, IconCheck, IconX } from '@tabler/icons-react';

const ControlPanel = () => {
  const { username, osName, isAdmin, setUsername, setOsName, setAdmin } = useConfigStore();
  const [showUAC, setShowUAC] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [tempOsName, setTempOsName] = useState(osName);

  const handleRunAsAdmin = () => {
    setShowUAC(true);
  };

  const handleUACAccept = () => {
    setAdmin(true);
    setShowUAC(false);
  };

  const handleUACDecline = () => {
    setShowUAC(false);
  };
  
  const handleSave = () => {
    setUsername(tempUsername);
    setOsName(tempOsName);
  };

  const btnStyle = {
    padding: '8px 16px',
    background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
    border: '1px solid #999',
    borderRadius: '3px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    boxShadow: 'inset 0 1px 1px white'
  };

  const inputStyle = {
    padding: '6px',
    border: '1px solid #abadb3',
    borderRadius: '2px',
    fontSize: '13px',
    width: '200px'
  };

  return (
    <div style={{ padding: '20px', color: '#333', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', position: 'relative' }}>
      
      {showUAC && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            width: '400px', backgroundColor: '#f0f0f0', border: '1px solid #003366', borderRadius: '5px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.5)', overflow: 'hidden'
          }}>
            <div style={{ padding: '15px 20px', backgroundColor: '#003366', color: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <IconShield size={32} color="#facc15" />
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>User Account Control</div>
              </div>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'white' }}>
              <p style={{ margin: '0 0 15px 0', fontSize: '13px' }}>Do you want to allow the following program to make changes to this computer?</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <IconShield size={24} color="#3b82f6" />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '13px' }}>SpicyFalcon OS Configurator</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>Verified publisher: SpicyFalcon</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button style={btnStyle} onClick={handleUACAccept}>Yes</button>
                <button style={btnStyle} onClick={handleUACDecline}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #ccc', paddingBottom: '15px', marginBottom: '20px' }}>
        <IconSettings size={40} color="#003366" />
        <div>
          <h2 style={{ margin: 0, color: '#003366', fontWeight: '300' }}>Customization Engine</h2>
          <div style={{ color: '#666', fontSize: '13px' }}>Configure your SpicyFalcon OS environment</div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {!isAdmin ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '15px' }}>
            <IconLock size={48} color="#999" />
            <p style={{ color: '#666', fontSize: '14px', maxWidth: '300px', textAlign: 'center' }}>
              System customization is locked. You need Administrator privileges to change these settings.
            </p>
            <button style={{...btnStyle, padding: '10px 20px'}} onClick={handleRunAsAdmin}>
              <IconShield size={18} color="#3b82f6" />
              Run as Administrator
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#16a34a', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>
              <IconLockOpen size={18} />
              Administrator Access Granted
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>OS Name</label>
              <input 
                type="text" 
                value={tempOsName} 
                onChange={e => setTempOsName(e.target.value)} 
                style={inputStyle} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Profile Username</label>
              <input 
                type="text" 
                value={tempUsername} 
                onChange={e => setTempUsername(e.target.value)} 
                style={inputStyle} 
              />
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button style={{...btnStyle, backgroundColor: '#e1f0fa'}} onClick={handleSave}>
                <IconCheck size={16} color="#16a34a" /> Save Changes
              </button>
              <button style={btnStyle} onClick={() => setAdmin(false)}>
                <IconLock size={16} /> Lock Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const IconSettings = ({ size, color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
    <path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0 -6 0"></path>
  </svg>
);

export default ControlPanel;
