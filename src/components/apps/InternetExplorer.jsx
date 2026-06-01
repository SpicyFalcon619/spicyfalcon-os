import React, { useState } from 'react';

const InternetExplorer = () => {
  const [url, setUrl] = useState('https://www.google.com/webhp?igu=1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <div style={{ display: 'flex', padding: '8px', gap: '8px', backgroundColor: '#e9eef4', borderBottom: '1px solid #ccc' }}>
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          style={{ flex: 1, padding: '4px', border: '1px solid #abadb3' }}
        />
      </div>
      <iframe src={url} style={{ flex: 1, border: 'none', backgroundColor: '#fff' }} title="browser" />
    </div>
  );
};

export default InternetExplorer;
