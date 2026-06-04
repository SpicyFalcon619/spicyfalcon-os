import React, { useState, useEffect, useRef, useCallback } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import {
  IconSearch, IconClock,
  IconPlayerPlayFilled, IconPlayerPauseFilled,
  IconPlayerSkipBackFilled, IconPlayerSkipForwardFilled,
  IconArrowsShuffle, IconRepeat, IconVolume, IconMusic, IconList,
} from '@tabler/icons-react';

const fmtMs = (ms) => {
  if (!ms || isNaN(ms) || ms < 0) return '0:00';
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const Spicetify = () => {
  const globalVolume = useDesktopStore(s => s.globalVolume);
  const setGlobalVolume = useDesktopStore(s => s.setGlobalVolume);

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [idx, setIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [posMs, setPosMs] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [search, setSearch] = useState('');

  const audioRef = useRef(new Audio());

  useEffect(() => {
    // Initial fetch
    let mounted = true;

    const init = async () => {
      try {
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
        const playlistId = import.meta.env.VITE_SPOTIFY_PLAYLIST_ID;

        if (!clientId || !clientSecret || !playlistId) {
          throw new Error('Spotify credentials missing in .env (VITE_SPOTIFY_CLIENT_ID, VITE_SPOTIFY_CLIENT_SECRET, VITE_SPOTIFY_PLAYLIST_ID)');
        }

        // Get token
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

        // Fetch playlist
        const plRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!plRes.ok) throw new Error('Failed to fetch playlist');
        const plData = await plRes.json();

        const parsedTracks = plData.tracks.items
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

        if (mounted) {
          setTracks(parsedTracks);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
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

  const playTrack = useCallback((index) => {
    const t = tracksRef.current[index];
    if (!t) return;

    if (!t.previewUrl) {
      setTimeout(() => {
        const nextIdx = shuffleRef.current
          ? Math.floor(Math.random() * tracksRef.current.length)
          : (idxRef.current + 1) % tracksRef.current.length;
        setIdx(nextIdx);
        playTrack(nextIdx);
      }, 500);
      return;
    }

    setIdx(index);
    setPosMs(0);
    audioRef.current.src = t.previewUrl;
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

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

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
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
    if (!audio.src) {
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
  const previewDurationMs = 30000;
  const progressPct = Math.min((posMs / previewDurationMs) * 100, 100) || 0;

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      backgroundColor: '#121212', color: '#b3b3b3',
      fontFamily: '"Circular","Helvetica Neue",Helvetica,Arial,sans-serif',
      userSelect: 'none', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: 210, backgroundColor: '#000', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '18px 18px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="24" height="24" viewBox="0 0 496 512" fill="#1DB954">
              <path d="M248 8C111.1 8 8 111.1 8 248s103.1 240 240 240 240-103.1 240-240S384.9 8 248 8zm92.8 326.4c-4.7 7.6-14.8 9.9-22.4 5.2-61.3-37.5-138.5-46-229.5-25.2-8.7 2-17.4-3.3-19.4-12.1-2-8.7 3.3-17.4 12.1-19.4 99.5-22.7 184.9-13.1 253.9 29.3 7.6 4.7 9.9 14.8 5.3 22.2zm24.8-58.2c-5.9 9.5-18.5 12.5-28 6.6-70.1-43.1-176.9-55.6-259.8-30.4-10.9 3.3-22.4-2.9-25.7-13.8-3.3-10.9 2.9-22.4 13.8-25.7 94.8-28.8 212.6-14.8 292.6 34.7 9.5 5.9 12.5 18.5 6.6 28.1l.5.5zm2.1-60.6c-84.1-50-222.9-54.6-303.1-30.2-12.9 3.9-26.6-3.4-30.5-16.3-3.9-12.9 3.4-26.6 16.3-30.5 92-27.9 244.9-22.5 341.5 34.9 11.6 6.9 15.4 21.7 8.5 33.3-6.9 11.6-21.7 15.4-33.3 8.5l.6.3z"/>
            </svg>
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
          <div style={{ background: 'linear-gradient(180deg,rgba(29,185,84,0.35) 0%,transparent 100%)', padding: '18px 18px 10px', flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#b3b3b3', marginBottom: 2 }}>Playlist</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>Spicetify Beats</div>
            <div style={{ fontSize: 11, color: '#b3b3b3', marginTop: 2 }}>{tracks.length} songs</div>
            <div style={{ marginTop: 10, position: 'relative' }}>
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
              return (
                <div key={t.id} onDoubleClick={() => { if (hasPreview) playTrack(ri); }}
                  style={{ display: 'flex', alignItems: 'center', padding: '4px 18px', backgroundColor: cur ? 'rgba(29,185,84,0.1)' : 'transparent', cursor: hasPreview ? 'pointer' : 'default', borderRadius: 3, margin: '1px 5px', transition: 'background 0.1s' }}
                  onMouseEnter={e => { if (!cur && hasPreview) e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = cur ? 'rgba(29,185,84,0.1)' : 'transparent'; }}
                >
                  <div style={{ width: 34, display: 'flex', justifyContent: 'center', color: cur ? '#1DB954' : '#b3b3b3', flexShrink: 0, fontSize: 11 }}>
                    {cur && isPlaying ? <IconPlayerPlayFilled size={11} color="#1DB954" /> : (ri + 1)}
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
              <input type="range" min={0} max={previewDurationMs} value={posMs}
                onChange={handleSeek}
                style={{ position: 'absolute', inset: '-8px 0', width: '100%', opacity: 0, cursor: 'pointer', height: 20 }}
              />
            </div>
            <span style={{ fontSize: 10, color: '#b3b3b3', width: 34, flexShrink: 0 }}>0:30</span>
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
  );
};

export default Spicetify;
