import React, { useState, useRef, useEffect } from 'react';

const CommandPrompt = () => {
  const [history, setHistory] = useState([
    'Microsoft Windows [Version 6.1.7601]',
    'Copyright (c) 2009 Microsoft Corporation. All rights reserved.',
    '',
    'C:\\Users\\Guest> echo "Welcome to SpicyFalcon Contact Form"',
    '"Welcome to SpicyFalcon Contact Form"',
    '',
    'Type "help" to see available commands.',
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      let response = '';

      if (cmd.toLowerCase() === 'help') {
        response = 'Commands: help, clear, email [message]';
      } else if (cmd.toLowerCase() === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (cmd.toLowerCase().startsWith('email ')) {
        response = `Sending email with message: "${cmd.replace('email ', '')}"... Sent successfully.`;
      } else if (cmd !== '') {
        response = `'${cmd}' is not recognized as an internal or external command.`;
      }

      setHistory(prev => [...prev, `C:\\Users\\Guest> ${cmd}`, response, '']);
      setInput('');
    }
  };

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView();
  }, [history]);

  return (
    <div style={{ backgroundColor: '#000', color: '#ccc', fontFamily: 'Consolas, monospace', padding: '10px', height: '100%', overflowY: 'auto' }}>
      {history.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      <div style={{ display: 'flex' }}>
        <span>C:\Users\Guest&gt;&nbsp;</span>
        <input 
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ backgroundColor: 'transparent', color: '#ccc', border: 'none', outline: 'none', fontFamily: 'Consolas, monospace', flex: 1 }}
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};

export default CommandPrompt;
