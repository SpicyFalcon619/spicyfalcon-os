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
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      let response = '';

      if (cmd.toLowerCase() === 'help') {
        response = 'Commands: help, clear, whoami, date, echo [msg], dir/ls';
      } else if (cmd.toLowerCase() === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (cmd.toLowerCase() === 'whoami') {
        response = 'SpicyFalcon\\Guest\nPrivilege Level: Administrator';
      } else if (cmd.toLowerCase() === 'date') {
        response = new Date().toString();
      } else if (cmd.toLowerCase() === 'dir' || cmd.toLowerCase() === 'ls') {
        response = ' Volume in drive C is SpicyFalcon OS\n Volume Serial Number is 619X-ABCD\n\n Directory of C:\\Users\\Guest\n\n06/03/2026  10:00 AM    <DIR>          .\n06/03/2026  10:00 AM    <DIR>          ..\n06/03/2026  10:00 AM    <DIR>          Desktop\n06/03/2026  10:00 AM    <DIR>          Documents\n               0 File(s)              0 bytes\n               4 Dir(s)  512,000,000,000 bytes free';
      } else if (cmd.toLowerCase().startsWith('echo ')) {
        response = cmd.substring(5);
      } else if (cmd.toLowerCase().startsWith('email ')) {
        response = `Sending email with message: "${cmd.substring(6)}"... Sent successfully.`;
      } else if (cmd !== '') {
        response = `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`;
      }

      setHistory(prev => [...prev, `C:\\Users\\Guest> ${cmd}`, response, '']);
      setInput('');
    }
  };

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView();
  }, [history]);

  return (
    <div 
      style={{ backgroundColor: '#000', color: '#ccc', fontFamily: 'Consolas, monospace', padding: '10px', height: '100%', overflowY: 'auto', cursor: 'text', whiteSpace: 'pre-wrap' }}
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      {history.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      <div style={{ display: 'flex' }}>
        <span>C:\Users\Guest&gt;&nbsp;</span>
        <input 
          ref={inputRef}
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
