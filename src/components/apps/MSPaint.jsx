import React, { useState, useRef, useEffect } from 'react';

const MSPaint = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush'); // brush, eraser, bucket

  useEffect(() => {
    // Fill canvas with white initially so it's not transparent when saving
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const hexToRgba = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  };

  const floodFill = (ctx, startX, startY, fillColor) => {
    const canvas = ctx.canvas;
    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const startPos = (startY * w + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];

    const matchStartColor = (pos) => {
      return data[pos] === startR && data[pos + 1] === startG && data[pos + 2] === startB && data[pos + 3] === startA;
    };

    const colorPixel = (pos, color) => {
      data[pos] = color[0];
      data[pos + 1] = color[1];
      data[pos + 2] = color[2];
      data[pos + 3] = color[3];
    };

    const fillRgba = hexToRgba(fillColor);
    
    if (startR === fillRgba[0] && startG === fillRgba[1] && startB === fillRgba[2] && startA === fillRgba[3]) {
      return; // Same color, do nothing
    }

    const stack = [[startX, startY]];
    
    while(stack.length) {
      const [x, y] = stack.pop();
      let currentY = y;
      let pos = (currentY * w + x) * 4;
      
      // Go up as long as color matches
      while(currentY >= 0 && matchStartColor(pos)) {
        currentY--;
        pos -= w * 4;
      }
      currentY++;
      pos += w * 4;

      let reachLeft = false;
      let reachRight = false;
      
      while(currentY < h && matchStartColor(pos)) {
        colorPixel(pos, fillRgba);
        
        if (x > 0) {
          if (matchStartColor(pos - 4)) {
            if (!reachLeft) {
              stack.push([x - 1, currentY]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }
        
        if (x < w - 1) {
          if (matchStartColor(pos + 4)) {
            if (!reachRight) {
              stack.push([x + 1, currentY]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }
        
        currentY++;
        pos += w * 4;
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    if (tool === 'bucket') {
      floodFill(ctx, x, y, color);
      return;
    }

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
    if (!isDrawing || tool === 'bucket') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    
    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
    } else {
      ctx.strokeStyle = color;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'untitled.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const toolBtnStyle = (isActive) => ({
    padding: '4px 8px',
    backgroundColor: isActive ? '#dce3ea' : 'transparent',
    border: isActive ? '1px solid #abadb3' : '1px solid transparent',
    borderRadius: '3px',
    cursor: 'pointer',
    fontFamily: 'Tahoma, sans-serif',
    fontSize: '12px',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#eef2f5' }}>
      <div style={{ display: 'flex', gap: '10px', padding: '10px', backgroundColor: '#f5f6f7', borderBottom: '1px solid #ccc', alignItems: 'center' }}>
        <button style={toolBtnStyle(tool === 'brush')} onClick={() => setTool('brush')}>Brush</button>
        <button style={toolBtnStyle(tool === 'eraser')} onClick={() => setTool('eraser')}>Eraser</button>
        <button style={toolBtnStyle(tool === 'bucket')} onClick={() => setTool('bucket')}>Fill Bucket</button>
        <div style={{ width: '1px', height: '20px', backgroundColor: '#ccc', margin: '0 5px' }} />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ cursor: 'pointer' }} />
        <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} />
        <div style={{ width: '1px', height: '20px', backgroundColor: '#ccc', margin: '0 5px' }} />
        <button onClick={() => {
          const ctx = canvasRef.current.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }} style={toolBtnStyle(false)}>Clear</button>
        <button onClick={handleDownload} style={toolBtnStyle(false)}>Save</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '10px', backgroundColor: '#c0c0c0' }}>
        <canvas 
          ref={canvasRef}
          width={800}
          height={600}
          style={{ backgroundColor: '#fff', cursor: tool === 'bucket' ? 'crosshair' : 'default', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)' }}
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
