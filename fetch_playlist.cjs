const fs = require('fs');
fetch('https://open.spotify.com/embed/playlist/0ySxXCcrWyvr4ZLiPDR5JD')
  .then(res => res.text())
  .then(html => {
    const startStr = '<script id="__NEXT_DATA__" type="application/json">';
    const parts = html.split(startStr);
    if (parts.length < 2) {
      console.log('No next data found');
      return;
    }
    const jsonStr = parts[1].split('</script>')[0];
    const data = JSON.parse(jsonStr);
    const tracks = data.props.pageProps.state.data.entity.trackList;
    const mapped = tracks.map(t => ({
      id: t.id,
      title: t.title,
      artist: t.subtitle,
      albumArt: t.coverArt?.sources?.[0]?.url,
      previewUrl: t.audioPreview?.url,
      duration: t.duration,
      spotifyUrl: t.uri
    })).filter(t => t.previewUrl);
    
    if (!fs.existsSync('src/data')) {
      fs.mkdirSync('src/data');
    }
    fs.writeFileSync('src/data/playlist.json', JSON.stringify(mapped, null, 2));
    console.log('Saved', mapped.length, 'tracks to src/data/playlist.json');
  })
  .catch(console.error);
