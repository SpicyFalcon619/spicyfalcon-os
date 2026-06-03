import React, { useState, useRef, useEffect } from 'react';

const VFS = {
  'C:\\Users\\Guest': ['Desktop', 'Documents', 'Downloads', 'Pictures', 'secret.txt'],
  'C:\\Users\\Guest\\Desktop': ['portfolio.exe', 'wastopia.lnk'],
  'C:\\Users\\Guest\\Documents': ['resume.pdf', 'notes.txt'],
  'C:\\Users\\Guest\\Downloads': [],
  'C:\\Users\\Guest\\Pictures': [],
};

const CommandPrompt = () => {
  const [history, setHistory] = useState([
    'Microsoft Windows [Version 6.1.7601]',
    'Copyright (c) 2009 Microsoft Corporation. All rights reserved.',
    '',
    'Type "help" to see available commands.',
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('C:\\Users\\Guest');
  const [textColor, setTextColor] = useState('#ccc');
  const [matrixMode, setMatrixMode] = useState(false);
  
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let interval;
    if (matrixMode) {
      interval = setInterval(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
        let line = '';
        for(let i=0; i<60; i++) {
          line += chars.charAt(Math.floor(Math.random() * chars.length)) + ' ';
        }
        setHistory(prev => [...prev.slice(-40), line]);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [matrixMode]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !matrixMode) {
      const cmd = input.trim();
      let response = '';

      const args = cmd.split(' ').filter(Boolean);
      const command = args[0]?.toLowerCase();

      if (command === 'help') {
        response = 'Commands: help, clear, whoami, date, echo [msg], dir/ls, cd [dir], color [hex], matrix';
      } else if (command === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (command === 'whoami') {
        response = 'SpicyFalcon\\Guest\nPrivilege Level: Administrator';
      } else if (command === 'date') {
        response = new Date().toString();
      } else if (command === 'dir' || command === 'ls') {
        const contents = VFS[cwd];
        if (contents) {
          let dirList = ` Volume in drive C is SpicyFalcon OS\n Directory of ${cwd}\n\n`;
          dirList += `06/03/2026  10:00 AM    <DIR>          .\n`;
          dirList += `06/03/2026  10:00 AM    <DIR>          ..\n`;
          contents.forEach(item => {
            const isFile = item.includes('.');
            dirList += `06/03/2026  10:00 AM    ${isFile ? '     ' : '<DIR>'}          ${item}\n`;
          });
          response = dirList;
        } else {
          response = `Directory of ${cwd}\n\nFile Not Found`;
        }
      } else if (command === 'cd') {
        const target = args[1];
        if (!target) {
          response = cwd;
        } else if (target === '..') {
          if (cwd !== 'C:\\Users\\Guest') {
            const parts = cwd.split('\\');
            parts.pop();
            setCwd(parts.join('\\'));
          }
        } else {
          const newPath = `${cwd}\\${target}`;
          // Case insensitive search
          const exists = VFS[cwd]?.find(f => f.toLowerCase() === target.toLowerCase());
          if (exists && !exists.includes('.')) {
            setCwd(`${cwd}\\${exists}`);
          } else {
            response = 'The system cannot find the path specified.';
          }
        }
      } else if (command === 'color') {
        if (args[1]) {
          setTextColor(args[1]);
          response = `Color changed to ${args[1]}`;
        } else {
          setTextColor('#ccc');
        }
      } else if (command === 'matrix') {
        setTextColor('#0f0');
        setMatrixMode(true);
        setTimeout(() => {
          setMatrixMode(false);
          setHistory(['Matrix mode deactivated.']);
          setTextColor('#ccc');
        }, 5000);
        setInput('');
        return;
      } else if (command === 'echo') {
        response = args.slice(1).join(' ');
      } else if (command === 'cat' || command === 'type') {
         if (args[1] === 'secret.txt') response = 'You found the secret! But what does it mean?';
         else response = 'The system cannot find the file specified.';
      } else if (cmd !== '') {
        response = `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`;
      }

      setHistory(prev => [...prev, `${cwd}> ${cmd}`, response, '']);
      setInput('');
    }
  };

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView();
  }, [history]);

  return (
    <div 
      style={{ backgroundColor: '#000', color: textColor, fontFamily: 'Consolas, monospace', padding: '10px', height: '100%', overflowY: 'auto', cursor: 'text', whiteSpace: 'pre-wrap' }}
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      {history.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      {!matrixMode && (
        <div style={{ display: 'flex' }}>
          <span>{cwd}&gt;&nbsp;</span>
          <input 
            ref={inputRef}
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ backgroundColor: 'transparent', color: textColor, border: 'none', outline: 'none', fontFamily: 'Consolas, monospace', flex: 1 }}
          />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default CommandPrompt;
