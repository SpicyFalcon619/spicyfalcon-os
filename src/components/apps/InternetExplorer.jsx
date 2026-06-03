import React, { useState, useRef, useEffect } from 'react';

// Sites that are known to block embedding via X-Frame-Options / CSP
// These will be auto-opened in the real browser instead of shown in the iframe
const BLOCKED_HOSTS = [
  'github.com', 'linkedin.com', 'spotify.com', 'open.spotify.com',
  'instagram.com', 'twitter.com', 'x.com', 'facebook.com',
  'google.com', 'youtube.com', 'notion.so', 'notion.site', 
  'figma.com', 'canva.com',
];

const isLikelyBlocked = (url) => {
  if (!url || url === 'about:blank') return false;
  try {
    const host = new URL(url).hostname;
    return BLOCKED_HOSTS.some(b => host === b || host.endsWith('.' + b));
  } catch {
    return false;
  }
};

const NavBtn = ({ children, onClick, disabled, title }) => (
  <button onClick={onClick} disabled={disabled} title={title} style={{
    minWidth: 26, height: 26, background: disabled ? 'transparent' : '#e8edf2',
    border: '1px solid', borderColor: disabled ? 'transparent' : '#abadb3',
    borderRadius: 3, cursor: disabled ? 'default' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, color: disabled ? '#bbb' : '#333', padding: '0 6px',
    userSelect: 'none', fontFamily: 'Tahoma, sans-serif',
  }}>
    {children}
  </button>
);

const InternetExplorer = ({ windowData }) => {
  const initialUrl = windowData?.appData?.url || 'about:blank';

  const [history, setHistory] = useState([initialUrl]);
  const [histIdx, setHistIdx] = useState(0);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);
  const iframeRef = useRef(null);

  const currentUrl = history[histIdx];

  // Sync input bar with current url
  useEffect(() => {
    if (currentUrl !== 'about:blank') setInputUrl(currentUrl);
  }, [currentUrl]);

  const navigateTo = (url) => {
    let finalUrl = url.trim();
    if (!finalUrl) return;

    if (!/^https?:\/\//i.test(finalUrl) && finalUrl !== 'about:blank') {
      if (finalUrl.includes(' ') || !finalUrl.includes('.')) {
        finalUrl = `https://www.bing.com/search?q=${encodeURIComponent(finalUrl)}`;
      } else {
        finalUrl = 'https://' + finalUrl;
      }
    }

    // Blocked sites show an info page — no new tab
    if (isLikelyBlocked(finalUrl)) {
      setAutoOpened(true);
      // Still push to history so back button works
      const newHist = [...history.slice(0, histIdx + 1), finalUrl];
      setHistory(newHist);
      setHistIdx(newHist.length - 1);
      return;
    }

    setAutoOpened(false);
    const newHist = [...history.slice(0, histIdx + 1), finalUrl];
    setHistory(newHist);
    setHistIdx(newHist.length - 1);
    setLoading(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') navigateTo(inputUrl);
  };

  const goBack = () => { if (histIdx > 0) { setHistIdx(h => h - 1); setLoading(true); } };
  const goForward = () => { if (histIdx < history.length - 1) { setHistIdx(h => h + 1); setLoading(true); } };
  const refresh = () => {
    if (iframeRef.current && currentUrl !== 'about:blank') {
      iframeRef.current.src = currentUrl;
      setLoading(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#fff' }}>
      {/* ── TOOLBAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px',
        background: 'linear-gradient(180deg, #dce8f5 0%, #c5d9ee 100%)',
        borderBottom: '1px solid #abadb3',
      }}>
        <NavBtn onClick={goBack} disabled={histIdx === 0} title="Back">◀</NavBtn>
        <NavBtn onClick={goForward} disabled={histIdx >= history.length - 1} title="Forward">▶</NavBtn>
        <NavBtn onClick={refresh} disabled={currentUrl === 'about:blank'} title="Refresh">↺</NavBtn>

        {/* Address bar */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginLeft: 4, gap: 4 }}>
          <img src="/assets/icons/ie.png" alt="" width={16} height={16}
            style={{ flexShrink: 0 }}
            onError={e => { e.target.style.display = 'none'; }} />
          <input
            type="text"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter web address or search..."
            style={{
              flex: 1, padding: '3px 6px', border: '1px solid #abadb3',
              background: '#fff', fontSize: 12,
              fontFamily: 'Tahoma, sans-serif', outline: 'none',
            }}
          />
          <NavBtn onClick={() => navigateTo(inputUrl)} title="Go">Go</NavBtn>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      {isLikelyBlocked(currentUrl) ? (
        /* Blocked site info page - no new tab opens */
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', background: '#f4f6f8',
          fontFamily: 'Tahoma, "Segoe UI", sans-serif', padding: 40, textAlign: 'center', gap: 14,
        }}>
          <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#bbb" strokeWidth="2" fill="#e8e8e8"/>
            <text x="32" y="43" textAnchor="middle" fontSize="28" fill="#aaa">:(</text>
          </svg>
          <div style={{ fontSize: 17, fontWeight: 'bold', color: '#222' }}>This page can't be displayed</div>
          <div style={{ fontSize: 12, color: '#555', maxWidth: 400, lineHeight: 1.7 }}>
            <strong>{(() => { try { return new URL(currentUrl).hostname; } catch { return currentUrl; } })()}</strong> refuses
            to be embedded in other websites - this is their security policy, not a bug in SpicyFalcon OS.
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#fff', border: '1px solid #ddd', borderRadius: 3, padding: '4px 10px', fontSize: 11, color: '#555' }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}>{currentUrl}</span>
            <button
              onClick={() => navigator.clipboard.writeText(currentUrl).catch(() => {})}
              style={{ border: '1px solid #aaa', borderRadius: 2, background: '#f0f0f0', cursor: 'pointer', padding: '2px 8px', fontSize: 11, whiteSpace: 'nowrap' }}
            >Copy URL</button>
          </div>
          <div style={{ fontSize: 11, color: '#999' }}>Paste this URL in your browser to visit the page.</div>
        </div>
      ) : currentUrl === 'about:blank' ? (
        /* Default blank page — styled like IE's "new tab" */
        <div style={{
          flex: 1, background: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', gap: 12,
          fontFamily: 'Tahoma, sans-serif', color: '#999',
        }}>
          <img src="/assets/icons/ie.png" alt="" width={48} height={48}
            onError={e => { e.target.style.display = 'none'; }} />
          <span style={{ fontSize: 13 }}>Type an address or search query above to start browsing.</span>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          key={currentUrl}
          src={currentUrl}
          style={{ flex: 1, border: 'none' }}
          title="browser"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      )}

      {/* ── STATUS BAR ── */}
      <div style={{
        height: 20, background: '#f0f0f0', borderTop: '1px solid #d0d0d0',
        display: 'flex', alignItems: 'center', padding: '0 8px',
        fontSize: 11, color: '#555', fontFamily: 'Tahoma, sans-serif', flexShrink: 0,
      }}>
        {loading && currentUrl !== 'about:blank' ? `Loading ${currentUrl}...` : autoOpened ? 'Page opened in external browser' : currentUrl !== 'about:blank' ? 'Done' : ''}
      </div>
    </div>
  );
};

export default InternetExplorer;
