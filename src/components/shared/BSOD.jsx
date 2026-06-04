import React, { useEffect, useState } from 'react';
import useWindowStore from '../../store/useWindowStore';
import { motion, AnimatePresence } from 'framer-motion';

const BSOD = () => {
  const showBSOD = useWindowStore(state => state.showBSOD);
  const hideBSOD = useWindowStore(state => state.hideBSOD);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showBSOD) setIsVisible(true);
  }, [showBSOD]);

  useEffect(() => {
    if (!isVisible) return;

    const handleInput = () => {
      setIsVisible(false);
      setTimeout(() => hideBSOD(), 500); // Wait for fade out
    };

    window.addEventListener('keydown', handleInput);
    window.addEventListener('mousedown', handleInput);

    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('mousedown', handleInput);
    };
  }, [isVisible, hideBSOD]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: '#0000AA',
            color: '#FFFFFF',
            fontFamily: 'Tahoma, "Lucida Console", monospace',
            padding: '10vh 10vw',
            zIndex: 99999,
            cursor: 'none',
            userSelect: 'none'
          }}
        >
          <p style={{ margin: 0, padding: 0, fontSize: '18px' }}>
            A problem has been detected and Windows has been shut down to prevent damage to your computer.
          </p>

          <p style={{ marginTop: '20px', fontSize: '18px' }}>
            The problem seems to be caused by the following file: SPICYFALCON.SYS
          </p>

          <p style={{ marginTop: '20px', fontSize: '18px' }}>
            PAGE_FAULT_IN_NONPAGED_AREA
          </p>

          <p style={{ marginTop: '20px', fontSize: '18px' }}>
            If this is the first time you've seen this Stop error screen,<br />
            restart your computer. If this screen appears again, follow<br />
            these steps:
          </p>

          <p style={{ marginTop: '20px', fontSize: '18px' }}>
            Check to make sure any new hardware or software is properly installed.<br />
            If this is a new installation, ask your hardware or software manufacturer<br />
            for any Windows updates you might need.
          </p>

          <p style={{ marginTop: '20px', fontSize: '18px' }}>
            If problems continue, disable or remove any newly installed hardware<br />
            or software. Disable BIOS memory options such as caching or shadowing.<br />
            If you need to use Safe Mode to remove or disable components, restart<br />
            your computer, press F8 to select Advanced Startup Options, and then<br />
            select Safe Mode.
          </p>

          <p style={{ marginTop: '30px', fontSize: '18px' }}>
            Technical information:
          </p>

          <p style={{ marginTop: '10px', fontSize: '18px' }}>
            *** STOP: 0x00000050 (0x0000SPCY, 0x00000000, 0xSP1CYF4LC0N, 0x00000000)
          </p>

          <p style={{ marginTop: '30px', fontSize: '18px' }}>
            *** SPICYFALCON.SYS - Address 0xSP1CYF4LC0N base at 0xSP1CYF4LC0N, DateStamp 60a4f8d2
          </p>

          <p style={{ marginTop: '50px', fontSize: '18px', animation: 'blink 1.5s infinite' }}>
            Press any key to restart your portfolio...
          </p>
          
          <style>{`
            @keyframes blink {
              0% { opacity: 1; }
              50% { opacity: 0; }
              100% { opacity: 1; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BSOD;
