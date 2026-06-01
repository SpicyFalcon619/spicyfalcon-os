import React from 'react';

const RetroSpotify = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#121212' }}>
      <div style={{ padding: '15px 20px', borderBottom: '1px solid #282828', backgroundColor: '#000' }}>
        <h2 style={{ color: '#1db954', margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🎧</span> 2010s Nostalgia Radio
        </h2>
      </div>
      
      <div style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <iframe 
          style={{ borderRadius: '12px' }} 
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DXc6IFF23C9jj?utm_source=generator&theme=0" 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allowFullScreen="" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
          title="Spotify Web Player"
        ></iframe>
      </div>
    </div>
  );
};

export default RetroSpotify;
