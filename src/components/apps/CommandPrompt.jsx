import React, { useState, useRef, useEffect } from 'react';
import useWindowStore from '../../store/useWindowStore';

const VFS = {
  'C:\\Users\\Guest': ['Desktop', 'Documents', 'Downloads', 'Pictures', 'secret.txt'],
  'C:\\Users\\Guest\\Desktop': ['portfolio.exe', 'wastopia.lnk'],
  'C:\\Users\\Guest\\Documents': ['resume.pdf', 'notes.txt'],
  'C:\\Users\\Guest\\Downloads': [],
  'C:\\Users\\Guest\\Pictures': [],
};

const SnakeGame = ({ onGameOver, isFocused }) => {
  const canvasRef = useRef(null);
  
  // Game state refs
  const scoreRef = useRef(0);
  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const dirRef = useRef({ x: 1, y: 0 });
  const nextDirRef = useRef({ x: 1, y: 0 }); // to prevent multiple keystrokes reversing snake
  const foodRef = useRef({ x: 15, y: 10 });
  const gameoverRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cols = canvas.width / 20;
    const rows = canvas.height / 20;

    const spawnFood = () => {
      let f;
      while (true) {
        f = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
        if (!snakeRef.current.some(s => s.x === f.x && s.y === f.y)) break;
      }
      foodRef.current = f;
    };

    const interval = setInterval(() => {
      if (gameoverRef.current) return;
      dirRef.current = nextDirRef.current;
      const head = snakeRef.current[0];
      const dir = dirRef.current;
      const nx = head.x + dir.x;
      const ny = head.y + dir.y;

      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows || snakeRef.current.some(s => s.x === nx && s.y === ny)) {
        gameoverRef.current = true;
        onGameOver(scoreRef.current);
        return;
      }

      const newHead = { x: nx, y: ny };
      const newSnake = [newHead, ...snakeRef.current];

      if (nx === foodRef.current.x && ny === foodRef.current.y) {
        scoreRef.current += 10;
        spawnFood();
      } else {
        newSnake.pop();
      }
      snakeRef.current = newSnake;

      // Draw
      ctx.fillStyle = '#0C0C0C';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#FF6B35';
      ctx.fillRect(foodRef.current.x * 20, foodRef.current.y * 20, 20, 20);

      ctx.fillStyle = '#00FF41';
      newSnake.forEach(s => {
        ctx.fillRect(s.x * 20, s.y * 20, 20, 20);
      });
      
      // Score
      ctx.fillStyle = '#00FF41';
      ctx.font = '16px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`SCORE: ${scoreRef.current}`, canvas.width - 10, 20);

    }, 150);

    return () => clearInterval(interval);
  }, [onGameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFocused) return;
      
      const dir = dirRef.current;
      if ((e.key === 'w' || e.key === 'ArrowUp' || e.key === 'W') && dir.y === 0) {
        nextDirRef.current = { x: 0, y: -1 };
        e.preventDefault();
      } else if ((e.key === 's' || e.key === 'ArrowDown' || e.key === 'S') && dir.y === 0) {
        nextDirRef.current = { x: 0, y: 1 };
        e.preventDefault();
      } else if ((e.key === 'a' || e.key === 'ArrowLeft' || e.key === 'A') && dir.x === 0) {
        nextDirRef.current = { x: -1, y: 0 };
        e.preventDefault();
      } else if ((e.key === 'd' || e.key === 'ArrowRight' || e.key === 'D') && dir.x === 0) {
        nextDirRef.current = { x: 1, y: 0 };
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <canvas ref={canvasRef} width={400} height={280} style={{ display: 'block', backgroundColor: '#0C0C0C' }} />
    </div>
  );
};

const CommandPrompt = ({ windowData }) => {
  const [history, setHistory] = useState([
    'Microsoft Windows [Version 6.1.7601]',
    'Copyright (c) 2009 Microsoft Corporation. All rights reserved.',
    '',
    'Type "help" to see available commands.',
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('C:\\Users\\Guest');
  const [textColor, setTextColor] = useState('#ccc');
  
  const [snakeMode, setSnakeMode] = useState(false);

  const activeWindowId = useWindowStore(s => s.activeWindowId);
  const isFocused = activeWindowId === windowData?.id;
  
  const triggerBSOD = useWindowStore(s => s.triggerBSOD);
  const triggerMatrix = useWindowStore(s => s.triggerMatrix);
  
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      let response = '';

      const args = cmd.split(' ').filter(Boolean);
      const command = args[0]?.toLowerCase();

      if (command === 'help') {
        response = 'Commands: help, clear, whoami, date, echo [msg], dir/ls, cd [dir], color [hex], matrix, snake, format c:';
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
        if (triggerMatrix) triggerMatrix();
        setInput('');
        return;
      } else if (command === 'format' && args[1]?.toLowerCase() === 'c:') {
        if (triggerBSOD) triggerBSOD();
        setInput('');
        return;
      } else if (command === 'snake') {
        setSnakeMode(true);
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
    if (endRef.current && !snakeMode) endRef.current.scrollIntoView();
  }, [history, snakeMode]);

  const handleGameOver = (finalScore) => {
    setSnakeMode(false);
    setHistory(prev => [...prev, `${cwd}> snake`, `GAME OVER - Final Score: ${finalScore}`, '']);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  };

  if (snakeMode) {
    return <SnakeGame onGameOver={handleGameOver} isFocused={isFocused} />;
  }

  return (
    <div 
      style={{ backgroundColor: '#000', color: textColor, fontFamily: 'Consolas, monospace', padding: '10px', height: '100%', overflowY: 'auto', cursor: 'text', whiteSpace: 'pre-wrap' }}
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      {history.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
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
      <div ref={endRef} />
    </div>
  );
};

export default CommandPrompt;
