import React, { useState, useEffect, useRef } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import { IconPlayerPlay, IconPlayerPause, IconPlayerSkipForward, IconPlayerSkipBack, IconVolume, IconPlaylist } from '@tabler/icons-react';
import YouTube from 'react-youtube';

// Replace these videoIds with the songs you want to preload!
const MOCK_PLAYLIST = [
  { videoId: 'dQw4w9WgXcQ', id: 1, title: 'Placeholder Song 1', artist: 'Rick Astley' },
  { videoId: 'fJ9rUzIMcZQ', id: 2, title: 'Placeholder Song 2', artist: 'Queen' },
  { videoId: '9bZkp7q19f0', id: 3, title: 'Placeholder Song 3', artist: 'PSY' },
];

const Spicetify = () => {
  const globalVolume = useDesktopStore(state => state.globalVolume);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [metadata, setMetadata] = useState(null);
  const [playlistMeta, setPlaylistMeta] = useState({});

  const playerRef = useRef(null);
  const timerRef = useRef(null);

  // Sync global volume to YouTube player
  useEffect(() => {
    if (playerRef.current && playerRef.current.internalPlayer) {
      playerRef.current.internalPlayer.setVolume(globalVolume);
    }
  }, [globalVolume]);

  // Fetch YouTube Metadata (Thumbnail & Title via oEmbed)
  useEffect(() => {
    const track = MOCK_PLAYLIST[currentTrackIndex];
    
    // Default metadata before fetch finishes
    setMetadata({
      title: track.title,
      artist: track.artist,
      cover: `https://img.youtube.com/vi/${track.videoId}/hqdefault.jpg`
    });

    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${track.videoId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          // Attempt to split title by '-' if it follows "Artist - Song" format
          const parts = data.title.split('-');
          const artist = parts.length > 1 ? parts[0].trim() : data.author_name;
          const title = parts.length > 1 ? parts[1].trim() : data.title;
          
          setMetadata({
            title: title,
            artist: artist,
            cover: `https://img.youtube.com/vi/${track.videoId}/hqdefault.jpg`
          });
          
          setPlaylistMeta(prev => ({
            ...prev,
            [track.id]: { title, artist }
          }));
        }
      })
      .catch(console.error);

  }, [currentTrackIndex]);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    event.target.setVolume(globalVolume);
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const onPlayerStateChange = (event) => {
    // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
    if (event.data === 1) {
      setIsPlaying(true);
      setDuration(event.target.getDuration());
      
      // Start tracking time
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(async () => {
        const time = await event.target.getCurrentTime();
        setProgress(time);
      }, 1000);
      
    } else if (event.data === 2) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else if (event.data === 0) {
      nextTrack();
    }
  };

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MOCK_PLAYLIST.length);
    setIsPlaying(true); // Auto-play next track
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + MOCK_PLAYLIST.length) % MOCK_PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    setProgress(time);
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#222326', color: '#b3b3b3', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      
      {/* Headless YouTube Player */}
      <div style={{ display: 'none' }}>
        <YouTube 
          videoId={MOCK_PLAYLIST[currentTrackIndex].videoId} 
          opts={{ playerVars: { autoplay: isPlaying ? 1 : 0, controls: 0, disablekb: 1 } }}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
      </div>

      {/* Main Split */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Sidebar */}
        <div style={{ width: '220px', backgroundColor: '#121314', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', fontWeight: 'bold', color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#1db954', fontSize: '24px' }}>●</span> Spicetify
          </div>
          
          <div style={{ padding: '10px 20px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa' }}>Your Music</div>
          <div style={{ padding: '8px 20px', cursor: 'pointer', borderLeft: '3px solid #1db954', color: '#fff', backgroundColor: '#282828' }}>YouTube Stream</div>
          <div style={{ padding: '8px 20px', cursor: 'pointer' }}>Starred</div>
          
          <div style={{ padding: '15px 20px 10px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa' }}>Playlists</div>
          <div style={{ padding: '8px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconPlaylist size={16} /> 2010s Throwbacks
          </div>
          
          <div style={{ flex: 1 }}></div>
          
          {/* Now Playing Art */}
          <div style={{ borderTop: '1px solid #282828' }}>
            <img 
              src={metadata?.cover || 'https://via.placeholder.com/220/222222/1DB954?text=Spicetify'} 
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
              <h1 style={{ color: '#fff', fontSize: '48px', margin: '5px 0', fontWeight: '800', letterSpacing: '-1px' }}>YouTube Stream</h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#ddd' }}>Provide YouTube IDs in Spicetify.jsx to stream natively!</p>
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
                </tr>
              </thead>
              <tbody>
                {MOCK_PLAYLIST.map((track, i) => {
                  const meta = playlistMeta[track.id] || { title: track.title, artist: track.artist };
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
                      <td>{meta.title}</td>
                      <td style={{ color: isCurrent ? '#1db954' : '#b3b3b3' }}>{meta.artist}</td>
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

export default Spicetify;
