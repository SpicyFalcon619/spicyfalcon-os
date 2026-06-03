import React, { useState, useEffect, useCallback } from 'react';
import useWindowStore from '../../store/useWindowStore';

const GITHUB_USER = 'SpicyFalcon619';

// Real daily contribution grid from the GitHub contributions calendar
// Uses github-contributions-api (open-source CORS proxy) for real data
const parseContribCalendar = (weeks) => {
  // weeks is array of { contributionDays: [{date, contributionCount}] }
  return weeks.map(w => w.contributionDays.map(d => ({ date: d.date, count: d.contributionCount })));
};

const levelColor = (count) => {
  if (count === 0) return '#161b22';
  if (count <= 2)  return '#0e4429';
  if (count <= 5)  return '#006d32';
  if (count <= 9)  return '#26a641';
  return '#39d353';
};

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', CSS: '#563d7c', HTML: '#e34c26', C: '#555555',
  'C++': '#f34b7d', Shell: '#89e051', default: '#8b949e'
};

const TaskManager = () => {
  const openWindow = useWindowStore(state => state.openWindow);
  const [activeTab, setActiveTab] = useState('GitHub');
  const [repos, setRepos] = useState([]);
  const [events, setEvents] = useState([]);
  const [contribWeeks, setContribWeeks] = useState([]);
  const [totalContribs, setTotalContribs] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  // Fake CPU/RAM state for Performance tab
  const [cpuUsage, setCpuUsage] = useState(12);
  const [ramUsage, setRamUsage] = useState(42);
  const [cpuHistory, setCpuHistory] = useState(Array(30).fill(12));
  const [ramHistory, setRamHistory] = useState(Array(30).fill(42));

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const val = Math.max(1, Math.min(100, prev + (Math.random() * 10 - 5)));
        setCpuHistory(h => [...h.slice(1), Math.round(val)]);
        return val;
      });
      setRamUsage(prev => {
        const val = Math.max(30, Math.min(65, prev + (Math.random() * 2 - 1)));
        setRamHistory(h => [...h.slice(1), Math.round(val)]);
        return val;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchGitHub = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, reposRes, eventsRes, contribRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USER}`),
        fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`),
        fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100`),
        // github-contributions-api: free, CORS-enabled proxy for GitHub contribution calendar
        fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`)
      ]);
      if (!profileRes.ok) throw new Error('GitHub API rate limit. Try again later.');
      setProfile(await profileRes.json());
      setRepos(await reposRes.json());
      setEvents(await eventsRes.json());

      if (contribRes.ok) {
        const contribData = await contribRes.json();
        // The API returns { total: {year: n}, contributions: [{date, count, level}] }
        const contributions = contribData.contributions || [];
        // Group into weeks (Sun=0 ... Sat=6)
        const weeks = [];
        let week = [];
        contributions.forEach((day, i) => {
          week.push({ date: day.date, count: day.count });
          if (week.length === 7) { weeks.push(week); week = []; }
        });
        if (week.length) weeks.push(week);
        setContribWeeks(weeks);
        const yearKey = Object.keys(contribData.total || {})[0];
        setTotalContribs(contribData.total?.[yearKey] || 0);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGitHub(); }, [fetchGitHub]);

  const tabStyle = (id) => ({
    padding: '4px 12px',
    border: '1px solid #888',
    borderBottom: activeTab === id ? '1px solid #f0f0f0' : '1px solid #888',
    backgroundColor: activeTab === id ? '#f0f0f0' : '#dce3ea',
    marginBottom: activeTab === id ? '-1px' : 0,
    borderTopLeftRadius: '3px',
    borderTopRightRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: '"Tahoma", sans-serif',
    color: '#000',
    fontWeight: activeTab === id ? 'bold' : 'normal',
    whiteSpace: 'nowrap'
  });

  const SparkLine = ({ data, color, height = 60 }) => {
    const max = Math.max(...data, 1);
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * 200;
      const y = height - (v / max) * (height - 4);
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg width="200" height={height} style={{ display: 'block' }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
        <polygon points={`0,${height} ${pts} 200,${height}`} fill={color} fillOpacity="0.15" />
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f0f0f0', fontFamily: '"Tahoma", sans-serif', fontSize: '12px', color: '#000' }}>

      {/* Menu bar */}
      <div style={{ display: 'flex', gap: '15px', padding: '2px 8px', borderBottom: '1px solid #dfdfdf', backgroundColor: '#fafafa', flexShrink: 0 }}>
        <span style={{ cursor: 'default' }}>File</span>
        <span style={{ cursor: 'default' }}>Options</span>
        <span style={{ cursor: 'default' }}>View</span>
        <span style={{ cursor: 'default' }}>Help</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #888', marginTop: '6px', padding: '0 5px', flexShrink: 0, flexWrap: 'wrap', gap: '2px' }}>
        {['GitHub', 'Repositories'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(tab)}>{tab}</div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* ========== GITHUB TAB ========== */}
        {activeTab === 'GitHub' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
            {loading && (
              <div style={{ textAlign: 'center', paddingTop: '40px', color: '#555' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px', color: '#666' }}>[ Loading... ]</div>
                Fetching GitHub data...
              </div>
            )}
            {error && (
              <div style={{ padding: '16px', backgroundColor: '#fff8e0', border: '1px solid #f0c020', borderRadius: '3px' }}>
                <strong>[Error] {error}</strong><br />
                <span style={{ color: '#555', fontSize: '11px' }}>GitHub API has a 60 req/hr limit for unauthenticated requests.</span>
                <br /><button onClick={fetchGitHub} style={{ marginTop: '8px', padding: '3px 10px', cursor: 'pointer', fontSize: '11px' }}>Retry</button>
              </div>
            )}

            {!loading && !error && profile && (
              <>
                {/* Profile card */}
                <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', padding: '12px 14px', backgroundColor: '#fff', border: '1px solid #d0d8e4', borderRadius: '4px' }}>
                  <img src={profile.avatar_url} alt="avatar" style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #b0c4de' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0a246a' }}>{profile.name || profile.login}</div>
                    <div style={{ color: '#555', fontSize: '11px', marginTop: '2px' }}>@{profile.login}</div>
                    {profile.bio && <div style={{ marginTop: '6px', fontSize: '12px', color: '#333' }}>{profile.bio}</div>}
                    <div style={{ marginTop: '8px', display: 'flex', gap: '16px', fontSize: '11px' }}>
                      <span><strong>{profile.public_repos}</strong> repos</span>
                      <span><strong>{profile.followers}</strong> followers</span>
                      <span>{profile.location || 'Bangladesh'}</span>
                    </div>
                  </div>
                </div>

                {/* Contribution grid */}
                {contribWeeks.length > 0 ? (
                  <div style={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '14px 16px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 'bold', color: '#e6edf3', marginBottom: '10px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold' }}>{totalContribs} contributions in the last year</span>
                      <a href={`https://github.com/${GITHUB_USER}`} onClick={(e) => { e.preventDefault(); window.open(`https://github.com/${GITHUB_USER}`, '_blank'); }} style={{ color: '#58a6ff', fontSize: '11px', textDecoration: 'none' }}>View on GitHub ↗</a>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <div style={{ display: 'flex', gap: '3px', position: 'relative' }}>
                        {contribWeeks.map((week, wi) => (
                          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {week.map((day) => (
                              <div
                                key={day.date}
                                title={`${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}`}
                                style={{
                                  width: 11, height: 11,
                                  backgroundColor: levelColor(day.count),
                                  borderRadius: '2px',
                                  cursor: 'default',
                                  outline: '1px solid rgba(255,255,255,0.04)'
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', fontSize: '10px', color: '#8b949e' }}>
                      Less
                      {[0, 2, 5, 9, 12].map(c => (
                        <div key={c} style={{ width: 11, height: 11, backgroundColor: levelColor(c), borderRadius: '2px', outline: '1px solid rgba(255,255,255,0.04)' }} />
                      ))}
                      More
                    </div>
                  </div>
                ) : !loading && (
                  <div style={{ backgroundColor: '#fff', border: '1px solid #d0d8e4', borderRadius: '4px', padding: '12px 14px', marginBottom: '16px', color: '#888', fontSize: '12px' }}>
                    Contribution data loading...
                  </div>
                )}

                {/* Recent events */}
                <div style={{ backgroundColor: '#fff', border: '1px solid #d0d8e4', borderRadius: '4px', padding: '12px 14px' }}>
                  <div style={{ fontWeight: 'bold', color: '#0a246a', marginBottom: '10px', fontSize: '12px' }}>Recent Activity</div>
                  {events.slice(0, 8).map((ev, i) => {
                    const label = ev.type === 'PushEvent' ? `Pushed to ${ev.repo?.name}` :
                      ev.type === 'CreateEvent' ? `Created ${ev.payload?.ref_type} in ${ev.repo?.name}` :
                      ev.type === 'WatchEvent' ? `Starred ${ev.repo?.name}` :
                      ev.type === 'ForkEvent' ? `Forked ${ev.repo?.name}` :
                      ev.type.replace('Event', '') + ' on ' + ev.repo?.name;
                    const typeLabel = ev.type === 'PushEvent' ? 'PUSH' : ev.type === 'CreateEvent' ? 'NEW' : ev.type === 'WatchEvent' ? 'STAR' : ev.type === 'ForkEvent' ? 'FORK' : 'EVT';
                    const date = ev.created_at ? new Date(ev.created_at).toLocaleDateString() : '';
                    return (
                      <div key={i} style={{ display: 'flex', gap: '10px', padding: '5px 0', borderBottom: i < 7 ? '1px solid #f0f2f4' : 'none', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#fff', backgroundColor: '#1a6dbd', padding: '1px 4px', borderRadius: '2px', width: 30, textAlign: 'center', flexShrink: 0, letterSpacing: '0.3px' }}>{typeLabel}</span>
                        <div style={{ flex: 1, fontSize: '11px' }}>
                          <div style={{ color: '#1a2c4a' }}>{label}</div>
                        </div>
                        <span style={{ fontSize: '10px', color: '#999', whiteSpace: 'nowrap' }}>{date}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ========== REPOSITORIES TAB ========== */}
        {activeTab === 'Repositories' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
            {loading && <div style={{ textAlign: 'center', paddingTop: '40px', color: '#555' }}>Loading repositories...</div>}
            {error && <div style={{ padding: '12px', backgroundColor: '#fff8e0', border: '1px solid #f0c020', borderRadius: '3px' }}>Error: {error}</div>}
            {!loading && !error && repos.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {repos.filter(r => !r.fork).map(repo => (
                  <div key={repo.id} style={{ backgroundColor: '#fff', border: '1px solid #d0d8e4', borderRadius: '4px', padding: '10px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <a
                          href={repo.html_url}
                          onClick={(e) => { e.preventDefault(); window.open(repo.html_url, '_blank'); }}
                          rel="noreferrer"
                          style={{ color: '#1a6dbd', fontWeight: 'bold', fontSize: '13px', textDecoration: 'none' }}
                          onMouseOver={e => e.target.style.textDecoration = 'underline'}
                          onMouseOut={e => e.target.style.textDecoration = 'none'}
                        >
                          {repo.name}
                        </a>
                        {repo.language && (
                          <span style={{ marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#555' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: LANG_COLORS[repo.language] || LANG_COLORS.default, display: 'inline-block' }} />
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: '#666', flexShrink: 0 }}>
                        <span>Stars: {repo.stargazers_count}</span>
                        <span>Forks: {repo.forks_count}</span>
                      </div>
                    </div>
                    {repo.description && (
                      <div style={{ marginTop: '5px', fontSize: '11px', color: '#555', lineHeight: '1.5' }}>{repo.description}</div>
                    )}
                    {repo.topics?.length > 0 && (
                      <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                        {repo.topics.map(t => (
                          <span key={t} style={{ padding: '1px 7px', backgroundColor: '#e0f0ff', border: '1px solid #9bc8f0', borderRadius: '10px', fontSize: '10px', color: '#1a3060' }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========== PERFORMANCE TAB ========== */}
        {activeTab === 'Performance' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              {[{ label: 'CPU Usage', val: Math.round(cpuUsage), history: cpuHistory, color: '#17fc03' },
                { label: 'Memory', val: Math.round(ramUsage), history: ramHistory, color: '#17fc03' }
              ].map(item => (
                <div key={item.label} style={{ flex: 1 }}>
                  <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>{item.label}</div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '50px', textAlign: 'right', fontSize: '18px', fontFamily: 'monospace', color: '#00cc00', backgroundColor: '#000', padding: '5px 4px', border: '1px solid #888', borderRadius: '2px' }}>
                      {item.val}%
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#000', border: '1px solid #444', borderRadius: '2px', overflow: 'hidden', height: '70px', padding: '2px' }}>
                      <SparkLine data={item.history} color={item.color} height={66} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #ddd', paddingTop: '14px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '13px' }}>Rig Specifications</div>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['Processor', '13th Gen Intel® Core™ i7-13650HX (14 Cores)'],
                    ['Memory (RAM)', '16.0 GB DDR5'],
                    ['Graphics', 'NVIDIA GeForce RTX 4050 Laptop GPU'],
                    ['Storage', '512 GB NVMe SSD'],
                    ['OS', 'Arch Linux (Hyprland) / Windows 11 dual-boot'],
                    ['Build', 'SpicyFalcon OS - Developer Edition (64-bit)']
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '5px 4px', fontWeight: 'bold', width: '130px', color: '#333' }}>{k}:</td>
                      <td style={{ padding: '5px 4px', color: '#555' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', gap: '20px', padding: '3px 12px', borderTop: '1px solid #dfdfdf', backgroundColor: '#fafafa', color: '#444', flexShrink: 0 }}>
        <span>CPU: {Math.round(cpuUsage)}%</span>
        <span>Memory: {Math.round(ramUsage)}%</span>
        {!loading && !error && profile && <span>Repos: {profile.public_repos}</span>}
      </div>
    </div>
  );
};

export default TaskManager;
