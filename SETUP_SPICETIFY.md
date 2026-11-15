# How to Setup Spicetify API Keys

Good news! Your visitors **DO NOT** need to enter any information. You only need to set this up once on your end. The app uses your keys to silently fetch a temporary access token for all your visitors.

Here is how you get your keys:

### 1. Create a Spotify App
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and log in with your Spotify account.
2. Click **"Create app"**.
3. Fill in the details:
   - **App name**: `Portfolio-Spicetify`
   - **App description**: `My personal portfolio web player`
   - **Website**: `http://localhost:5173`
   - **Redirect URI**: `http://localhost:5173/callback` (We don't actually use this for Client Credentials, but Spotify requires you to fill it out)
4. Check the agreement box and click **Save**.

### 2. Get Your Keys
1. In your new app's dashboard, click **Settings**.
2. You will see your **Client ID**. Copy this.
3. Click **"View client secret"** to reveal your **Client Secret**. Copy this too.

### 3. Add the keys on the server, never in the browser
The keys are read by the serverless function `api/playlist.js`, so the client secret never reaches the browser. Do **not** give them a `VITE_` prefix: Vite copies every `VITE_` variable into the public JavaScript bundle.

In Vercel, open **Project Settings, then Environment Variables**, and add:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_PLAYLIST_ID=37i9dQZF1DXcBWIGoYBM5M
```

*(The playlist ID above is "Today's Top Hits"; any public playlist works. The ID is in its share URL: `https://open.spotify.com/playlist/[PLAYLIST_ID]?si=...`)*

Then redeploy. Locally, `npm run dev` has no `/api` route, so Spicetify uses the saved fallback playlist; run `vercel dev` to test the live one.


