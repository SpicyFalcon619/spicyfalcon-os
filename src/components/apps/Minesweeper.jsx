import React, { useState, useEffect } from 'react';

const ROWS = 10;
const COLS = 10;
const MINES = 10;

const createBoard = () => {
  let board = Array(ROWS).fill(null).map(() => Array(COLS).fill({ isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 }));
  
  let minesPlaced = 0;
  while(minesPlaced < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].isMine) {
      board[r][c] = { ...board[r][c], isMine: true };
      minesPlaced++;
    }
  }
  
  for(let r=0; r<ROWS; r++) {
    for(let c=0; c<COLS; c++) {
      if(!board[r][c].isMine) {
        let count = 0;
        for(let i=-1; i<=1; i++) {
          for(let j=-1; j<=1; j++) {
            if(r+i >= 0 && r+i < ROWS && c+j >= 0 && c+j < COLS && board[r+i][c+j].isMine) count++;
          }
        }
        board[r][c] = { ...board[r][c], neighborMines: count };
      }
    }
  }
  return board;
};

const Minesweeper = () => {
  const [board, setBoard] = useState(createBoard());
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const revealCell = (r, c) => {
    if (gameOver || win || board[r][c].isRevealed || board[r][c].isFlagged) return;
    
    let newBoard = JSON.parse(JSON.stringify(board));
    
    if (newBoard[r][c].isMine) {
      setGameOver(true);
      newBoard[r][c].isRevealed = true;
      setBoard(newBoard);
      return;
    }

    const floodFill = (row, col) => {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS || newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) return;
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
    setBoard(createBoard());
    setGameOver(false);
    setWin(false);
  };

  return (
    <div style={{ backgroundColor: '#c0c0c0', padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px', border: '2px solid #808080', borderRightColor: '#fff', borderBottomColor: '#fff', padding: '5px', marginBottom: '10px' }}>
        <div style={{ backgroundColor: '#000', color: 'red', fontFamily: 'monospace', fontSize: '24px', padding: '0 5px' }}>{MINES}</div>
        <button onClick={restart} style={{ fontSize: '20px', padding: '0 5px', cursor: 'pointer' }}>{gameOver ? '😵' : win ? '😎' : '🙂'}</button>
        <div style={{ backgroundColor: '#000', color: 'red', fontFamily: 'monospace', fontSize: '24px', padding: '0 5px' }}>000</div>
      </div>
      
      <div style={{ border: '3px solid #808080', borderRightColor: '#fff', borderBottomColor: '#fff', display: 'grid', gridTemplateColumns: `repeat(${COLS}, 25px)` }}>
        {board.map((row, r) => row.map((cell, c) => (
          <div 
            key={`${r}-${c}`}
            onClick={() => revealCell(r, c)}
            onContextMenu={(e) => toggleFlag(e, r, c)}
            style={{
              width: '25px', height: '25px',
              backgroundColor: cell.isRevealed ? '#c0c0c0' : '#c0c0c0',
              border: cell.isRevealed ? '1px solid #808080' : '2px solid #fff',
              borderBottomColor: cell.isRevealed ? '#808080' : '#808080',
              borderRightColor: cell.isRevealed ? '#808080' : '#808080',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
              color: cell.neighborMines === 1 ? 'blue' : cell.neighborMines === 2 ? 'green' : cell.neighborMines === 3 ? 'red' : 'darkblue'
            }}
          >
            {cell.isRevealed ? (cell.isMine ? '💣' : cell.neighborMines > 0 ? cell.neighborMines : '') : (cell.isFlagged ? '🚩' : '')}
          </div>
        )))}
      </div>
    </div>
  );
};

export default Minesweeper;
