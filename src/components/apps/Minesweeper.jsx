import React, { useState, useEffect } from 'react';

const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10, label: 'Beginner' },
  intermediate: { rows: 16, cols: 16, mines: 40, label: 'Intermediate' },
  expert: { rows: 16, cols: 30, mines: 99, label: 'Expert' }
};

const IconBomb = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11.5" cy="11.5" r="5.5" fill="#000" />
    <path d="M11.5 6V3" />
    <path d="M15.4 7.6l2.1-2.1" />
    <path d="M7.6 7.6L5.5 5.5" />
    <path d="M17 11.5h3" />
    <path d="M4 11.5H1" />
    <path d="M15.4 15.4l2.1 2.1" />
    <path d="M7.6 15.4l-2.1 2.1" />
    <path d="M11.5 17v3" />
  </svg>
);

const IconFlag = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="red" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" stroke="#000" />
  </svg>
);

const IconFace = ({ status }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffcc00" stroke="#000" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      {status === 'dead' ? (
        <>
          <path d="M9 10l-2-2m0 2l2-2" strokeLinecap="round" />
          <path d="M17 10l-2-2m0 2l2-2" strokeLinecap="round" />
          <path d="M9 16c1.5-1 4.5-1 6 0" strokeLinecap="round" />
        </>
      ) : status === 'win' ? (
        <>
          <path d="M7 10h10v2a5 5 0 0 1-10 0z" fill="#000" />
          <circle cx="9" cy="9" r="1.5" fill="#000" stroke="none" />
          <circle cx="15" cy="9" r="1.5" fill="#000" stroke="none" />
        </>
      ) : (
        <>
          <circle cx="9" cy="9" r="1.5" fill="#000" stroke="none" />
          <circle cx="15" cy="9" r="1.5" fill="#000" stroke="none" />
          <path d="M8 15a4 4 0 0 0 8 0" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
};

const createBoard = (rows, cols, mines) => {
  let board = Array(rows).fill(null).map(() => Array(cols).fill({ isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 }));
  
  let minesPlaced = 0;
  while(minesPlaced < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].isMine) {
      board[r][c] = { ...board[r][c], isMine: true };
      minesPlaced++;
    }
  }
  
  for(let r=0; r<rows; r++) {
    for(let c=0; c<cols; c++) {
      if(!board[r][c].isMine) {
        let count = 0;
        for(let i=-1; i<=1; i++) {
          for(let j=-1; j<=1; j++) {
            if(r+i >= 0 && r+i < rows && c+j >= 0 && c+j < cols && board[r+i][c+j].isMine) count++;
          }
        }
        board[r][c] = { ...board[r][c], neighborMines: count };
      }
    }
  }
  return board;
};

const Minesweeper = () => {
  const [difficulty, setDifficulty] = useState('beginner');
  const conf = DIFFICULTIES[difficulty];
  const [board, setBoard] = useState(createBoard(conf.rows, conf.cols, conf.mines));
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let t;
    if (timerRunning && !gameOver && !win) {
      t = setInterval(() => setTime(prev => prev < 999 ? prev + 1 : prev), 1000);
    }
    return () => clearInterval(t);
  }, [timerRunning, gameOver, win]);

  const handleDifficultyChange = (e) => {
    const newDiff = e.target.value;
    setDifficulty(newDiff);
    const newConf = DIFFICULTIES[newDiff];
    setBoard(createBoard(newConf.rows, newConf.cols, newConf.mines));
    setGameOver(false);
    setWin(false);
    setTime(0);
    setTimerRunning(false);
  };

  const revealCell = (r, c) => {
    if (gameOver || win || board[r][c].isRevealed || board[r][c].isFlagged) return;
    if (!timerRunning) setTimerRunning(true);
    
    let newBoard = JSON.parse(JSON.stringify(board));
    
    if (newBoard[r][c].isMine) {
      setGameOver(true);
      newBoard[r][c].isRevealed = true;
      setBoard(newBoard);
      return;
    }

    const floodFill = (row, col) => {
      if (row < 0 || row >= conf.rows || col < 0 || col >= conf.cols || newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) return;
      newBoard[row][col].isRevealed = true;
      if (newBoard[row][col].neighborMines === 0) {
        for(let i=-1; i<=1; i++) {
          for(let j=-1; j<=1; j++) {
            floodFill(row+i, col+j);
          }
        }
      }
    };

    floodFill(r, c);
    setBoard(newBoard);
    checkWin(newBoard);
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameOver || win || board[r][c].isRevealed) return;
    if (!timerRunning) setTimerRunning(true);
    
    let newBoard = JSON.parse(JSON.stringify(board));
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
  };

  const checkWin = (b) => {
    let unrevealedSafe = 0;
    b.forEach(row => row.forEach(cell => {
      if (!cell.isMine && !cell.isRevealed) unrevealedSafe++;
    }));
    if (unrevealedSafe === 0) setWin(true);
  };

  const restart = () => {
    setBoard(createBoard(conf.rows, conf.cols, conf.mines));
    setGameOver(false);
    setWin(false);
    setTime(0);
    setTimerRunning(false);
  };

  const flagCount = board.flat().filter(c => c.isFlagged).length;
  const minesLeft = conf.mines - flagCount;

  return (
    <div style={{ backgroundColor: '#c0c0c0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Menu Bar */}
      <div style={{ padding: '2px 5px', borderBottom: '1px solid #808080', backgroundColor: '#eef2f5', display: 'flex', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '12px', fontFamily: 'Tahoma' }}>Difficulty:</span>
          <select value={difficulty} onChange={handleDifficultyChange} style={{ fontSize: '11px', fontFamily: 'Tahoma', padding: '1px' }}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'auto', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: `${conf.cols * 25}px`, border: '2px solid #808080', borderRightColor: '#fff', borderBottomColor: '#fff', padding: '5px', marginBottom: '10px', backgroundColor: '#c0c0c0' }}>
          <div style={{ backgroundColor: '#000', color: 'red', fontFamily: 'monospace', fontSize: '24px', padding: '0 5px', width: '45px', textAlign: 'right' }}>
            {minesLeft.toString().padStart(3, '0')}
          </div>
          <button onClick={restart} style={{ padding: '0px 3px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', borderRightColor: '#808080', borderBottomColor: '#808080', backgroundColor: '#c0c0c0' }}>
            <IconFace status={gameOver ? 'dead' : win ? 'win' : 'normal'} />
          </button>
          <div style={{ backgroundColor: '#000', color: 'red', fontFamily: 'monospace', fontSize: '24px', padding: '0 5px', width: '45px', textAlign: 'right' }}>
            {time.toString().padStart(3, '0')}
          </div>
        </div>
        
        <div style={{ border: '3px solid #808080', borderRightColor: '#fff', borderBottomColor: '#fff', display: 'grid', gridTemplateColumns: `repeat(${conf.cols}, 25px)`, gridTemplateRows: `repeat(${conf.rows}, 25px)`, userSelect: 'none' }}>
          {board.map((row, r) => row.map((cell, c) => (
            <div 
              key={`${r}-${c}`}
              onMouseUp={(e) => {
                if (e.button === 0) revealCell(r, c);
                else if (e.button === 2) toggleFlag(e, r, c);
              }}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                width: '25px', height: '25px',
                backgroundColor: '#c0c0c0',
                border: cell.isRevealed ? '1px solid #808080' : '2px solid #fff',
                borderBottomColor: cell.isRevealed ? '#808080' : '#808080',
                borderRightColor: cell.isRevealed ? '#808080' : '#808080',
                borderTopColor: cell.isRevealed ? '#808080' : '#fff',
                borderLeftColor: cell.isRevealed ? '#808080' : '#fff',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontWeight: 'bold', fontSize: '14px', cursor: 'default',
                color: cell.neighborMines === 1 ? 'blue' : cell.neighborMines === 2 ? 'green' : cell.neighborMines === 3 ? 'red' : cell.neighborMines === 4 ? 'darkblue' : cell.neighborMines === 5 ? 'darkred' : cell.neighborMines === 6 ? 'teal' : cell.neighborMines === 7 ? 'black' : 'gray'
              }}
            >
              {cell.isRevealed ? (cell.isMine ? <IconBomb /> : cell.neighborMines > 0 ? cell.neighborMines : '') : (cell.isFlagged ? <IconFlag /> : '')}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;
