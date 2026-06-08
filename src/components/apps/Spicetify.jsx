import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import useDesktopStore from '../../store/useDesktopStore';
import useWindowStore from '../../store/useWindowStore';
import {
  IconSearch, IconClock,
  IconPlayerPlayFilled, IconPlayerPauseFilled,
  IconPlayerSkipBackFilled, IconPlayerSkipForwardFilled,
  IconArrowsShuffle, IconRepeat, IconVolume, IconMusic, IconList,
} from '@tabler/icons-react';
import fallbackPlaylist from '../../data/playlist.json';

const fmtMs = (ms) => {
  if (!ms || isNaN(ms) || ms < 0) return '0:00';
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const Spicetify = ({ windowData }) => {
  const globalVolume = useDesktopStore(s => s.globalVolume);
  const setGlobalVolume = useDesktopStore(s => s.setGlobalVolume);
  const updateWindowSize = useWindowStore(s => s.updateWindowSize);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tracks, setTracks] = useState([]);
  
  const [idx, setIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [posMs, setPosMs] = useState(0);
  const [durationMs, setDurationMs] = useState(30000);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [search, setSearch] = useState('');
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const audioRef = useRef(null);



  useEffect(() => {
    // Initial fetch
    let mounted = true;

    const init = async () => {
      try {
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
        const playlistId = import.meta.env.VITE_SPOTIFY_PLAYLIST_ID;

        let parsedTracks = [];

        try {
          if (!clientId || !clientSecret || !playlistId) {
            throw new Error('Spotify credentials missing.');
          }

          const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`
            },
            body: 'grant_type=client_credentials'
          });
          
          if (!tokenRes.ok) throw new Error('Failed to fetch Spotify token');
          const tokenData = await tokenRes.json();
          const token = tokenData.access_token;

          const plRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (!plRes.ok) {
            const errText = await plRes.text();
            throw new Error(`Spotify API rejected request: ${errText.substring(0, 50)}...`);
          }
          
          const plData = await plRes.json();
          parsedTracks = plData.tracks.items
            .filter(item => item.track)
            .map(item => ({
              id: item.track.id,
              title: item.track.name,
              artist: item.track.artists.map(a => a.name).join(', '),
              album: item.track.album.name,
              albumArt: item.track.album.images[0]?.url ?? null,
              previewUrl: item.track.preview_url,
              duration: item.track.duration_ms,
              spotifyUrl: item.track.external_urls.spotify
            }));

        } catch (err) {
          console.warn('Using user-extracted fallback playlist due to Spotify API error:', err.message);
          parsedTracks = fallbackPlaylist;
        }

        if (mounted) {
          setTracks(parsedTracks);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('A critical error occurred loading the player.');
          setLoading(false);
        }
      }
    };

    init();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = globalVolume / 100;
    }
  }, [globalVolume]);

  const idxRef = useRef(idx);
  const shuffleRef = useRef(shuffle);
  const repeatRef = useRef(repeat);
  const tracksRef = useRef(tracks);

  useEffect(() => { idxRef.current = idx; }, [idx]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { repeatRef.current = repeat; }, [repeat]);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  const updateMediaSession = useCallback((t) => {
    if ('mediaSession' in navigator && t) {
      const artUrl = t.albumArt || new URL('/assets/icons/spicetify.png', window.location.origin).href;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: t.title || 'Unknown Title',
        artist: t.artist || 'Unknown Artist',
        album: t.album || 'SpicyFalcon OS',
        artwork: [{ src: artUrl, sizes: '512x512' }]
      });
    }
  }, []);

  const playTrack = useCallback(function pt(index) {
    const t = tracksRef.current[index];
    if (!t) return;

    if (!t.previewUrl) {
      setTimeout(() => {
        const nextIdx = shuffleRef.current
          ? Math.floor(Math.random() * tracksRef.current.length)
          : (idxRef.current + 1) % tracksRef.current.length;
        setIdx(nextIdx);
        pt(nextIdx);
      }, 500);
      return;
    }

    setIdx(index);
    setPosMs(0);
    audioRef.current.src = t.previewUrl;
    
    updateMediaSession(t);

    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [updateMediaSession]);

  const goToNext = useCallback(() => {
    if (tracksRef.current.length === 0) return;
    const nextIdx = shuffleRef.current
      ? Math.floor(Math.random() * tracksRef.current.length)
      : (idxRef.current + 1) % tracksRef.current.length;
    setIdx(nextIdx);
    playTrack(nextIdx);
  }, [playTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => setPosMs(audio.currentTime * 1000);
    const handleEnded = () => {
      if (repeatRef.current) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        goToNext();
      }
    };
    
    const handleLoadedMetadata = () => {
      if (audio.duration && audio.duration !== Infinity && !isNaN(audio.duration)) {
        setDurationMs(audio.duration * 1000);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.pause();
      audio.src = '';
    };
  }, [goToNext]);

  const goToPrev = useCallback(() => {
    if (tracksRef.current.length === 0) return;
    if (posMs > 3000) {
      audioRef.current.currentTime = 0;
      setPosMs(0);
    } else {
      const prevIdx = (idxRef.current - 1 + tracksRef.current.length) % tracksRef.current.length;
      setIdx(prevIdx);
      playTrack(prevIdx);
    }
  }, [posMs, playTrack]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio.src || audio.src === window.location.href || !audio.src.includes('/audio/')) {
      if (tracks.length > 0) playTrack(idx);
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isPlaying, tracks, idx, playTrack]);

  const handleSeek = useCallback((e) => {
    const ms = Number(e.target.value);
    setPosMs(ms);
    audioRef.current.currentTime = ms / 1000;
  }, []);

  const filtered = search
    ? tracks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.artist.toLowerCase().includes(search.toLowerCase())
      )
    : tracks;

  const currentTrack = tracks[idx];
  const activeDurationMs = currentTrack?.duration && currentTrack?.previewUrl?.includes('spotdown') === false ? currentTrack.duration : durationMs;
  const progressPct = Math.min((posMs / activeDurationMs) * 100, 100) || 0;

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true));
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (audioRef.current) { audioRef.current.pause(); setIsPlaying(false); }
      });
      navigator.mediaSession.setActionHandler('previoustrack', goToPrev);
      navigator.mediaSession.setActionHandler('nexttrack', goToNext);
    }
  }, [goToPrev, goToNext]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  useEffect(() => {
    if ('mediaSession' in navigator && navigator.mediaSession.setPositionState) {
      if (activeDurationMs > 0 && posMs >= 0 && posMs <= activeDurationMs) {
        try {
          navigator.mediaSession.setPositionState({
            duration: activeDurationMs / 1000,
            playbackRate: 1,
            position: posMs / 1000
          });
        } catch (e) {}
      }
    }
  }, [posMs, activeDurationMs]);

  return (
    <>
      <audio ref={audioRef} controls style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0.01 }} />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#121212', color: '#fff' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'sfSpin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a10 10 0 0 1 10 10"></path>
            </svg>
            <div style={{ fontSize: 13, fontFamily: '"Circular", sans-serif' }}>Loading Playlist...</div>
            <style>{`@keyframes sfSpin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      ) : error ? (
        <div style={{ padding: '20px', backgroundColor: '#e8edf2', height: '100%', color: '#000', display: 'flex', flexDirection: 'column', fontFamily: '"Tahoma", sans-serif' }}>
          <div style={{ border: '1px solid #0055ea', backgroundColor: '#fff', padding: '15px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ 
              width: 32, height: 32, borderRadius: '50%', backgroundColor: '#cc0000', 
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: 'bold', fontSize: 20, flexShrink: 0
            }}>×</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: '8px' }}>Spotify API Error</div>
              <div style={{ fontSize: 12 }}>{error}</div>
              <div style={{ fontSize: 11, color: '#666', marginTop: '10px' }}>Make sure your .env file is properly configured with your Spotify credentials.</div>
            </div>
          </div>
        </div>
      ) : windowData?.isMinimized && currentTrack ? (
        createPortal(
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{
              position: 'fixed',
              bottom: 60,
              right: 20,
              width: 320,
              backgroundColor: '#181818',
              color: '#fff',
              borderRadius: 8,
              boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
              overflow: 'hidden',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              cursor: 'grab',
              userSelect: 'none'
            }}
            whileDrag={{ cursor: 'grabbing' }}
          >
            <div style={{ display: 'flex', padding: 12, alignItems: 'center' }}>
              {currentTrack.albumArt ? (
                <img src={currentTrack.albumArt} style={{ width: 56, height: 56, borderRadius: 4, objectFit: 'cover', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.5)', pointerEvents: 'none' }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: 4, backgroundColor: '#282828', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconMusic size={24} color="#b3b3b3"/></div>
              )}
              
              <div style={{ flex: 1, padding: '0 14px', overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTrack.title}</div>
                <div style={{ fontSize: 11, color: '#b3b3b3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{currentTrack.artist}</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
                   <button onClick={(e) => { e.stopPropagation(); playTrack(idx === 0 ? tracks.length - 1 : idx - 1); }} style={{ background: 'none', border: 'none', color: '#b3b3b3', padding: 0, cursor: 'pointer', display: 'flex' }}><IconPlayerSkipBackFilled size={16}/></button>
                   <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} style={{ background: '#fff', border: 'none', color: '#000', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      {isPlaying ? <IconPlayerPauseFilled size={14}/> : <IconPlayerPlayFilled size={14}/>}
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); goToNext(); }} style={{ background: 'none', border: 'none', color: '#b3b3b3', padding: 0, cursor: 'pointer', display: 'flex' }}><IconPlayerSkipForwardFilled size={16}/></button>
                </div>
              </div>
            </div>

            {/* Mini Player Progress Bar */}
            <div style={{ position: 'relative', height: 4, width: '100%', backgroundColor: '#535353' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progressPct}%`, backgroundColor: '#1DB954' }} />
              <input type="range" min={0} max={activeDurationMs} value={posMs}
                onChange={(e) => { e.stopPropagation(); handleSeek(e); }}
                style={{ position: 'absolute', inset: '-8px 0', width: '100%', opacity: 0, cursor: 'pointer', height: 20 }}
              />
            </div>
          </motion.div>,
          document.body
        )
      ) : (
        <div style={{
          display: 'flex', flexDirection: 'column', height: '100%',
          backgroundColor: '#121212', color: '#b3b3b3',
          fontFamily: '"Circular","Helvetica Neue",Helvetica,Arial,sans-serif',
          userSelect: 'none', overflow: 'hidden', position: 'relative'
        }}>
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: 210, backgroundColor: '#000', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '18px 18px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/assets/icons/spicetify.png" width="24" height="24" alt="Spicetify" />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Spicetify</span>
          </div>

          <div style={{ padding: '6px 18px 4px', display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 13, fontWeight: 600 }}>
            <IconList size={16} stroke={2} /> Playlist
          </div>
          <div style={{ borderTop: '1px solid #282828', margin: '6px 0' }} />

          <div style={{ padding: '4px 18px 2px', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#b3b3b3' }}>Your Playlist</div>
          <div style={{ padding: '0 18px 10px', fontSize: 11, color: '#b3b3b3' }}>{tracks.length} songs</div>

          <div style={{ flex: 1 }} />

          {currentTrack && (
            <div style={{ padding: 10, borderTop: '1px solid #282828' }}>
              <div style={{ backgroundColor: '#181818', borderRadius: 6, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                {currentTrack.albumArt ? (
                  <img src={currentTrack.albumArt} style={{ width: 34, height: 34, borderRadius: 3, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 34, height: 34, borderRadius: 3, backgroundColor: '#282828', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconMusic size={16} color="#b3b3b3" />
                  </div>
                )}
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTrack.title}</div>
                  <div style={{ fontSize: 10, color: '#b3b3b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTrack.artist}</div>
                </div>
                {isPlaying && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14, flexShrink: 0 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ width: 3, borderRadius: 1, backgroundColor: '#1DB954',
                        animationName: `sfEq${i}`, animationDuration: '0.7s',
                        animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite',
                        animationDirection: 'alternate', animationDelay: `${i * 0.13}s`,
                      }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#121212' }}>
          <div style={{ background: 'linear-gradient(180deg,rgba(29,185,84,0.35) 0%,transparent 100%)', padding: '18px', flexShrink: 0, display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
            <div style={{ width: 140, height: 140, backgroundColor: '#282828', boxShadow: '0 4px 24px rgba(0,0,0,0.5)', flexShrink: 0, borderRadius: 4, overflow: 'hidden' }}>
              <img src="https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84935f08c6ac87172230f4730b" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Playlist Cover" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#fff', marginBottom: 6 }}>Playlist</div>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 12, letterSpacing: '-1px' }}>HEHEHE</div>
              <div style={{ fontSize: 12, color: '#b3b3b3', marginTop: 2 }}>{tracks.length} songs, perfectly curated for SpicyFalcon OS</div>
            </div>
          </div>
          <div style={{ padding: '0 18px' }}>
            <div style={{ marginTop: 16, position: 'relative' }}>
              <IconSearch size={13} color="#b3b3b3" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input type="text" placeholder="Filter songs..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '6px 10px 6px 28px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', padding: '5px 18px', borderBottom: '1px solid #282828', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#b3b3b3', flexShrink: 0 }}>
            <div style={{ width: 34, textAlign: 'center' }}>#</div>
            <div style={{ flex: 2, paddingLeft: 6 }}>Title</div>
            <div style={{ flex: 1 }}>Album</div>
            <div style={{ width: 46, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}><IconClock size={12} color="#b3b3b3" /></div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }} className="spicetify-scrollbar">
            {filtered.map((t) => {
              const ri = tracks.indexOf(t);
              const cur = ri === idx;
              const hasPreview = !!t.previewUrl;
              const isHovered = hoveredIdx === ri;
              
              let rowIcon = (ri + 1);
              if (isHovered && hasPreview) {
                rowIcon = cur && isPlaying ? <IconPlayerPauseFilled size={11} color="#fff" /> : <IconPlayerPlayFilled size={11} color="#fff" />;
              } else if (cur && isPlaying) {
                rowIcon = (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 12 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ width: 2, borderRadius: 1, backgroundColor: '#1DB954',
                        animationName: `sfEq${i}`, animationDuration: '0.7s',
                        animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite',
                        animationDirection: 'alternate', animationDelay: `${i * 0.13}s`,
                      }} />
                    ))}
                  </div>
                );
              } else if (cur) {
                rowIcon = <span style={{ color: '#1DB954' }}>{ri + 1}</span>;
              }

              return (
                <div key={t.id} onDoubleClick={() => { if (hasPreview) playTrack(ri); }}
                  style={{ display: 'flex', alignItems: 'center', padding: '4px 18px', backgroundColor: cur ? 'rgba(29,185,84,0.1)' : (isHovered && hasPreview ? '#2a2a2a' : 'transparent'), cursor: hasPreview ? 'pointer' : 'default', borderRadius: 3, margin: '1px 5px', transition: 'background 0.1s' }}
                  onMouseEnter={() => setHoveredIdx(ri)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => { if (hasPreview && isHovered) { if (cur) togglePlay(); else playTrack(ri); } }}
                >
                  <div style={{ width: 34, display: 'flex', justifyContent: 'center', color: cur ? '#1DB954' : '#b3b3b3', flexShrink: 0, fontSize: 11 }}>
                    {rowIcon}
                  </div>
                  <div style={{ flex: 2, overflow: 'hidden', paddingLeft: 5 }}>
                    <div style={{ fontSize: 12, color: hasPreview ? (cur ? '#1DB954' : '#fff') : '#555', fontWeight: cur ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.title} {!hasPreview && <span style={{ fontSize: 10, color: '#666', fontWeight: 'normal', marginLeft: 6 }}>[No Preview]</span>}
                    </div>
                    <div style={{ fontSize: 10, color: hasPreview ? '#b3b3b3' : '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.artist}</div>
                  </div>
                  <div style={{ flex: 1, fontSize: 11, color: hasPreview ? '#b3b3b3' : '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{t.album}</div>
                  <div style={{ width: 46, textAlign: 'right', fontSize: 11, color: hasPreview ? '#b3b3b3' : '#555', flexShrink: 0 }}>{fmtMs(t.duration)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ height: 84, backgroundColor: '#181818', borderTop: '1px solid #282828', display: 'flex', alignItems: 'center', padding: '0 12px', flexShrink: 0, gap: 0 }}>
        <div style={{ width: '28%', display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
          {currentTrack?.albumArt ? (
            <img src={currentTrack.albumArt} alt="Album Art" style={{ width: 48, height: 48, borderRadius: 3, objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: 3, backgroundColor: '#282828', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconMusic size={22} color="#b3b3b3" />
            </div>
          )}
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: 12, color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTrack?.title}</div>
            <div style={{ fontSize: 11, color: '#b3b3b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTrack?.artist}</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button onClick={() => setShuffle(s => !s)} style={{ background: 'none', border: 'none', color: shuffle ? '#1DB954' : '#b3b3b3', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <IconArrowsShuffle size={17} stroke={2} />
            </button>
            <button onClick={goToPrev} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <IconPlayerSkipBackFilled size={17} color="#fff" />
            </button>
            <button onClick={togglePlay} style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              {isPlaying
                ? <IconPlayerPauseFilled size={15} color="#000" />
                : <IconPlayerPlayFilled size={15} color="#000" />}
            </button>
            <button onClick={goToNext} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <IconPlayerSkipForwardFilled size={17} color="#fff" />
            </button>
            <button onClick={() => setRepeat(r => !r)} style={{ background: 'none', border: 'none', color: repeat ? '#1DB954' : '#b3b3b3', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <IconRepeat size={17} stroke={2} />
            </button>
          </div>

          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 10, color: '#b3b3b3', width: 34, textAlign: 'right', flexShrink: 0 }}>{fmtMs(posMs)}</span>
            <div style={{ flex: 1, position: 'relative', height: 4 }}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: '#535353', borderRadius: 2 }} />
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progressPct}%`, backgroundColor: '#1DB954', borderRadius: 2 }} />
              <input type="range" min={0} max={activeDurationMs} value={posMs}
                onChange={handleSeek}
                style={{ position: 'absolute', inset: '-8px 0', width: '100%', opacity: 0, cursor: 'pointer', height: 20 }}
              />
            </div>
            <span style={{ fontSize: 10, color: '#b3b3b3', width: 34, flexShrink: 0 }}>{fmtMs(activeDurationMs)}</span>
          </div>
        </div>

        <div style={{ width: '28%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          <IconVolume size={16} color="#b3b3b3" />
          <div style={{ width: 86, position: 'relative', height: 4 }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#535353', borderRadius: 2 }} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${globalVolume}%`, backgroundColor: '#b3b3b3', borderRadius: 2 }} />
            <input type="range" min={0} max={100} value={globalVolume}
              onChange={e => setGlobalVolume(Number(e.target.value))}
              style={{ position: 'absolute', inset: '-8px 0', width: '100%', opacity: 0, cursor: 'pointer', height: 20 }}
            />
          </div>
          <span style={{ fontSize: 10, color: '#b3b3b3', width: 26 }}>{globalVolume}%</span>
        </div>
      </div>

      <style>{`
        @keyframes sfEq1 { from{height:3px} to{height:13px} }
        @keyframes sfEq2 { from{height:7px} to{height:15px} }
        @keyframes sfEq3 { from{height:2px} to{height:11px} }
        .spicetify-scrollbar::-webkit-scrollbar { width: 8px; }
        .spicetify-scrollbar::-webkit-scrollbar-track { background: #121212; }
        .spicetify-scrollbar::-webkit-scrollbar-thumb { background: #535353; border-radius: 4px; }
        .spicetify-scrollbar::-webkit-scrollbar-thumb:hover { background: #b3b3b3; }
      `}</style>
    </div>
  )}
  </>
  );
};

export default Spicetify;
