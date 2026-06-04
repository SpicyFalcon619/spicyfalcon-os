import React, { useEffect, useRef, useState } from 'react';
import useWindowStore from '../../store/useWindowStore';
import useConfigStore from '../../store/useConfigStore';
import { motion, AnimatePresence } from 'framer-motion';

const MatrixScreensaver = () => {
  const showMatrix = useWindowStore(state => state.showMatrix);
  const hideMatrix = useWindowStore(state => state.hideMatrix);
  const openWindow = useWindowStore(state => state.openWindow);
  const updateWindowTitle = useWindowStore(state => state.updateWindowTitle);
  const username = useConfigStore(state => state.username);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (showMatrix) {
      setIsVisible(true);
      setIsFadingOut(false);
    }
  }, [showMatrix]);

  useEffect(() => {
    if (!isVisible || isFadingOut) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 20;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the y coordinate of each column
    const drops = Array(columns).fill(1);

    // Characters: Katakana (0x30A0 - 0x30FF) and digits
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=~[]{}|;:,.<>/?';
    const katakana = String.fromCharCode(...Array.from({ length: 96 }, (_, i) => 0x30A0 + i));
    const alphabet = chars + katakana;

    const draw = () => {
      // Fade effect for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px Consolas, "Courier New", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        
        // Trail color
        ctx.fillStyle = '#00AA20'; 
        ctx.fillText(text, i * fontSize, drops[i] * fontSize - fontSize);

        // Leading character color
        ctx.fillStyle = '#00FF41'; 
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Variable speed by incrementing occasionally
        if (Math.random() > 0.1) {
          drops[i]++;
        }
      }
      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, isFadingOut]);

  useEffect(() => {
    if (!isVisible || isFadingOut) return;

    const handleExit = () => {
      setIsFadingOut(true);
      
      // Stop animation
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      
      setTimeout(() => {
        setIsVisible(false);
        hideMatrix();

        // 300ms after hide, open Notepad
        setTimeout(() => {
          const notepadId = `notepad-matrix-${Date.now()}`;
          openWindow({
            id: notepadId,
            title: 'message.txt',
            icon: '/assets/icons/notepad.png',
            component: 'notepad',
            width: 450,
            height: 300,
            appData: {
              initialContent: `Wake up, ${username}...\n\nThe Matrix has you.\n\nFollow the white rabbit.`
            }
          });

          // 3000ms later, update title
          setTimeout(() => {
            updateWindowTitle(notepadId, "You have been unplugged.");
          }, 3000);
        }, 300);
      }, 800); // 800ms fade out
    };

    window.addEventListener('keydown', handleExit);
    window.addEventListener('mousedown', handleExit);

    return () => {
      window.removeEventListener('keydown', handleExit);
      window.removeEventListener('mousedown', handleExit);
    };
  }, [isVisible, isFadingOut, hideMatrix, openWindow, updateWindowTitle, username]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.canvas
          ref={canvasRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isFadingOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isFadingOut ? 0.8 : 0.5 }}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99998, // Below BSOD (99999)
            backgroundColor: '#000',
            cursor: 'none'
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default MatrixScreensaver;
