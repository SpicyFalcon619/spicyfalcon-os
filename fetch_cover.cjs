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
    const coverArtUrl = data.props.pageProps.state.data.entity.coverArt.sources[0].url;
    console.log('Cover Art URL:', coverArtUrl);
  });
