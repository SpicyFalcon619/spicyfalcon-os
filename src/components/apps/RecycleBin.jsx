import React, { useState } from 'react';

const TRASH_ITEMS = [
  {
    id: 1,
    name: 'my_first_hello_world.c',
    type: 'Source File',
    size: '342 bytes',
    deleted: '11/07/2022',
    content: `#include <stdio.h>
int main() {
    printf("Hello Wordl\\n"); // typo survived 3 weeks
    return 0;
}

// TODO: fix the typo
// TODO: actually understand what return 0 does`,
    reason: 'Classic. First program ever written.',
  },
  {
    id: 2,
    name: 'study_plan_final_v7_ACTUAL_FINAL.pdf',
    type: 'Document',
    size: '1.2 MB',
    deleted: '03/15/2024',
    content: `[Week 1] Complete Data Structures
[Week 2] Algorithms + LeetCode grind
[Week 3] Build a full-stack app
[Week 4] Contribute to open source

Actual outcome: watched 14 hours of YouTube
                played Minecraft until 4am
                "I'll start Monday"`,
    reason: 'Replaced by study_plan_final_v8_THIS_TIME_FOR_REAL.pdf',
  },
  {
    id: 3,
    name: 'blockchain_billion_dollar_idea.txt',
    type: 'Text File',
    size: '8 KB',
    deleted: '05/22/2025',
    content: `IDEA: Blockchain for everything
- Blockchain for groceries
- Blockchain for homework
- Blockchain for my cat
- Blockchain for blockchain

Status: Spent 3 weeks on the whitepaper.
        Showed it to 5 people.
        Got politely ignored by all 5.
        
Note: "Decentralized" is just a fancy word
      for "nobody is responsible for anything"`,
    reason: 'Superseded by actual Wastopia project (which won an award).',
  },
  {
    id: 4,
    name: 'CSS_is_easy.txt',
    type: 'Text File',
    size: '2 bytes',
    deleted: '02/10/2025',
    content: `LOL`,
    reason: '"CSS is easy" - famous last words. 6-hour centering battle followed.',
  },
  {
    id: 5,
    name: 'git_push_force_prod.sh',
    type: 'Shell Script',
    size: '89 bytes',
    deleted: '09/01/2024',
    content: `#!/bin/bash
# DO NOT RUN THIS
# I said DO NOT
git push origin main --force

# History: ran this once.
# Deleted the prod branch.
# Reinstated from backup.
# Never spoke of it again.`,
    reason: 'Legal reasons.',
  },
  {
    id: 6,
    name: 'sleep_schedule.txt',
    type: 'Text File',
    size: '512 bytes',
    deleted: 'Every day',
    content: `Planned:  10:00 PM sleep
Actual:   3:47 AM   "just one more commit"
          4:12 AM   "okay fixing this one bug"
          5:30 AM   fell asleep on keyboard
          
Output from keyboard: "aaaaaaaaaaaaaaaaaaaaaaaa"
This was committed to main.`,
    reason: 'Incompatible with Arch Linux + Hyprland ricing sessions.',
  },
  {
    id: 7,
    name: 'rubiks_solution_never_cheated.txt',
    type: 'Text File',
    size: '1 KB',
    deleted: '12/25/2023',
    content: `R U R' U' R U2 R' ... (algorithm I memorized)

Time to solve: 47 seconds (personal best)
Times I "invented" this algorithm: 0
Times I claim I did: whenever someone asks

Note: Yes I do use algorithms.
      No I will not apologize.
      The cube is solved. That is what matters.`,
    reason: 'The truth was too powerful.',
  },
  {
    id: 8,
    name: 'README_update_later.md',
    type: 'Markdown',
    size: '11 bytes',
    deleted: 'Never (still in 6 repos)',
    content: `# TODO
- [ ] Write README
- [ ] Update README  
- [ ] Actually explain what the project does

Status: later`,
    reason: '"Update later" - still waiting.',
  },
];

const FileIcon = ({ type }) => {
  const icons = {
    'Source File': '📄', 'Shell Script': '⚙', 'Document': '📋',
    'Text File': '📝', 'Markdown': '📘',
  };
  return <span style={{ fontSize: 18 }}>{icons[type] || '📄'}</span>;
};

const RecycleBin = () => {
  const [selected, setSelected] = useState(null);
  const [restored, setRestored] = useState([]);
  const [permDeleted, setPermDeleted] = useState([]);
  const [emptyDone, setEmptyDone] = useState(false);

  const visible = TRASH_ITEMS.filter(
    i => !permDeleted.includes(i.id) && !emptyDone
  );
  const sel = visible.find(i => i.id === selected);

  const restore = (id) => {
    setRestored(r => [...r, id]);
    setSelected(null);
    // Don't remove from visible — it "restores" but stays (it's a portfolio, not a real OS)
  };

  const permDelete = (id) => {
    setPermDeleted(p => [...p, id]);
    setSelected(null);
  };

  const emptyBin = () => {
    setEmptyDone(true);
    setSelected(null);
  };

  if (emptyDone) {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#fff', fontFamily: '"Segoe UI", Tahoma, sans-serif', gap: 16,
      }}>
        <img src="/assets/icons/recycle-bin.png" alt="" width={64} height={64}
          onError={e => { e.target.style.display = 'none'; }} />
        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Recycle Bin is empty</div>
        <div style={{ fontSize: 12, color: '#888', textAlign: 'center', maxWidth: 320, lineHeight: 1.6 }}>
          All my bad ideas, failed plans, and embarrassing code have been permanently deleted.<br />
          <em>...until the next commit.</em>
        </div>
        <button
          onClick={() => { setEmptyDone(false); setPermDeleted([]); setRestored([]); }}
          style={{
            marginTop: 8, padding: '6px 18px', border: '1px solid #aaa', borderRadius: 3,
            background: '#f0f0f0', cursor: 'pointer', fontSize: 12, fontFamily: 'Tahoma',
          }}
        >
          Restore all (undo)
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      fontFamily: '"Segoe UI", Tahoma, sans-serif', backgroundColor: '#fff', fontSize: 12,
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
        background: 'linear-gradient(180deg, #f8f8f8 0%, #ebebeb 100%)',
        borderBottom: '1px solid #c8c8c8',
      }}>
        <button
          onClick={() => sel && restore(sel.id)}
          disabled={!sel}
          style={{
            padding: '3px 10px', border: '1px solid', fontSize: 11, borderRadius: 2,
            cursor: sel ? 'pointer' : 'default',
            background: sel ? 'linear-gradient(180deg,#f0f8ff,#d8ebff)' : '#f0f0f0',
            borderColor: sel ? '#7db5e0' : '#d0d0d0', color: sel ? '#000' : '#999',
          }}
        >
          Restore
        </button>
        <button
          onClick={() => sel && permDelete(sel.id)}
          disabled={!sel}
          style={{
            padding: '3px 10px', border: '1px solid', fontSize: 11, borderRadius: 2,
            cursor: sel ? 'pointer' : 'default',
            background: sel ? 'linear-gradient(180deg,#fff0f0,#ffd8d8)' : '#f0f0f0',
            borderColor: sel ? '#e07d7d' : '#d0d0d0', color: sel ? '#800' : '#999',
          }}
        >
          Delete permanently
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={emptyBin}
          style={{
            padding: '3px 12px', border: '1px solid #c00', fontSize: 11, borderRadius: 2,
            background: 'linear-gradient(180deg,#fff0f0,#ffd0d0)',
            cursor: 'pointer', color: '#800', fontWeight: 'bold',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#ffc0c0'}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(180deg,#fff0f0,#ffd0d0)'}
        >
          Empty Recycle Bin
        </button>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'flex', padding: '3px 8px', background: '#f4f4f4',
        borderBottom: '1px solid #ddd', fontWeight: 'bold', color: '#333', fontSize: 11,
      }}>
        <div style={{ flex: 2 }}>Name</div>
        <div style={{ width: 110 }}>Type</div>
        <div style={{ width: 80 }}>Size</div>
        <div style={{ width: 110 }}>Date Deleted</div>
      </div>

      {/* Split view */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* File list */}
        <div style={{ width: sel ? '45%' : '100%', overflowY: 'auto', borderRight: sel ? '1px solid #ddd' : 'none' }}>
          {visible.length === 0 ? (
            <div style={{ padding: 20, color: '#888', textAlign: 'center', marginTop: 30 }}>
              <div style={{ fontSize: 24, marginBottom: 8, filter: 'grayscale(100%)' }}>🗑</div>
              The Recycle Bin is empty.
            </div>
          ) : visible.map(item => {
            const isSel = item.id === selected;
            const isRestored = restored.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => setSelected(isSel ? null : item.id)}
                style={{
                  display: 'flex', alignItems: 'center', padding: '5px 8px', gap: 8,
                  background: isSel ? '#0078d4' : isRestored ? '#e8ffe8' : 'transparent',
                  color: isSel ? '#fff' : '#000',
                  cursor: 'pointer', borderBottom: '1px solid #f0f0f0',
                }}
                onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = '#cce4ff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = isSel ? '#0078d4' : isRestored ? '#e8ffe8' : 'transparent'; }}
              >
                <FileIcon type={item.type} />
                <div style={{ flex: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
                  {item.name}
                  {isRestored && <span style={{ marginLeft: 6, fontSize: 10, color: isSel ? '#cfc' : '#0a0', fontStyle: 'italic' }}>(restored)</span>}
                </div>
                <div style={{ width: 110, fontSize: 11, color: isSel ? '#ddf' : '#666' }}>{item.type}</div>
                <div style={{ width: 80, fontSize: 11, color: isSel ? '#ddf' : '#666' }}>{item.size}</div>
                <div style={{ width: 110, fontSize: 11, color: isSel ? '#ddf' : '#666' }}>{item.deleted}</div>
              </div>
            );
          })}
        </div>

        {/* Preview pane */}
        {sel && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fafafa' }}>
            {/* Header */}
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid #ddd',
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <FileIcon type={sel.type} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: 13, wordBreak: 'break-all' }}>{sel.name}</div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{sel.type} • {sel.size} • Deleted: {sel.deleted}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 4, fontStyle: 'italic' }}>"{sel.reason}"</div>
              </div>
            </div>

            {/* File content preview */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 'bold', color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                File Preview
              </div>
              <pre style={{
                margin: 0, fontSize: 11, lineHeight: 1.6, fontFamily: '"Consolas", "Courier New", monospace',
                color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                background: '#fff', border: '1px solid #e0e0e0',
                padding: '10px 12px', borderRadius: 3,
              }}>
                {sel.content}
              </pre>
            </div>

            {/* Action row */}
            <div style={{ padding: '8px 14px', borderTop: '1px solid #ddd', display: 'flex', gap: 6 }}>
              <button onClick={() => restore(sel.id)} style={{
                padding: '4px 14px', border: '1px solid #7db5e0', borderRadius: 2,
                background: 'linear-gradient(180deg,#f0f8ff,#d8ebff)', cursor: 'pointer', fontSize: 11,
              }}>Restore</button>
              <button onClick={() => permDelete(sel.id)} style={{
                padding: '4px 14px', border: '1px solid #e07d7d', borderRadius: 2,
                background: 'linear-gradient(180deg,#fff0f0,#ffd8d8)', cursor: 'pointer', fontSize: 11, color: '#800',
              }}>Delete permanently</button>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{
        height: 20, background: '#f0f0f0', borderTop: '1px solid #c8c8c8',
        display: 'flex', alignItems: 'center', padding: '0 8px',
        fontSize: 11, color: '#555', flexShrink: 0, gap: 20,
      }}>
        <span>{visible.length} item{visible.length !== 1 ? 's' : ''}</span>
        {sel && <span>Selected: {sel.name}</span>}
      </div>
    </div>
  );
};

export default RecycleBin;
