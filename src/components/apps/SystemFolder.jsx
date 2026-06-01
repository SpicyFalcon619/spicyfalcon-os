import React from 'react';

const SystemFolder = ({ windowData }) => {
  return (
    <div style={{ padding: '20px', color: 'black' }}>
      <h2>{windowData.title}</h2>
      <p>System folder contents.</p>
    </div>
  );
};

export default SystemFolder;
