import React, { useState, useEffect, useRef, useCallback } from 'react';
import useDesktopStore from '../../store/useDesktopStore';
import { PLAYLIST } from '../../data/playlist';
import {
  IconSearch, IconClock,
  IconPlayerPlayFilled, IconPlayerPauseFilled,
  IconPlayerSkipBackFilled, IconPlayerSkipForwardFilled,
  IconArrowsShuffle, IconRepeat, IconVolume, IconMusic, IconList,
} from '@tabler/icons-react';

const trackId = (uri) => uri.split(':')[2];
const fmtMs = (ms) => {
  if (!ms || isNaN(ms) || ms < 0) return '0:00';
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// ─── Module-level Spotify controller (survives HMR, persists across mounts) ──
let _ctrl = null;      // EmbedController
let _ready = false;    // true once 'ready' event fired
let _listeners = [];   // playback_update subscribers registered from components

function subscribePlayback(fn) {
  _listeners.push(fn);
  return () => { _listeners = _listeners.filter(f => f !== fn); };
}

function notifyListeners(e) {
  _listeners.forEach(fn => { try { fn(e); } catch (_) {} });
}

function initSpotifyAPI(mountTarget, initialUri, onReady) {
  if (_ctrl) {
    // Controller already exists, just call onReady
    onReady(_ctrl);
    return;
  }

  function createController(IFrameAPI) {
    IFrameAPI.createController(
      mountTarget,
      { width: '100%', height: '100%', uri: initialUri },
      (ctrl) => {
        _ctrl = ctrl;
        ctrl.addListener('ready', () => {
          _ready = true;
          onReady(ctrl);
        });
        ctrl.addListener('playback_update', notifyListeners);
      }
    );
  }

  if (window.SpotifyIframeApi) {
    createController(window.SpotifyIframeApi);
  } else {
    const prev = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (api) => {
      if (prev) try { prev(api); } catch (_) {}
      if (!_ctrl) createController(api);
    };
    if (!document.getElementById('sf-spotify-sdk')) {
      const s = document.createElement('script');
      s.id = 'sf-spotify-sdk';
      s.src = 'https://open.spotify.com/embed/iframe-api/v1';
      s.async = true;
      document.head.appendChild(s);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
const Spicetify = () => {
  const globalVolume = useDesktopStore(s => s.globalVolume);
  const setGlobalVolume = useDesktopStore(s => s.setGlobalVolume);

  const [idx, setIdx]           = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [posMs, setPosMs]       = useState(0);
  const [durMs, setDurMs]       = useState(0);
  const [shuffle, setShuffle]   = useState(false);
  const [repeat, setRepeat]     = useState(false);
  const [ready, setReady]       = useState(_ready);
  const [search, setSearch]     = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    const uri = PLAYLIST[idx].uri;
    fetch(`https://open.spotify.com/oembed?url=${uri}`)
      .then(res => res.json())
      .then(data => setThumbnailUrl(data.thumbnail_url))
      .catch(() => setThumbnailUrl(''));
  }, [idx]);

  // Refs so Spotify callbacks always read fresh values without stale closures
  const idxRef     = useRef(idx);
  const shuffleRef = useRef(shuffle);
  const repeatRef  = useRef(repeat);
  const tickRef    = useRef(null);
  const mountRef   = useRef(null);
  const clickTimer = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => { if (!ready) setReady(true); }, 1500);
    return () => clearTimeout(t);
  }, [ready]);

  useEffect(() => { idxRef.current = idx; },     [idx]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { repeatRef.current = repeat; },   [repeat]);

  const stopTick = useCallback(() => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  }, []);

  const startTick = useCallback(() => {
    stopTick();
    tickRef.current = setInterval(() => {
      setPosMs(p => p + 250);
    }, 250);
  }, [stopTick]);

  // ── Navigate to a track ───────────────────────────────────────────────────
  const goToTrack = useCallback((newIdx, play = true) => {
    if (newIdx < 0 || newIdx >= PLAYLIST.length) return;
    setIdx(newIdx);
    idxRef.current = newIdx;
    setPosMs(0);
    setDurMs(0);
    stopTick();
    if (_ctrl && _ready) {
      try {
        _ctrl.loadUri(PLAYLIST[newIdx].uri);
        if (play) setTimeout(() => { try { _ctrl?.play(); } catch (_) {} }, 150);
      } catch (err) {
        console.warn('[Spicetify] loadUri error', err);
      }
    }
  }, [stopTick]);

  // ── Prev / Next ────────────────────────────────────────────────────────────
  const handlePrev = useCallback(() => {
    if (posMs > 3000) {
      setPosMs(0); stopTick();
      try { _ctrl?.seek(0); } catch (_) {}
    } else {
      goToTrack((idxRef.current - 1 + PLAYLIST.length) % PLAYLIST.length, true);
    }
  }, [posMs, goToTrack, stopTick]);

  const handleNext = useCallback(() => {
    const next = shuffleRef.current
      ? Math.floor(Math.random() * PLAYLIST.length)
      : (idxRef.current + 1) % PLAYLIST.length;
    goToTrack(next, true);
  }, [goToTrack]);

  const togglePlay = useCallback(() => {
    if (!_ctrl || !_ready) return;
    try { _ctrl.togglePlay(); } catch (err) {
      console.warn('[Spicetify] togglePlay error', err);
    }
  }, []);

  const handleSeek = useCallback((e) => {
    const ms = Math.max(0, Number(e.target.value));
    setPosMs(ms);
    try { _ctrl?.seek(ms / 1000); } catch (_) {}
  }, []);

  // ── Spotify API init + playback listener ──────────────────────────────────
  useEffect(() => {
    if (!mountRef.current) return;

    // Subscribe to playback updates
    const unsub = subscribePlayback((e) => {
      try {
        const st = e?.data;
        if (!st) return;
        const playing = !st.isPaused;
        setIsPlaying(playing);
        setPosMs(typeof st.position === 'number' ? st.position : 0);
        setDurMs(typeof st.duration === 'number' ? st.duration : 0);
        if (playing) startTick(); else stopTick();
        // Auto-advance
        if (st.position >= st.duration - 500 && st.duration > 0) {
          stopTick();
          const nextIdx = shuffleRef.current
            ? Math.floor(Math.random() * PLAYLIST.length)
            : (idxRef.current + 1) % PLAYLIST.length;
          setTimeout(() => goToTrack(nextIdx, !repeatRef.current), 200);
        }
      } catch (err) {
        console.warn('[Spicetify] playback_update handler error', err);
      }
    });

    // Mount the iframe if not yet done
    const mountTarget = document.createElement('div');
    mountRef.current.appendChild(mountTarget);

    initSpotifyAPI(mountTarget, PLAYLIST[0].uri, (ctrl) => {
      setReady(true);
      try { ctrl.setVolume(globalVolume / 100); } catch (_) {}
    });

    return () => {
      unsub();
      stopTick();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync volume to controller
  useEffect(() => {
    if (_ctrl && _ready) {
      try { _ctrl.setVolume(globalVolume / 100); } catch (_) {}
    }
  }, [globalVolume]);

  const track      = PLAYLIST[idx] || PLAYLIST[0];
  const progressPct = durMs ? Math.min((posMs / durMs) * 100, 100) : 0;

  const filtered = search
    ? PLAYLIST.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.artist.toLowerCase().includes(search.toLowerCase())
      )
    : PLAYLIST;

  // Single vs double click debounce
  const handleTrackClick = (realIdx) => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      goToTrack(realIdx, true); // double-click → play
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
        goToTrack(realIdx, false); // single-click → select, no autoplay
      }, 220);
    }
  };

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      backgroundColor: '#121212', color: '#b3b3b3',
      fontFamily: '"Circular","Helvetica Neue",Helvetica,Arial,sans-serif',
      userSelect: 'none', overflow: 'hidden',
    }}>
      {/* Hidden Spotify mount — kept in DOM permanently */}
      <div ref={mountRef} style={{
        position: 'absolute', left: '-9999px', top: '-9999px',
        width: '300px', height: '380px', opacity: 0.01, pointerEvents: 'none',
        zIndex: -1,
      }} />

      {/* ── MAIN LAYOUT ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR ── */}
        <div style={{ width: 210, backgroundColor: '#000', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Logo */}
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

          {/* Playlist info */}
          <div style={{ padding: '4px 18px 2px', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#b3b3b3' }}>Your Playlist</div>
          <div style={{ padding: '2px 18px 2px', fontSize: 12, color: '#fff', fontWeight: 600 }}>HEHEHEHE</div>
          <div style={{ padding: '0 18px 10px', fontSize: 11, color: '#b3b3b3' }}>{PLAYLIST.length} songs</div>

          <div style={{ flex: 1 }} />

          {/* Mini now-playing */}
          <div style={{ padding: 10, borderTop: '1px solid #282828' }}>
            <div style={{ backgroundColor: '#181818', borderRadius: 6, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: 3, backgroundColor: '#282828', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconMusic size={16} color="#b3b3b3" />
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</div>
                <div style={{ fontSize: 10, color: '#b3b3b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.artist}</div>
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
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#121212' }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(180deg,rgba(29,185,84,0.35) 0%,transparent 100%)', padding: '18px 18px 10px', flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#b3b3b3', marginBottom: 2 }}>Playlist</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>HEHEHEHE</div>
            <div style={{ fontSize: 11, color: '#b3b3b3', marginTop: 2 }}>SpicyFalcon619 • {PLAYLIST.length} songs</div>
            {/* Search */}
            <div style={{ marginTop: 10, position: 'relative' }}>
              <IconSearch size={13} color="#b3b3b3" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input type="text" placeholder="Filter songs..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '6px 10px 6px 28px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Column headers */}
          <div style={{ display: 'flex', padding: '5px 18px', borderBottom: '1px solid #282828', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#b3b3b3', flexShrink: 0 }}>
            <div style={{ width: 34, textAlign: 'center' }}>#</div>
            <div style={{ flex: 2, paddingLeft: 6 }}>Title</div>
            <div style={{ flex: 1 }}>Album</div>
            <div style={{ width: 46, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}><IconClock size={12} color="#b3b3b3" /></div>
          </div>

          {/* Track list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map((t) => {
              const ri = PLAYLIST.indexOf(t);
              const cur = ri === idx;
              return (
                <div key={t.id} onClick={() => handleTrackClick(ri)}
                  style={{ display: 'flex', alignItems: 'center', padding: '4px 18px', backgroundColor: cur ? 'rgba(29,185,84,0.1)' : 'transparent', cursor: 'default', borderRadius: 3, margin: '1px 5px', transition: 'background 0.1s' }}
                  onMouseEnter={e => { if (!cur) e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = cur ? 'rgba(29,185,84,0.1)' : 'transparent'; }}
                >
                  <div style={{ width: 34, display: 'flex', justifyContent: 'center', color: cur ? '#1DB954' : '#b3b3b3', flexShrink: 0, fontSize: 11 }}>
                    {cur && isPlaying ? <IconPlayerPlayFilled size={11} color="#1DB954" /> : (PLAYLIST.indexOf(t) + 1)}
                  </div>
                  <div style={{ flex: 2, overflow: 'hidden', paddingLeft: 5 }}>
                    <div style={{ fontSize: 12, color: cur ? '#1DB954' : '#fff', fontWeight: cur ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                    <div style={{ fontSize: 10, color: '#b3b3b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.artist}</div>
                  </div>
                  <div style={{ flex: 1, fontSize: 11, color: '#b3b3b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{t.album}</div>
                  <div style={{ width: 46, textAlign: 'right', fontSize: 11, color: '#b3b3b3', flexShrink: 0 }}>{fmtMs(t.duration)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ height: 84, backgroundColor: '#181818', borderTop: '1px solid #282828', display: 'flex', alignItems: 'center', padding: '0 12px', flexShrink: 0, gap: 0 }}>

        {/* Track info */}
        <div style={{ width: '28%', display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt="Album Art" style={{ width: 48, height: 48, borderRadius: 3, objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: 3, backgroundColor: '#282828', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconMusic size={22} color="#b3b3b3" />
            </div>
          )}
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: 12, color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</div>
            <div style={{ fontSize: 11, color: '#b3b3b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.artist}</div>
          </div>
        </div>

        {/* Controls + seek */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          {/* Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button onClick={() => setShuffle(s => !s)} style={{ background: 'none', border: 'none', color: shuffle ? '#1DB954' : '#b3b3b3', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <IconArrowsShuffle size={17} stroke={2} />
            </button>
            <button onClick={handlePrev} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <IconPlayerSkipBackFilled size={17} color="#fff" />
            </button>
            <button onClick={togglePlay} style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: ready ? '#fff' : '#444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: ready ? 'pointer' : 'default', flexShrink: 0 }}>
              {isPlaying
                ? <IconPlayerPauseFilled size={15} color="#000" />
                : <IconPlayerPlayFilled size={15} color={ready ? '#000' : '#888'} />}
            </button>
            <button onClick={handleNext} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <IconPlayerSkipForwardFilled size={17} color="#fff" />
            </button>
            <button onClick={() => setRepeat(r => !r)} style={{ background: 'none', border: 'none', color: repeat ? '#1DB954' : '#b3b3b3', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <IconRepeat size={17} stroke={2} />
            </button>
          </div>

          {/* Seek bar */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 10, color: '#b3b3b3', width: 34, textAlign: 'right', flexShrink: 0 }}>{fmtMs(posMs)}</span>
            <div style={{ flex: 1, position: 'relative', height: 4 }}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: '#535353', borderRadius: 2 }} />
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progressPct}%`, backgroundColor: '#1DB954', borderRadius: 2 }} />
              <input type="range" min={0} max={durMs || track.duration || 1} value={Math.min(posMs, durMs || track.duration || 1)}
                onChange={handleSeek}
                style={{ position: 'absolute', inset: '-8px 0', width: '100%', opacity: 0, cursor: 'pointer', height: 20 }}
              />
            </div>
            <span style={{ fontSize: 10, color: '#b3b3b3', width: 34, flexShrink: 0 }}>{fmtMs(durMs || track.duration)}</span>
          </div>
        </div>

        {/* Volume */}
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

      {/* Keyframes as a static style element */}
      <style>{`
        @keyframes sfEq1 { from{height:3px} to{height:13px} }
        @keyframes sfEq2 { from{height:7px} to{height:15px} }
        @keyframes sfEq3 { from{height:2px} to{height:11px} }
      `}</style>
    </div>
  );
};

export default Spicetify;
