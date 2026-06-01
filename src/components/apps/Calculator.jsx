import React, { useState } from 'react';
import { evaluate } from 'mathjs';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleInput = (val) => {
    if (display === '0') setDisplay(val);
    else setDisplay(prev => prev + val);
  };

  const handleOp = (op) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const result = evaluate(equation + display);
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
      setEquation('');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const btnStyle = { padding: '15px', fontSize: '18px', cursor: 'pointer', border: '1px solid #ccc', background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)', borderRadius: '4px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#e9eef4', padding: '10px' }}>
      <div style={{ textAlign: 'right', color: '#666', height: '20px', fontSize: '14px' }}>{equation}</div>
      <div style={{ textAlign: 'right', fontSize: '32px', padding: '10px', backgroundColor: '#fff', border: '1px solid #999', marginBottom: '10px', overflowX: 'hidden' }}>{display}</div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', flex: 1 }}>
        <button style={btnStyle} onClick={clear}>C</button>
        <button style={btnStyle} onClick={() => handleInput('(')}>(</button>
        <button style={btnStyle} onClick={() => handleInput(')')}>)</button>
        <button style={btnStyle} onClick={() => handleOp('/')}>/</button>
        
        <button style={btnStyle} onClick={() => handleInput('7')}>7</button>
        <button style={btnStyle} onClick={() => handleInput('8')}>8</button>
        <button style={btnStyle} onClick={() => handleInput('9')}>9</button>
        <button style={btnStyle} onClick={() => handleOp('*')}>*</button>
        
        <button style={btnStyle} onClick={() => handleInput('4')}>4</button>
        <button style={btnStyle} onClick={() => handleInput('5')}>5</button>
        <button style={btnStyle} onClick={() => handleInput('6')}>6</button>
        <button style={btnStyle} onClick={() => handleOp('-')}>-</button>
        
        <button style={btnStyle} onClick={() => handleInput('1')}>1</button>
        <button style={btnStyle} onClick={() => handleInput('2')}>2</button>
        <button style={btnStyle} onClick={() => handleInput('3')}>3</button>
        <button style={btnStyle} onClick={() => handleOp('+')}>+</button>
        
        <button style={btnStyle} onClick={() => handleInput('0')}>0</button>
        <button style={btnStyle} onClick={() => handleInput('.')}>.</button>
        <button style={btnStyle} onClick={() => setDisplay(prev => String(parseFloat(prev) * -1))}>±</button>
        <button style={btnStyle} onClick={calculate}>=</button>
      </div>
    </div>
  );
};

export default Calculator;
