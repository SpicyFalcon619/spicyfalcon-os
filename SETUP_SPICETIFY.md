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

### 3. Add to your `.env` File
Create a file named `.env` in the root of your project (where `package.json` is). Add the keys like this:

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
VITE_SPOTIFY_PLAYLIST_ID=37i9dQZF1DXcBWIGoYBM5M
```

*(Note: The playlist ID above is "Today's Top Hits", but you can replace it with the ID of any public playlist! You can find a playlist ID in its share URL: `https://open.spotify.com/playlist/[PLAYLIST_ID]?si=...`)*

### 4. Deploying to Vercel
When you deploy this to Vercel, you must add these exact same variables to your Vercel project's **Environment Variables** settings.

Once you restart your local dev server (`npm run dev`), Spicetify will start playing music!
