import React, { useState, useEffect, useCallback } from 'react';
import useWindowStore from '../../store/useWindowStore';
import {
  IconBrandGithub, IconCpu, IconListDetails, IconLayoutGrid
} from '@tabler/icons-react';

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
  const [activeTab, setActiveTab] = useState('Processes');
  const [repos, setRepos] = useState([]);
  const [events, setEvents] = useState([]);
  const [contribWeeks, setContribWeeks] = useState([]);
  const [totalContribs, setTotalContribs] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const windows = useWindowStore(state => state.windows);
  const closeWindow = useWindowStore(state => state.closeWindow);

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
        fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`)
      ]);
      if (!profileRes.ok) throw new Error('GitHub API rate limit. Try again later.');
      setProfile(await profileRes.json());
      setRepos(await reposRes.json());
      setEvents(await eventsRes.json());

      if (contribRes.ok) {
        const contribData = await contribRes.json();
        const contributions = contribData.contributions || [];
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

  const tabs = [
    { id: 'Processes', icon: <IconListDetails size={18} /> },
    { id: 'Performance', icon: <IconCpu size={18} /> },
    { id: 'GitHub', icon: <IconBrandGithub size={18} /> },
    { id: 'Repositories', icon: <IconLayoutGrid size={18} /> }
  ];

  const SparkLine = ({ data, color, height = 60 }) => {
    const max = Math.max(...data, 1);
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * 200;
      const y = height - (v / max) * (height - 4);
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg width="200" height={height} style={{ display: 'block', overflow: 'visible', width: '100%' }} preserveAspectRatio="none">
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points={`0,${height} ${pts} 200,${height}`} fill={color} fillOpacity="0.1" />
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#1e1e1e', color: '#e0e0e0', fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ width: '180px', backgroundColor: '#161616', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', paddingTop: '10px' }}>
        {tabs.map(tab => (
          <div 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', 
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? '#333' : 'transparent',
              borderLeft: activeTab === tab.id ? '3px solid #00a2ed' : '3px solid transparent',
              transition: 'background 0.2s',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? '600' : '400',
              color: activeTab === tab.id ? '#fff' : '#aaa'
            }}
          >
            {tab.icon}
            {tab.id}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* PROCESSES TAB */}
          {activeTab === 'Processes' && (
            <div>
              <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Processes</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #333', color: '#aaa', fontSize: '13px', fontWeight: '600' }}>
                <div>Name</div>
                <div style={{ textAlign: 'right' }}>Status</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px' }}>
                {windows.length === 0 ? (
                  <div style={{ color: '#888', fontStyle: 'italic', padding: '10px 0' }}>No other apps running.</div>
                ) : (
                  windows.map(win => (
                    <div key={win.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#252525', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {win.icon ? <img src={win.icon} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} /> : <div style={{ width: 20, height: 20, backgroundColor: '#444', borderRadius: '2px' }} />}
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>{win.title}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#00cc00' }}>Running</span>
                        <button 
                          onClick={() => closeWindow(win.id)}
                          style={{ backgroundColor: '#444', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: 'background 0.2s' }}
                          onMouseOver={e => e.target.style.backgroundColor = '#d32f2f'}
                          onMouseOut={e => e.target.style.backgroundColor = '#444'}
                        >
                          End task
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === 'Performance' && (
            <div>
              <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Performance</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {[{ label: 'CPU', val: Math.round(cpuUsage), history: cpuHistory, color: '#00a2ed', desc: '13th Gen Intel Core i7-13650HX' },
                  { label: 'Memory', val: Math.round(ramUsage), history: ramHistory, color: '#9b59b6', desc: '16.0 GB DDR5' }
                ].map(item => (
                  <div key={item.label} style={{ backgroundColor: '#252525', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '16px' }}>{item.desc}</div>
                    <div style={{ border: `1px solid ${item.color}40`, borderRadius: '4px', padding: '16px', backgroundColor: '#1a1a1a', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ width: '100%', height: '80px', overflow: 'hidden' }}>
                         <SparkLine data={item.history} color={item.color} height={80} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: '12px', color: '#888' }}>60 Seconds</div>
                        <div style={{ fontSize: '24px', fontWeight: '300', color: '#fff' }}>{item.val}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '30px', backgroundColor: '#252525', borderRadius: '8px', padding: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>System Specifications</div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px', fontSize: '13px' }}>
                  <div style={{ color: '#888' }}>OS</div><div style={{ color: '#ddd' }}>Arch Linux (Hyprland) / Windows 11 dual-boot</div>
                  <div style={{ color: '#888' }}>Build</div><div style={{ color: '#ddd' }}>SpicyFalcon OS - Developer Edition (64-bit)</div>
                  <div style={{ color: '#888' }}>Graphics</div><div style={{ color: '#ddd' }}>NVIDIA GeForce RTX 4050 Laptop GPU</div>
                  <div style={{ color: '#888' }}>Storage</div><div style={{ color: '#ddd' }}>512 GB NVMe SSD</div>
                </div>
              </div>
            </div>
          )}

          {/* GITHUB TAB */}
          {activeTab === 'GitHub' && (
            <div>
              <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>GitHub Profile</div>
              {loading && <div style={{ color: '#888' }}>Fetching GitHub data...</div>}
              {error && <div style={{ color: '#ff4a4a' }}>Error: {error}</div>}
              {!loading && !error && profile && (
                <>
                  <div style={{ display: 'flex', gap: '20px', backgroundColor: '#252525', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <img src={profile.avatar_url} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid #444' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{profile.name || profile.login}</div>
                      <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>@{profile.login}</div>
                      {profile.bio && <div style={{ color: '#ccc', fontSize: '14px' }}>{profile.bio}</div>}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#252525', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#fff' }}>{totalContribs} contributions in the last year</div>
                    </div>
                    <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', paddingBottom: '10px' }}>
                      {contribWeeks.map((week, wi) => (
                        <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {week.map(day => (
                            <div key={day.date} title={`${day.count} contributions on ${day.date}`} style={{ width: 12, height: 12, backgroundColor: levelColor(day.count), borderRadius: '2px' }} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#252525', padding: '20px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>Recent Activity</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {events.slice(0, 6).map((ev, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: 40, height: 24, backgroundColor: '#333', color: '#aaa', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                            {ev.type.replace('Event', '').substring(0, 4).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, color: '#ccc', fontSize: '13px' }}>{ev.repo?.name}</div>
                          <div style={{ color: '#777', fontSize: '12px' }}>{new Date(ev.created_at).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* REPOSITORIES TAB */}
          {activeTab === 'Repositories' && (
            <div>
              <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Repositories</div>
              {loading && <div style={{ color: '#888' }}>Loading repositories...</div>}
              {error && <div style={{ color: '#ff4a4a' }}>Error: {error}</div>}
              {!loading && !error && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {repos.filter(r => !r.fork).map(repo => (
                    <div key={repo.id} style={{ backgroundColor: '#252525', border: '1px solid #333', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                      <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ fontSize: '16px', fontWeight: '600', color: '#58a6ff', textDecoration: 'none', marginBottom: '8px' }}>{repo.name}</a>
                      <div style={{ color: '#aaa', fontSize: '13px', flex: 1, marginBottom: '12px', lineHeight: '1.4' }}>{repo.description}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#888' }}>
                        {repo.language && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: LANG_COLORS[repo.language] || LANG_COLORS.default }} />
                            {repo.language}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <span>★ {repo.stargazers_count}</span>
                          <span>⑂ {repo.forks_count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
