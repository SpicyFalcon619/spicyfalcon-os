import React, { useState } from 'react';
import { portfolioData } from '../../data/portfolioData';
import useWindowStore from '../../store/useWindowStore';

// Inline SVG icon components — no emoji, no external dep
const IconGitHub = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const IconLinkedIn = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconMail = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
);

const IconExternalLink = ({ size = 12, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15,3 21,3 21,9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const IconTrophy = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8,21 12,21 16,21"/><line x1="12" y1="17" x2="12" y2="21"/>
    <path d="M7 4H4a2 2 0 0 0-2 2v1c0 3.31 2.69 6 6 6"/><path d="M17 4h3a2 2 0 0 1 2 2v1c0 3.31-2.69 6-6 6"/>
    <path d="M7 4a5 5 0 0 0 10 0H7z"/>
  </svg>
);

const IconCode = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/>
  </svg>
);

const IconTool = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const IconBrain = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.16z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.16z"/>
  </svg>
);

const IconBarChart = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const Portfolio = ({ windowData }) => {
  const [activeTab, setActiveTab] = useState(windowData?.appData?.section || 'about');
  const { personal, education, skills, projects } = portfolioData;
  const openWindow = useWindowStore(state => state.openWindow);

  const openInBrowser = (e, url) => {
    e.preventDefault();
    window.open(url, '_blank');
  };

  const tabStyle = (id) => ({
    padding: '4px 14px',
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
    whiteSpace: 'nowrap',
  });

  const skillBadge = (text, color) => (
    <span key={text} style={{
      display: 'inline-block',
      padding: '3px 10px',
      margin: '3px',
      borderRadius: '3px',
      fontSize: '12px',
      fontFamily: '"Tahoma", sans-serif',
      backgroundColor: color || '#d4e9ff',
      border: '1px solid rgba(0,0,0,0.15)',
      color: '#000',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
    }}>{text}</span>
  );

  const SectionHeader = ({ icon, label }) => (
    <div style={{ fontWeight: 'bold', color: '#0a246a', marginBottom: '8px', fontSize: '13px', borderBottom: '1px solid #ddd', paddingBottom: '4px', display: 'flex', alignItems: 'center', gap: 6 }}>
      {icon}
      {label}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f0f0f0', fontFamily: '"Tahoma", sans-serif', fontSize: '13px', color: '#000' }}>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0a246a 0%, #1a6dbd 40%, #4baee8 100%)',
        padding: '20px 24px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100px',
        flexShrink: 0,
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -30, width: 100, height: 100, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />

        <div style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.7)', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
          <img
            src="/assets/avatar.jpg"
            alt="Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.src = '/assets/my-logo.png'; }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '20px', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            {personal.name}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', marginTop: '4px' }}>
            {personal.tagline}
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href={personal.github} onClick={(e) => { e.preventDefault(); window.open(personal.github, '_blank'); }}
              style={{ color: '#a8d4ff', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>
              <IconGitHub size={13} color="#a8d4ff" /> GitHub
            </a>
            <a href={personal.linkedin} onClick={(e) => { e.preventDefault(); window.open(personal.linkedin, '_blank'); }}
              style={{ color: '#a8d4ff', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>
              <IconLinkedIn size={13} color="#a8d4ff" /> LinkedIn
            </a>
            <a href={`mailto:${personal.email}`}
              style={{ color: '#a8d4ff', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>
              <IconMail size={13} color="#a8d4ff" /> {personal.email}
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #888', padding: '0 10px', paddingTop: '6px', flexShrink: 0, gap: '2px' }}>
        {[
          { id: 'about', label: 'About Me' },
          { id: 'skills', label: 'Skills' },
          { id: 'education', label: 'Education' },
          { id: 'projects', label: 'Projects' },
        ].map(tab => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabStyle(tab.id)}>
            {tab.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', backgroundColor: '#fff' }}>

        {/* ── ABOUT ── */}
        {activeTab === 'about' && (
          <div>
            <div style={{ borderLeft: '4px solid #1a6dbd', paddingLeft: '12px', marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '6px', color: '#0a246a' }}>Bio</div>
              <div style={{ lineHeight: '1.7', color: '#333', whiteSpace: 'pre-line' }}>{personal.bio}</div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
              {[
                { label: 'Username', value: personal.gamertag },
                { label: 'University', value: 'UIU - CSE' },
                { label: 'Interests', value: 'Blockchain · Linux · AI' },
                { label: 'Location', value: 'Bangladesh' },
              ].map(item => (
                <div key={item.label} style={{ flex: '1 1 170px', backgroundColor: '#f5f8ff', border: '1px solid #d0daea', borderRadius: '4px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                  <div style={{ marginTop: '4px', fontWeight: 'bold', color: '#1a3060' }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', padding: '12px 16px', background: 'linear-gradient(90deg,#f0f6ff,#e8f0fe)', border: '1px solid #bdd4f8', borderRadius: '4px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <IconTrophy size={16} color="#1a6dbd" />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#1a6dbd', marginBottom: '4px' }}>Achievement</div>
                <div style={{ fontSize: '13px', color: '#2c3e50' }}>Won <strong>"Best Emerging Team"</strong> - Blockchain Category at UIU CSE FEST 2025 with <em>Wastopia</em>.</div>
              </div>
            </div>
          </div>
        )}

        {/* ── SKILLS ── */}
        {activeTab === 'skills' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader icon={<IconCode size={14} color="#0a246a" />} label="Programming Languages" />
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {skills.languages.map(s => skillBadge(s, '#d4e9ff'))}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader icon={<IconTool size={14} color="#0a246a" />} label="Tools & Technologies" />
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {skills.technologies.map(s => skillBadge(s, '#d4f0e8'))}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader icon={<IconBrain size={14} color="#0a246a" />} label="Soft Skills" />
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {skills.soft.map(s => skillBadge(s, '#f5e8ff'))}
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <SectionHeader icon={<IconBarChart size={14} color="#0a246a" />} label="Proficiency" />
              {[
                { name: 'C / C++', level: 82 },
                { name: 'Java', level: 74 },
                { name: 'HTML / CSS / JS', level: 80 },
                { name: 'Linux (Arch)', level: 88 },
                { name: 'Git', level: 75 },
                { name: 'Blockchain Concepts', level: 65 },
                { name: 'Python', level: 50 },
              ].map(item => (
                <div key={item.name} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '12px' }}>
                    <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                    <span style={{ color: '#666' }}>{item.level}%</span>
                  </div>
                  <div style={{ height: '12px', backgroundColor: '#e0e8f0', borderRadius: '2px', border: '1px solid #b0bec5', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.level}%`, background: 'linear-gradient(90deg, #1a6dbd, #4baee8)', borderRadius: '2px', transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EDUCATION ── */}
        {activeTab === 'education' && (
          <div>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '20px', padding: '16px', border: '1px solid #cce0ff', borderLeft: '4px solid #1a6dbd', borderRadius: '4px', backgroundColor: '#f8fbff' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0a246a' }}>{edu.degree}</div>
                <div style={{ color: '#1a6dbd', fontSize: '12px', marginTop: '2px' }}>{edu.institution}</div>
                <div style={{ color: '#888', fontSize: '11px', marginTop: '2px', fontStyle: 'italic' }}>{edu.period}</div>
                <div style={{ marginTop: '10px', fontSize: '12px', lineHeight: '1.6', color: '#444' }}>{edu.details}</div>
                {edu.courses && (
                  <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {edu.courses.map(c => (
                      <span key={c} style={{ padding: '2px 8px', backgroundColor: '#e0f0ff', border: '1px solid #9bc8f0', borderRadius: '2px', fontSize: '11px', color: '#1a3060' }}>{c}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── PROJECTS ── */}
        {activeTab === 'projects' && (
          <div>
            {projects.map((project, i) => (
              <div
                key={i}
                onClick={(e) => openInBrowser(e, project.link)}
                style={{ cursor: 'pointer', display: 'block', marginBottom: '16px', border: '1px solid #d0d8e4', borderRadius: '4px', overflow: 'hidden', textDecoration: 'none', color: 'inherit', transition: 'box-shadow 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(26,109,189,0.25)'; e.currentTarget.style.borderColor = '#4baee8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#d0d8e4'; }}
              >
                {/* Project header */}
                <div style={{ background: 'linear-gradient(90deg, #0a246a, #1a6dbd)', padding: '10px 16px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{project.name}</span>
                    <span style={{ fontSize: '11px', marginLeft: '10px', color: 'rgba(255,255,255,0.7)' }}>{project.type}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#a8d4ff', fontSize: '11px' }}>
                    <IconExternalLink size={11} color="#a8d4ff" />
                    Open
                  </div>
                </div>

                {/* Project body */}
                <div style={{ padding: '12px 16px', backgroundColor: '#fff' }}>
                  <div style={{ lineHeight: '1.6', color: '#333', fontSize: '12px', marginBottom: '10px' }}>{project.description}</div>
                  {project.extra && (
                    <div style={{ padding: '6px 10px', backgroundColor: '#f8f4e8', border: '1px solid #e0c860', borderRadius: '3px', fontSize: '11px', color: '#6b4c00', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <IconTrophy size={12} color="#b8860b" />
                      {project.extra}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {project.tags.map(tag => (
                      <span key={tag} style={{ padding: '2px 8px', backgroundColor: '#e8f4ff', border: '1px solid #9bc8f0', borderRadius: '2px', fontSize: '11px', color: '#1a3060' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
