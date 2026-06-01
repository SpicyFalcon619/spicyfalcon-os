import React, { useState, useRef } from 'react';

const MSPaint = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath(); // reset path
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#eef2f5' }}>
      <div style={{ display: 'flex', gap: '10px', padding: '10px', backgroundColor: '#f5f6f7', borderBottom: '1px solid #ccc' }}>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ cursor: 'pointer' }} />
        <input type="range" min="1" max="20" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} />
        <button onClick={() => {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }}>Clear</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
        <canvas 
          ref={canvasRef}
          width={800}
          height={600}
          style={{ backgroundColor: '#fff', border: '1px solid #999', cursor: 'crosshair', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerOut={stopDrawing}
        />
      </div>
    </div>
  );
};

export default MSPaint;
