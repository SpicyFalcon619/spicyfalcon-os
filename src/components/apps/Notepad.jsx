import React, { useState } from 'react';

const Notepad = () => {
  const [text, setText] = useState('Hi! I am SpicyFalcon.\n\nWelcome to my 2010s Windows 7 inspired web portfolio.\nI built this to showcase my skills in React, complex state management, and interaction design.\n\nFeel free to explore!');

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      <div style={{ padding: '2px 8px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#f9f9f9', display: 'flex', gap: '15px', fontSize: '12px', color: '#000' }}>
        <span style={{ cursor: 'pointer' }}>File</span>
        <span style={{ cursor: 'pointer' }}>Edit</span>
        <span style={{ cursor: 'pointer' }}>Format</span>
        <span style={{ cursor: 'pointer' }}>View</span>
        <span style={{ cursor: 'pointer' }}>Help</span>
      </div>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          resize: 'none',
          outline: 'none',
          padding: '4px 8px',
          fontFamily: 'Consolas, "Courier New", monospace',
          fontSize: '14px',
          lineHeight: '1.5'
        }}
        spellCheck="false"
      />
    </div>
  );
};

export default Notepad;
