# GEMINI_V2_ADDITIONS.md — Phase 2 Feature Additions
## Google Antigravity Workspace Instruction
### Project: SpicyFalcon OS — Spicetify Rebuild + New Feature Suite

---

## § 0 — CONTEXT & OPERATING MODE

You are continuing development on an existing codebase: **SpicyFalcon OS** — a Windows 7 Aero Glass web portfolio built with React + Zustand + Vite.

The full file tree, component architecture, and store design are already established. Do NOT re-scaffold, re-plan the base OS, or touch any component outside the explicit scope of each task below.

You are operating in **BUILD mode from the start.** There is no Discovery Phase for this prompt. All requirements are fully specified. Execute tasks in strict priority order.

**Prime rule for this session:** Every task is isolated. Complete and commit one task fully before starting the next. Never batch-write across multiple components in one pass.

---

## § 1 — CRITICAL DIAGNOSIS: WHY SPICETIFY IS BROKEN

Before writing a single line of code, internalize this:

The original `Spicetify.jsx` likely used one of these broken approaches:
1. **A raw `<iframe src="https://open.spotify.com/embed/...">` with no controller** — breaks intermittently because Spotify's embed servers return 503/504 at random, especially on non-Premium accounts and in sandboxed iframes.
2. **The Spotify iFrame API's `EmbedController.play()`** — broken since early 2024. Spotify silently broke postMessage communication. `play()` and `pause()` calls do nothing. Issue is documented but unresolved.
3. **Spotify Web Playback SDK** — requires Premium, requires OAuth user token, completely overkill and inappropriate for a static portfolio.

**The correct architecture for this use case is:**

```
Spotify Web API (Client Credentials) ──► fetch playlist tracks at build/init time
                                          ↓
                               store tracks in component state
                                          ↓
                          render custom player UI (React)
                                          ↓
                    30-second preview MP3 via track.preview_url
                    (free, no auth, direct audio URL from Spotify API)
                    OR
                    Spotify embed iframe per track (display-only, no JS control)
```

The `preview_url` field on every track object from the Spotify Web API is a **direct 30-second MP3 URL** — no auth, no iframe, no CORS. `new Audio(track.preview_url)` just works. This is the playback engine.

---

## § 2 — TASK 1 (PRIORITY 1): SPICETIFY COMPLETE REBUILD

### 2.1 — Architecture Decision (implement exactly this)

```
┌──────────────────────────────────────────────────────┐
│  Spicetify.jsx                                        │
│                                                       │
│  Init:                                                │
│    1. Client Credentials → POST /api/token            │
│       → access_token (cached in component state,      │
│         refresh when expired)                         │
│    2. GET /playlists/{PLAYLIST_ID}/tracks             │
│       → parse into TrackNode[]                        │
│                                                       │
│  State (local, NOT Zustand — audio is ephemeral):    │
│    tracks[]         — full playlist                   │
│    currentIndex     — active track pointer            │
│    isPlaying        — boolean                         │
│    progress         — 0–1 float (from timeupdate)    │
│    volume           — 0–1 float                       │
│    audioRef         — useRef(new Audio())             │
│                                                       │
│  Playback engine:                                     │
│    audioRef.current = new Audio(tracks[i].preview_url)│
│    play / pause / next / prev via audioRef methods    │
│    timeupdate event → setProgress                     │
│    ended event → auto-advance to next track           │
└──────────────────────────────────────────────────────┘
```

### 2.2 — Environment Variables

The agent must add these to `.env` (Vite convention — prefix `VITE_`):

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
VITE_SPOTIFY_PLAYLIST_ID=your_playlist_id_here
```

**SECURITY WARNING the agent must surface to the user:**
The Client Secret in a Vite env var is exposed in the compiled bundle. For a personal portfolio this is acceptable risk (it cannot access private user data; the worst case is someone burns your API quota). If the user wants a hardened approach, the token fetch should be proxied through a Vercel Edge Function (`/api/spotify-token`). The agent must ask the user which approach they prefer before writing the token fetch logic.

### 2.3 — Token Fetch Options (agent presents both, awaits choice)

**Option A — Client-side (simple, bundle-exposed secret):**
```javascript
const getAccessToken = async () => {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(
        `${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`
      )}`
    },
    body: 'grant_type=client_credentials'
  });
  const data = await res.json();
  return data.access_token; // expires in 3600s
};
```

**Option B — Vercel Edge Function proxy (secret never in bundle):**
- Create `/api/spotify-token.js` at repo root (Vercel serverless function).
- `Spicetify.jsx` calls `fetch('/api/spotify-token')` instead of Spotify directly.
- Secret lives in Vercel environment variables dashboard only.

### 2.4 — Track Data Shape (what to extract from API response)

```javascript
// From GET /playlists/{id}/tracks, extract per item:
const parseTrack = (item) => ({
  id:         item.track.id,
  title:      item.track.name,
  artist:     item.track.artists.map(a => a.name).join(', '),
  album:      item.track.album.name,
  albumArt:   item.track.album.images[0]?.url ?? null,
  previewUrl: item.track.preview_url, // null if Spotify doesn't provide one
  duration:   item.track.duration_ms,
  spotifyUrl: item.track.external_urls.spotify
});
```

**Null preview_url handling:** Some tracks have no preview. The player must skip them automatically and mark them visually in the playlist as `[No Preview]` in a muted color. Do not crash.

### 2.5 — UI Spec (Windows 7 / WinAMP hybrid)

The component must render inside the existing `Window` wrapper. Internal layout:

```
┌─────────────────────────────────────────────┐
│  [Album Art 80x80]  Track Title             │
│                     Artist Name             │
│                     Album Name              │
│─────────────────────────────────────────────│
│  [◄◄]  [►/II]  [►►]         🔊 ──●────     │
│  ████████░░░░░░░░░░░░  0:18 / 0:30         │
│─────────────────────────────────────────────│
│  PLAYLIST (scrollable)                      │
│  ► 01  Bohemian Rhapsody – Queen            │
│    02  Blinding Lights – The Weeknd         │
│    03  [No Preview] Redbone – Childish...   │
│    ...                                      │
└─────────────────────────────────────────────┘
```

Requirements:
- Progress bar: clickable/draggable seek (for the 30s preview window).
- Volume slider: horizontal, right side of controls.
- Active track in playlist: highlighted with Aero blue accent, bold.
- Playlist: max-height with `overflow-y: auto` using a custom scrollbar styled to match the OS theme.
- Album art: `object-fit: cover`, fallback to a music note SVG icon if null.
- All controls use CSS variables from `globals.css` — no hardcoded Aero colors.
- Loading state: show a spinner inside the album art area while fetching tracks.
- Error state: if token fetch fails or playlist is 404, render a Windows-style error dialog inside the component (not a full modal — inline within the window content area).

### 2.6 — Commit target
`feat(spicetify): rebuild with Web API + preview_url playback engine`

---

## § 3 — TASK 2: CMD MINI-GAMES

**Scope:** Modify `CommandPrompt.jsx` only. No new files unless a game needs its own canvas component.

### 3.1 — New command registry additions

Add to the existing command switch/map:

| Command | Behavior |
|---|---|
| `format c:` | Triggers BSOD overlay (see Task 5) |
| `matrix` | Triggers Matrix screensaver (see Task 6) |
| `snake` | Launches Snake mini-game inside CMD window |
| `help` | Update existing help text to list new commands |

### 3.2 — Snake implementation spec

Snake renders inside the CMD window itself — NOT a new window. The terminal history area hides and is replaced by a `<canvas>` element at the same dimensions. On game over, canvas hides and terminal history restores with the final score appended as a terminal line.

```
Canvas: 400x280px (or match terminal inner width)
Grid: 20px cells
Tick: 150ms setInterval
Controls: WASD or arrow keys — must call e.preventDefault() to stop page scroll
Colors:
  Snake body: #00FF41 (matrix green — era-appropriate)
  Food: #FF6B35
  Background: #0C0C0C (CMD black)
  Grid lines: none
Score display: top-right corner, monospace, same green as snake
```

**Key constraint:** `keydown` listener must be scoped to the window when the CMD is focused (check `isFocused` from Zustand) and removed on cleanup. Do not attach global key listeners that persist after the window closes.

### 3.3 — Commit target
`feat(cmd): add snake game + matrix/bsod command hooks`

---

## § 4 — TASK 3: SOUNDBOARD.EXE

**New file:** `src/components/apps/Soundboard.jsx`
**New desktop icon + Start Menu entry required.**

### 4.1 — Sound assets

The agent must source these sounds from **freesound.org** (CC0 / public domain) or use Web Audio API to synthesize them if direct URLs are unavailable. Preferred approach: download to `public/assets/sounds/` at build time. The agent must list the exact files it intends to use and their licenses before writing the component.

Required sounds (minimum set):
- Windows XP startup chime
- Windows error (`error.wav` — the classic chord)
- Windows `tada.wav`
- Windows `notify.wav` (the soft ding)
- Dial-up modem handshake (the full sequence, ~8 seconds)
- Windows shutdown sound
- ICQ "uh-oh" message notification
- AOL "You've Got Mail"

### 4.2 — UI spec

```
3-column grid of sound buttons.
Each button:
  - Icon (Tabler or era-appropriate)
  - Label (sound name)
  - Visual feedback on click: button briefly "pressed" (inset bevel)
  - Audio: Web Audio API AudioContext — NOT HTML <audio> tags.
    Use AudioContext to decode and play ArrayBuffer from fetch().
    This avoids multiple simultaneous <audio> element memory leaks.

Window size: ~420px × 360px default.
No minimize-to-nothing; treat like any other app window.
```

### 4.3 — Commit target
`feat(soundboard): new Soundboard.exe app with Web Audio playback`

---

## § 5 — TASK 4: LIVE TASK MANAGER UPGRADE

**Scope:** Modify `TaskManager.jsx` only.

### 5.1 — Current state assumption
`TaskManager.jsx` is a static replica. It shows hardcoded process rows.

### 5.2 — Target state

Wire `useWindowStore` into `TaskManager`. The Processes tab must:

1. Render one row per open window in `windowStack`, pulling `id`, `title`, and `component` name.
2. Add a functional **End Task** button per row that calls `closeWindow(id)`.
3. Add a **CPU column** that shows a fake but animated percentage — each open window gets a random baseline (2–15%) that jitters ±1% per second via a `setInterval`. More windows = higher total CPU. Closes a window → its row disappears and total CPU drops.
4. Add a **Performance tab** with two animated sparkline charts:
   - CPU Usage History: samples `windowStack.length * randomJitter` every 2 seconds, renders last 30 samples as a canvas line chart (use the existing `<canvas>` approach from `MSPaint`, or import recharts `<LineChart>` — agent's choice, pick the lighter one).
   - Memory Usage: same pattern, different baseline curve.
5. Charts must be styled with Aero Glass: dark background (`#0D0D0D`), green line (`#00B050`), gridlines at 25/50/75%.

### 5.3 — Commit target
`feat(taskmanager): wire live window data, end task, performance charts`

---

## § 6 — TASK 5: BSOD EASTER EGG

**New file:** `src/components/shared/BSOD.jsx`
**Trigger:** `format c:` command in CMD (hooked in Task 2).

### 6.1 — Spec

```javascript
// BSOD is a fullscreen overlay, z-index: 99999
// Renders above everything including all windows

// Content (Windows XP BSOD style):
// - Solid blue background (#0000AA)
// - White Tahoma text, ~16px
// - Header line: "A problem has been detected and Windows has been shut down..."
// - Custom stop code: *** STOP: 0x0000SPCY (0xSP1CYF4LC0N)
// - Body text (generic XP BSOD boilerplate + one personalized line)
// - Footer: "Press any key to restart your portfolio."

// Behavior:
// - Any keypress or click → fade out over 500ms → restore desktop
// - DO NOT unmount the windows underneath — they all persist
// - After restore: CMD prints "Nice try. C:\ is intact." in terminal history
```

### 6.2 — Trigger mechanism
Add a `showBSOD` boolean + `triggerBSOD()` action to `useWindowStore` (or a new `useSystemStore` if one exists). `BSOD.jsx` reads this state and conditionally renders. `CommandPrompt.jsx` calls `triggerBSOD()` when it parses `format c:`.

### 6.3 — Commit target
`feat(bsod): fullscreen easter egg triggered by CMD format c:`

---

## § 7 — TASK 6: MATRIX SCREENSAVER + NOTEPAD CHAIN

**New file:** `src/components/shared/MatrixScreensaver.jsx`
**Trigger:** `matrix` command in CMD.

### 7.1 — Canvas rain spec

```
- Fullscreen canvas overlay, z-index: 99998 (below BSOD, above windows)
- Characters: katakana block (U+30A0–U+30FF) + digits 0-9, random per cell
- Columns: Math.floor(canvas.width / 20) columns, 20px monospace font
- Each column has an independent y-pointer and speed (randomized)
- Each frame: fillRect with rgba(0, 0, 0, 0.05) for trail fade effect
- Character color: #00FF41 for leading char, #00AA20 for trail
- Font: 'Courier New' or 'monospace' — Consolas preferred if available
- requestAnimationFrame loop — NOT setInterval (smoother)
```

### 7.2 — Exit + chain behavior

```
Exit trigger: any key press OR mouse click
On exit:
  1. Fade out canvas over 800ms
  2. Unmount MatrixScreensaver
  3. After 300ms: open a NEW Notepad window via openWindow()
     - Title: "message.txt"
     - Initial content: "Wake up, [name]...\n\nThe Matrix has you.\n\nFollow the white rabbit."
     - Replace [name] with the portfolio owner's name — hardcode it.
  4. After 3000ms: imperatively update that Notepad window's title in the store to "You have been unplugged."
     - This requires either: a) a Zustand action updateWindowTitle(id, title),
       or b) storing a ref to the window ID and patching the store slice directly.
       Agent picks the cleaner option.
```

### 7.3 — Commit target
`feat(matrix): canvas screensaver + notepad chain easter egg`

---

## § 8 — TASK 7: WALLPAPER PICKER (CONTROL PANEL EXPANSION)

**Scope:** Expand existing `ControlPanel` or add a new `DisplayProperties.jsx` launched from Control Panel.

### 8.1 — Wallpaper assets (agent sources these)

The agent must locate and add to `public/assets/wallpapers/`:
- `bliss.jpg` — the XP green hill (use a free recreation, not the original copyrighted photo)
- `azul.jpg` — blue XP default
- `teal.png` — solid #008080 (generate as a 1x1 PNG or CSS only)
- `aurora.jpg` — Windows 7 Aurora default
- `custom.jpg` — placeholder for user upload

The agent must verify licenses before committing any image asset. Fallback: generate a CSS gradient approximation for each and skip the image files entirely if no clean-license versions are found.

### 8.2 — Control Panel dialog spec

```
Dialog style: Windows 7 "Display Properties" — two-column layout.
Left column: thumbnail grid of wallpaper options (80x50px previews).
Right column: live preview pane showing the desktop with the selected paper.
Bottom: [Apply] [Cancel] buttons.

On Apply:
  useConfigStore.setWallpaper(selectedWallpaper)
  Desktop.jsx reads wallpaper from useConfigStore and applies it as
  background-image (or background-color for solid colors).
  Persists to localStorage.
```

### 8.3 — Commit target
`feat(controlpanel): display properties dialog + wallpaper persistence`

---

## § 9 — TASK 8: CLIPPY (STRETCH GOAL — DO LAST)

**New file:** `src/components/shared/Clippy.jsx`

This is the lowest priority task. Only start it after Tasks 1–7 are complete and committed.

### 9.1 — Trigger logic
```
- On mount, set a 30s inactivity timer (reset on mousemove/keydown).
- On timer fire: show Clippy.
- Also show on: first open of any app (first-time tips, dismissed after once per app).
- User can right-click Clippy → context menu: "Hide", "Options", "What is this thing?".
```

### 9.2 — SVG Clippy
The agent must draw Clippy as an inline SVG (not sourced from a copyrighted image). A minimalist vector approximation: bent paperclip with two googly eyes. CSS `@keyframes` for:
- Idle blink (every 3–5s, random)
- Entrance: slide up from bottom-right corner
- Speaking: slight bob animation while speech bubble is visible

### 9.3 — Speech bubble messages (hardcode an array, rotate randomly)
```javascript
const CLIPPY_LINES = [
  "It looks like you're viewing a portfolio. Want help with that?",
  "I see you've opened Minesweeper. Don't you have a recruiter to impress?",
  "Your C: drive is fine. I checked.",
  "Did you know? You can drag these windows.",
  "Pro tip: There's a secret in the terminal.",
  "I'm not just decoration. ...Mostly.",
];
```

### 9.4 — Commit target
`feat(clippy): animated Clippy overlay with idle trigger + speech bubble`

---

## § 10 — EXECUTION ORDER & GATE RULES

```
TASK 1 (Spicetify) ──► COMPLETE + COMMIT ──► TASK 2 (CMD)
TASK 2             ──► COMPLETE + COMMIT ──► TASK 3 (Soundboard)
TASK 3             ──► COMPLETE + COMMIT ──► TASK 4 (Task Manager)
TASK 4             ──► COMPLETE + COMMIT ──► TASK 5 (BSOD)
TASK 5             ──► COMPLETE + COMMIT ──► TASK 6 (Matrix)
TASK 6             ──► COMPLETE + COMMIT ──► TASK 7 (Wallpaper)
TASK 7             ──► COMPLETE + COMMIT ──► TASK 8 (Clippy) [optional]
```

**Gate rule:** After each task, output a completion report:
```
✓ TASK N COMPLETE
Files modified: [list]
Files created: [list]
Commit message: [exact string]
Known issues / deferred: [any]
Ready for TASK N+1? Awaiting your signal.
```

Do not advance to the next task until the user explicitly says "next", "go", "approved", or equivalent.

---

## § 11 — CROSS-CUTTING CODE STANDARDS (APPLY TO ALL TASKS)

- All new components must consume only CSS variables from `globals.css`. No hardcoded Aero hex values inside component files.
- No new npm packages without asking first. Preferred: solve with existing deps (React, Zustand, Web Audio API, Canvas API).
- Exception: if a charting library is genuinely needed for Task 4 sparklines and `recharts` is already installed, use it. Verify with `package.json` first.
- All `useEffect` cleanup functions must be complete: clear intervals, cancel animation frames, remove event listeners, pause and null audio refs.
- Accessibility minimum: all interactive elements (buttons, sliders, playlist rows) get `aria-label` or `aria-labelledby`. Not negotiable.
- No `console.log` left in committed code.

---

## § 12 — FIRST ACTION

Do not greet. Do not summarize this document.

Execute § 2 (Task 1) immediately. First action: present the user with the two token security options (§ 2.3 Option A vs Option B) and await their choice. Once they choose, begin writing code.
