import React, { useState, useEffect, useCallback } from 'react';
import useWindowStore from '../../store/useWindowStore';
import useConfigStore from '../../store/useConfigStore';

const GITHUB_USER = 'SpicyFalcon619';

const parseContribCalendar = (weeks) => {
  return weeks.map(w => w.contributionDays.map(d => ({ date: d.date, count: d.contributionCount })));
};

const levelColor = (count) => {
  if (count === 0) return '#e0e0e0';
  if (count <= 2)  return '#9be9a8';
  if (count <= 5)  return '#40c463';
  if (count <= 9)  return '#30a14e';
  return '#216e39';
};

const TaskManager = () => {
  const [activeTab, setActiveTab] = useState('Processes');
  const [repos, setRepos] = useState([]);
  const [events, setEvents] = useState([]);
  const [contribWeeks, setContribWeeks] = useState([]);
  const [totalContribs, setTotalContribs] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const windows = useWindowStore(state => state.windows);
  const closeWindow = useWindowStore(state => state.closeWindow);
  const osName = useConfigStore(state => state.osName);

  const [cpuUsage, setCpuUsage] = useState(12);
  const [ramUsage, setRamUsage] = useState(42);
  const [cpuHistory, setCpuHistory] = useState(Array(60).fill(12));
  const [ramHistory, setRamHistory] = useState(Array(60).fill(42));

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
    try {
      const [profileRes, reposRes, eventsRes, contribRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USER}`),
        fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`),
        fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100`),
        fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`)
      ]);
      setProfile(await profileRes.json());
      setRepos(await reposRes.json());
      setEvents(await eventsRes.json());

      if (contribRes.ok) {
        const contribData = await contribRes.json();
        const contributions = contribData.contributions || [];
        const weeks = [];
        let week = [];
        contributions.forEach((day) => {
          week.push({ date: day.date, count: day.count });
          if (week.length === 7) { weeks.push(week); week = []; }
        });
        if (week.length) weeks.push(week);
        setContribWeeks(weeks);
        const yearKey = Object.keys(contribData.total || {})[0];
        setTotalContribs(contribData.total?.[yearKey] || 0);
      }
    } catch (e) {
      // Ignore errors for classic look
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGitHub(); }, [fetchGitHub]);

  const tabs = ['Applications', 'Processes', 'Performance', 'GitHub', 'Repositories'];

  const Win7Chart = ({ data, height = 120 }) => {
    const max = 100;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * 300;
      const y = height - (v / max) * height;
      return `${x},${y}`;
    }).join(' ');
    return (
      <div style={{ backgroundColor: '#000', border: '1px solid #777', position: 'relative', height, width: 300, overflow: 'hidden' }}>
        {/* Grid lines */}
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ position: 'absolute', top: `${(i+1)*25}%`, left: 0, right: 0, borderTop: '1px solid #004400' }} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} style={{ position: 'absolute', left: `${(i+1)*12.5}%`, top: 0, bottom: 0, borderLeft: '1px solid #004400' }} />
        ))}
        <svg width="300" height={height} style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
          <polyline points={pts} fill="none" stroke="#17fc03" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f0f0f0', fontFamily: '"Segoe UI", Tahoma, sans-serif', color: '#000', fontSize: '12px' }}>
      
      {/* Menu Bar */}
      <div style={{ display: 'flex', gap: '16px', padding: '4px 8px', backgroundColor: '#fff', borderBottom: '1px solid #d9d9d9', fontSize: '12px', userSelect: 'none' }}>
        <span>File</span><span>Options</span><span>View</span><span>Help</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '8px 8px 0', borderBottom: '1px solid #a0a0a0', backgroundColor: '#fff' }}>
        {tabs.map(tab => (
          <div 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '4px 12px', 
              backgroundColor: activeTab === tab ? '#fff' : '#e4e4e4',
              border: '1px solid #a0a0a0',
              borderBottom: activeTab === tab ? '1px solid #fff' : '1px solid #a0a0a0',
              marginBottom: activeTab === tab ? '-1px' : '0',
              borderTopLeftRadius: '3px',
              borderTopRightRadius: '3px',
              cursor: 'default',
              userSelect: 'none',
              zIndex: activeTab === tab ? 2 : 1
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '12px', backgroundColor: '#fff', border: '1px solid #a0a0a0', borderTop: 'none', margin: '0 8px 8px', overflowY: 'auto' }}>
        
        {activeTab === 'Applications' && (
          <div style={{ height: '100%', border: '1px solid #d9d9d9' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', backgroundColor: '#f4f4f4', borderBottom: '1px solid #d9d9d9', padding: '4px 8px' }}>
              <div>Task</div><div>Status</div>
            </div>
            {windows.length === 0 ? (
              <div style={{ padding: '8px', color: '#666' }}>No applications are running.</div>
            ) : (
              windows.map(w => (
                <div key={w.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', padding: '4px 8px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {w.icon ? <img src={w.icon} alt="" width={16} height={16} /> : <div style={{ width: 16, height: 16, backgroundColor: '#ccc' }}/>}
                    {w.title}
                  </div>
                  <div>Running</div>
                </div>
              ))
            )}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', padding: '0 8px' }}>
               <button style={{ padding: '4px 12px', cursor: 'default' }}>End Task</button>
            </div>
          </div>
        )}

        {activeTab === 'Processes' && (
          <div style={{ height: '100%', border: '1px solid #d9d9d9', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', backgroundColor: '#f4f4f4', borderBottom: '1px solid #d9d9d9', padding: '4px 8px', borderRight: '1px solid #fff' }}>
              <div>Image Name</div><div>CPU</div><div>Memory (Private Working Set)</div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {windows.map(w => (
                <div key={w.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', padding: '4px 8px' }}>
                  <div>{w.component}.exe</div>
                  <div>00</div>
                  <div>{Math.floor(Math.random() * 50000 + 10000).toLocaleString()} K</div>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', padding: '4px 8px' }}>
                <div>System Idle Process</div>
                <div>{100 - Math.round(cpuUsage)}</div>
                <div>24 K</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
              <button 
                onClick={() => {
                  const toKill = windows[windows.length - 1];
                  if (toKill) closeWindow(toKill.id);
                }}
                style={{ padding: '4px 12px', cursor: 'default' }}
              >
                End Process
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Performance' && (
          <div style={{ display: 'flex', gap: '24px', padding: '8px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ marginBottom: '4px' }}>CPU Usage</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: 40, height: 120, border: '1px solid #777', backgroundColor: '#000', color: '#17fc03', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '4px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: '100%', backgroundColor: '#17fc03', height: `${cpuUsage}%`, opacity: 0.8, position: 'absolute', bottom: 0, left: 0 }} />
                    <span style={{ zIndex: 1 }}>{Math.round(cpuUsage)}%</span>
                  </div>
                  <Win7Chart data={cpuHistory} />
                </div>
              </div>
              <div>
                <div style={{ marginBottom: '4px' }}>Memory</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: 40, height: 120, border: '1px solid #777', backgroundColor: '#000', color: '#17fc03', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '4px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: '100%', backgroundColor: '#17fc03', height: `${ramUsage}%`, opacity: 0.8, position: 'absolute', bottom: 0, left: 0 }} />
                    <span style={{ zIndex: 1 }}>{Math.round(ramUsage)}%</span>
                  </div>
                  <Win7Chart data={ramHistory} />
                </div>
              </div>
            </div>
            <div style={{ width: '300px', fontSize: '11px' }}>
              <div style={{ border: '1px solid #d9d9d9', padding: '8px', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#003399' }}>System</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>OS</span><span>{osName} (64-bit)</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Processor</span><span>13th Gen Intel Core i7</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Graphics</span><span>NVIDIA RTX 4050</span></div>
              </div>
              <div style={{ border: '1px solid #d9d9d9', padding: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#003399' }}>Physical Memory (MB)</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total</span><span>16234</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cached</span><span>4592</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Available</span><span>{16234 - Math.round(16234 * (ramUsage/100))}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Free</span><span>{16234 - Math.round(16234 * (ramUsage/100)) - 1000}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Keeping GitHub info loosely styled like a list view for Windows 7 */}
        {activeTab === 'GitHub' && profile && (
          <div style={{ display: 'flex', gap: '16px' }}>
            <img src={profile.avatar_url} alt="avatar" style={{ width: 64, height: 64, border: '1px solid #a0a0a0' }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{profile.name} (@{profile.login})</div>
              <div style={{ color: '#444' }}>{profile.bio}</div>
              <div style={{ marginTop: '8px' }}>{totalContribs} contributions</div>
              <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                {contribWeeks.map((week, wi) => (
                  <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {week.map(day => (
                      <div key={day.date} style={{ width: 8, height: 8, backgroundColor: levelColor(day.count) }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Repositories' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '8px' }}>
            {repos.filter(r => !r.fork).map(r => (
              <div key={r.id} style={{ border: '1px solid #d9d9d9', padding: '8px', backgroundColor: '#f9f9f9' }}>
                <a href={r.html_url} target="_blank" rel="noreferrer" style={{ fontWeight: 'bold', color: '#003399', textDecoration: 'none' }}>{r.name}</a>
                <div style={{ color: '#444', height: '32px', overflow: 'hidden', margin: '4px 0' }}>{r.description}</div>
                <div style={{ color: '#888' }}>{r.language} | ★ {r.stargazers_count}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div style={{ display: 'flex', gap: '24px', padding: '4px 12px', borderTop: '1px solid #dfdfdf', backgroundColor: '#f0f0f0', color: '#333' }}>
        <span>Processes: {windows.length + 1}</span>
        <span>CPU Usage: {Math.round(cpuUsage)}%</span>
        <span>Physical Memory: {Math.round(ramUsage)}%</span>
      </div>
    </div>
  );
};

export default TaskManager;
