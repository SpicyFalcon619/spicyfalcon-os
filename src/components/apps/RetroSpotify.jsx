import React, { useState } from 'react';
import { IconPlayerPlayFilled, IconPlayerPauseFilled, IconPlayerSkipForwardFilled, IconPlayerSkipBackFilled, IconMusic } from '@tabler/icons-react';

const RetroSpotify = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);

  const playlist = [
    { title: "Baby", artist: "Justin Bieber", duration: "3:34" },
    { title: "Call Me Maybe", artist: "Carly Rae Jepsen", duration: "3:13" },
    { title: "Dynamite", artist: "Taio Cruz", duration: "3:23" },
    { title: "Fireflies", artist: "Owl City", duration: "3:48" },
    { title: "Tik Tok", artist: "Kesha", duration: "3:19" },
    { title: "Party Rock Anthem", artist: "LMFAO", duration: "4:22" }
  ];

  const handlePlay = (index) => {
    setCurrentSong(index);
    setIsPlaying(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#121212', color: '#b3b3b3' }}>
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid #282828', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <IconMusic size={40} color="#1db954" />
        <div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '24px' }}>2010s Nostalgia</h2>
          <div style={{ fontSize: '13px', marginTop: '5px' }}>Fidget spinners and good vibes.</div>
        </div>
      </div>
      
      {/* Playlist */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px' }}>
        {playlist.map((song, i) => (
          <div 
            key={i} 
            onClick={() => handlePlay(i)}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '10px 15px', 
              cursor: 'pointer',
              borderRadius: '4px',
              backgroundColor: currentSong === i ? '#282828' : 'transparent',
              color: currentSong === i ? '#1db954' : '#fff'
            }}
            onMouseOver={(e) => { if(currentSong !== i) e.currentTarget.style.backgroundColor = '#1a1a1a' }}
            onMouseOut={(e) => { if(currentSong !== i) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ width: '20px', fontSize: '13px', color: currentSong === i ? '#1db954' : '#b3b3b3' }}>
                {currentSong === i && isPlaying ? '▶' : i + 1}
              </span>
              <div>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{song.title}</div>
                <div style={{ fontSize: '12px', color: '#b3b3b3', marginTop: '4px' }}>{song.artist}</div>
              </div>
            </div>
            <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
              {song.duration}
            </div>
          </div>
        ))}
      </div>
      
      {/* Controls */}
      <div style={{ height: '90px', backgroundColor: '#181818', borderTop: '1px solid #282828', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '30%' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#282828', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
            <IconMusic size={20} color="#b3b3b3" />
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{playlist[currentSong].title}</div>
            <div style={{ fontSize: '12px' }}>{playlist[currentSong].artist}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <IconPlayerSkipBackFilled size={20} style={{ cursor: 'pointer', color: '#b3b3b3' }} onClick={() => setCurrentSong(prev => (prev > 0 ? prev - 1 : playlist.length - 1))} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#b3b3b3'} />
          
          <div 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff', color: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
          >
            {isPlaying ? <IconPlayerPauseFilled size={18} /> : <IconPlayerPlayFilled size={18} />}
          </div>
          
          <IconPlayerSkipForwardFilled size={20} style={{ cursor: 'pointer', color: '#b3b3b3' }} onClick={() => setCurrentSong(prev => (prev < playlist.length - 1 ? prev + 1 : 0))} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#b3b3b3'} />
        </div>
        
        <div style={{ width: '30%' }}></div>
      </div>
    </div>
  );
};

export default RetroSpotify;
