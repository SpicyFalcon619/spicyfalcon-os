import React, { useState } from 'react';
import { 
  IconVolume, IconSpeakerphone, IconBug, 
  IconBellRinging, IconConfetti, IconPhoneCall, 
  IconPower, IconMail
} from '@tabler/icons-react';

// --- Synth Engine ---
class SynthEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  resume() {
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  playTone(freq, type, duration, vol, startTime = this.ctx.currentTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playError() {
    this.resume();
    const now = this.ctx.currentTime;
    // Classic error chord (dissonant)
    this.playTone(300, 'sawtooth', 0.5, 0.2, now);
    this.playTone(330, 'sawtooth', 0.5, 0.2, now);
    this.playTone(370, 'sawtooth', 0.5, 0.2, now);
  }

  playStartup() {
    this.resume();
    const now = this.ctx.currentTime;
    // Brian Eno style chord fade in
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major chord
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 1 + (i * 0.2));
      gain.gain.exponentialRampToValueAtTime(0.01, now + 4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 4);
    });
  }

  playShutdown() {
    this.resume();
    const now = this.ctx.currentTime;
    const freqs = [1046.50, 783.99, 659.25, 523.25];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.4);
      osc.frequency.exponentialRampToValueAtTime(f * 0.5, now + i * 0.4 + 1);
      gain.gain.setValueAtTime(0.1, now + i * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.4 + 1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.4);
      osc.stop(now + i * 0.4 + 1);
    });
  }

  playTada() {
    this.resume();
    const now = this.ctx.currentTime;
    this.playTone(440, 'square', 0.2, 0.1, now);
    this.playTone(554.37, 'square', 0.2, 0.1, now + 0.1);
    this.playTone(659.25, 'square', 0.6, 0.1, now + 0.2);
  }

  playNotify() {
    this.resume();
    const now = this.ctx.currentTime;
    this.playTone(880, 'sine', 0.4, 0.2, now);
  }

  playICQ() {
    this.resume();
    const now = this.ctx.currentTime;
    this.playTone(800, 'sine', 0.15, 0.3, now);
    this.playTone(600, 'sine', 0.2, 0.3, now + 0.2);
  }

  playDialup() {
    this.resume();
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 2);
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + 2);

    this.playTone(1200, 'square', 0.5, 0.05, now + 0.5);
    this.playTone(2400, 'square', 0.5, 0.05, now + 1.0);
    this.playTone(1200, 'square', 0.5, 0.05, now + 1.5);
  }

  playAOL() {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance("You've got mail");
      msg.pitch = 1.2;
      msg.rate = 1.0;
      window.speechSynthesis.speak(msg);
    } else {
      this.playNotify();
    }
  }
}

let synth = null;
const getSynth = () => {
  if (!synth) synth = new SynthEngine();
  return synth;
};

const sounds = [
  { id: 'startup', label: 'XP Startup', icon: <IconPower />, play: () => getSynth().playStartup() },
  { id: 'shutdown', label: 'XP Shutdown', icon: <IconPower style={{ transform: 'rotate(180deg)' }} />, play: () => getSynth().playShutdown() },
  { id: 'error', label: 'Error Chord', icon: <IconBug />, play: () => getSynth().playError() },
  { id: 'tada', label: 'Tada!', icon: <IconConfetti />, play: () => getSynth().playTada() },
  { id: 'notify', label: 'Notify Ding', icon: <IconBellRinging />, play: () => getSynth().playNotify() },
  { id: 'icq', label: 'ICQ Uh-Oh', icon: <IconSpeakerphone />, play: () => getSynth().playICQ() },
  { id: 'dialup', label: 'Dial-up Modem', icon: <IconPhoneCall />, play: () => getSynth().playDialup() },
  { id: 'aol', label: "You've Got Mail", icon: <IconMail />, play: () => getSynth().playAOL() }
];

const Soundboard = () => {
  const [activeBtn, setActiveBtn] = useState(null);

  const handlePlay = (sound) => {
    setActiveBtn(sound.id);
    sound.play();
    setTimeout(() => setActiveBtn(null), 150);
  };

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: '#fff', 
      padding: '20px', boxSizing: 'border-box',
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gridAutoRows: 'max-content',
      gap: '15px', overflowY: 'auto'
    }}>
      {sounds.map(sound => (
        <button
          key={sound.id}
          onPointerDown={() => handlePlay(sound)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '15px 10px', gap: '10px',
            backgroundColor: '#f5f6f7',
            border: activeBtn === sound.id 
              ? '2px solid var(--text-secondary)' 
              : '2px outset #eee',
            borderStyle: activeBtn === sound.id ? 'inset' : 'outset',
            borderRadius: '4px', cursor: 'pointer',
            boxShadow: activeBtn === sound.id ? 'none' : '2px 2px 5px rgba(0,0,0,0.1)',
            fontFamily: 'inherit', fontSize: '12px',
            color: 'var(--text-primary)', outline: 'none'
          }}
          aria-label={`Play ${sound.label}`}
        >
          <div style={{ 
            color: 'var(--text-secondary)',
            transform: activeBtn === sound.id ? 'translate(1px, 1px)' : 'none'
          }}>
            {sound.icon}
          </div>
          <span style={{
            transform: activeBtn === sound.id ? 'translate(1px, 1px)' : 'none'
          }}>
            {sound.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Soundboard;
