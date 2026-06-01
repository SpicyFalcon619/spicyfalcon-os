import React, { useState, useEffect, useRef } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import { IconPlayerPlay, IconPlayerPause, IconPlayerSkipForward, IconPlayerSkipBack, IconVolume, IconPlaylist } from '@tabler/icons-react';

const MOCK_PLAYLIST = [
  { file: 'coldplay - viva la vida.mp3', id: 1 },
  { file: 'gotye - somebody that i used to know.mp3', id: 2 },
  { file: 'rihanna - diamonds.mp3', id: 3 },
  { file: 'avicii - levels.mp3', id: 4 },
  { file: 'macklemore - thrift shop.mp3', id: 5 }
];

const Spicefify = () => {
  const globalVolume = useDesktopStore(state => state.globalVolume);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [metadata, setMetadata] = useState(null);
  const [playlistMeta, setPlaylistMeta] = useState({});

  const audioRef = useRef(new Audio());

  useEffect(() => {
    audioRef.current.volume = globalVolume / 100;
  }, [globalVolume]);

  useEffect(() => {
    const track = MOCK_PLAYLIST[currentTrackIndex];
    audioRef.current.src = `/assets/music/${track.file}`;
    
    const searchTerm = track.file.replace('.mp3', '');
    
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          setMetadata({
            title: result.trackName,
            artist: result.artistName,
            album: result.collectionName,
            cover: result.artworkUrl100.replace('100x100', '300x300')
          });
          setPlaylistMeta(prev => ({ ...prev, [track.id]: {
            title: result.trackName,
            artist: result.artistName,
            album: result.collectionName
          }}));
        } else {
          const parts = searchTerm.split('-');
          setMetadata({
            title: parts[1] ? parts[1].trim() : searchTerm,
            artist: parts[0] ? parts[0].trim() : 'Unknown Artist',
            album: 'Local File',
            cover: 'https://via.placeholder.com/300/222222/1DB954?text=Spicefify'
          });
        }
      })
      .catch(() => {
        setMetadata({
          title: searchTerm,
          artist: 'Unknown Artist',
          album: 'Local File',
          cover: 'https://via.placeholder.com/300/222222/1DB954?text=Spicefify'
        });
      });

    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MOCK_PLAYLIST.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + MOCK_PLAYLIST.length) % MOCK_PLAYLIST.length);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#222326', color: '#b3b3b3', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      
      {/* Main Split */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Sidebar */}
        <div style={{ width: '220px', backgroundColor: '#121314', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', fontWeight: 'bold', color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#1db954', fontSize: '24px' }}>●</span> Spicefify
          </div>
          
          <div style={{ padding: '10px 20px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa' }}>Your Music</div>
          <div style={{ padding: '8px 20px', cursor: 'pointer', borderLeft: '3px solid #1db954', color: '#fff', backgroundColor: '#282828' }}>Local Files</div>
          <div style={{ padding: '8px 20px', cursor: 'pointer' }}>Starred</div>
          
          <div style={{ padding: '15px 20px 10px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa' }}>Playlists</div>
          <div style={{ padding: '8px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconPlaylist size={16} /> 2010s Throwbacks
          </div>
          
          <div style={{ flex: 1 }}></div>
          
          {/* Now Playing Art */}
          <div style={{ borderTop: '1px solid #282828' }}>
            <img 
              src={metadata?.cover || 'https://via.placeholder.com/220/222222/1DB954?text=Spicefify'} 
              alt="Album Art" 
              style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} 
            />
          </div>
        </div>

        {/* Tracklist View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#181818' }}>
          
          {/* Header */}
          <div style={{ padding: '30px', background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', backgroundColor: '#444', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Playlist</div>
              <h1 style={{ color: '#fff', fontSize: '48px', margin: '5px 0', fontWeight: '800', letterSpacing: '-1px' }}>Local Files</h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#ddd' }}>Place .mp3s in public/assets/music/ and update MOCK_PLAYLIST in Spicefify.jsx</p>
            </div>
          </div>
          
          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #282828', color: '#aaa', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '8px', width: '40px' }}>#</th>
                  <th style={{ paddingBottom: '8px' }}>TITLE</th>
                  <th style={{ paddingBottom: '8px' }}>ARTIST</th>
                  <th style={{ paddingBottom: '8px' }}>ALBUM</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PLAYLIST.map((track, i) => {
                  const meta = playlistMeta[track.id] || {};
                  const isCurrent = i === currentTrackIndex;
                  return (
                    <tr 
                      key={track.id} 
                      onDoubleClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); }}
                      style={{ 
                        color: isCurrent ? '#1db954' : '#fff',
                        backgroundColor: isCurrent ? '#282828' : 'transparent',
                        cursor: 'pointer',
                        borderBottom: '1px solid #282828',
                        userSelect: 'none'
                      }}
                      onMouseOver={e => !isCurrent && (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                      onMouseOut={e => !isCurrent && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>{isCurrent && isPlaying ? '▶' : i + 1}</td>
                      <td>{meta.title || track.file}</td>
                      <td style={{ color: isCurrent ? '#1db954' : '#b3b3b3' }}>{meta.artist || '...'}</td>
                      <td style={{ color: isCurrent ? '#1db954' : '#b3b3b3' }}>{meta.album || '...'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Control Bar (2012 era) */}
      <div style={{ height: '90px', backgroundColor: '#282828', borderTop: '1px solid #000', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '20px' }}>
        
        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '250px' }}>
          <button onClick={prevTrack} style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer' }}><IconPlayerSkipBack size={20} fill="currentColor" /></button>
          
          <button onClick={togglePlay} style={{ 
            width: '40px', height: '40px', borderRadius: '50%', 
            border: '1px solid #b3b3b3', background: 'none', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            color: '#fff', cursor: 'pointer'
          }}>
            {isPlaying ? <IconPlayerPause size={18} fill="currentColor" /> : <IconPlayerPlay size={18} fill="currentColor" style={{ marginLeft: '3px' }} />}
          </button>
          
          <button onClick={nextTrack} style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer' }}><IconPlayerSkipForward size={20} fill="currentColor" /></button>
        </div>

        {/* Timeline */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ color: '#fff', fontSize: '13px', display: 'flex', width: '100%', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', width: '35px', textAlign: 'right', color: '#b3b3b3' }}>{formatTime(progress)}</span>
            <input 
              type="range" 
              min={0} 
              max={duration || 100} 
              value={progress} 
              onChange={handleSeek}
              style={{ flex: 1, height: '4px', cursor: 'pointer', accentColor: '#1db954' }}
            />
            <span style={{ fontSize: '11px', width: '35px', color: '#b3b3b3' }}>{formatTime(duration)}</span>
          </div>
          <div style={{ fontSize: '13px', color: '#fff', textAlign: 'center', display: 'flex', gap: '5px' }}>
            <span style={{ color: '#fff' }}>{metadata ? metadata.title : 'Loading...'}</span>
            <span style={{ color: '#b3b3b3' }}>—</span>
            <span style={{ color: '#b3b3b3' }}>{metadata ? metadata.artist : '...'}</span>
          </div>
        </div>

        {/* Volume & Extra */}
        <div style={{ width: '250px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
          <IconVolume size={18} color="#b3b3b3" />
          <div style={{ width: '100px', height: '4px', backgroundColor: '#535353', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${globalVolume}%`, height: '100%', backgroundColor: '#1db954' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spicefify;
