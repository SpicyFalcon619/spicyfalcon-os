const fs = require('fs');
const path = require('path');
const https = require('https');

const iconLinks = {
  'notepad.png': 'https://iconarchive.com/download/i107026/dakirby309/windows-8-metro/Apps-Notepad-Metro.ico', 
  'paint.png': 'https://iconarchive.com/download/i107018/dakirby309/windows-8-metro/Apps-Paint-Metro.ico', 
  'task-manager.png': 'https://iconarchive.com/download/i106979/dakirby309/windows-8-metro/Apps-Task-Manager-Metro.ico',
  'device-manager.png': 'https://iconarchive.com/download/i106977/dakirby309/windows-8-metro/Apps-Device-Manager-Metro.ico',
  'photo-viewer.png': 'https://iconarchive.com/download/i107019/dakirby309/windows-8-metro/Apps-Photos-Metro.ico',
  'spicetify.png': 'https://iconarchive.com/download/i107040/dakirby309/windows-8-metro/Apps-Spotify-Metro.ico',
  'minesweeper.png': 'https://iconarchive.com/download/i106927/dakirby309/windows-8-metro/Games-Minesweeper-Metro.ico',
  'cmd.png': 'https://iconarchive.com/download/i106974/dakirby309/windows-8-metro/Apps-Command-Prompt-Metro.ico',
  'computer.png': 'https://iconarchive.com/download/i106976/dakirby309/windows-8-metro/Apps-Computer-Metro.ico',
  'control-panel.png': 'https://iconarchive.com/download/i106975/dakirby309/windows-8-metro/Apps-Control-Panel-Metro.ico',
  'recycle-bin.png': 'https://iconarchive.com/download/i106981/dakirby309/windows-8-metro/Apps-Recycle-Bin-Metro.ico',
  'explorer.png': 'https://iconarchive.com/download/i106978/dakirby309/windows-8-metro/Apps-File-Explorer-Metro.ico',
  'ie.png': 'https://iconarchive.com/download/i107005/dakirby309/windows-8-metro/Apps-Internet-Explorer-Metro.ico',
  'calculator.png': 'https://iconarchive.com/download/i106973/dakirby309/windows-8-metro/Apps-Calculator-Metro.ico',
  'winver.png': 'https://iconarchive.com/download/i106985/dakirby309/windows-8-metro/Apps-Windows-Metro.ico'
};

const dest = path.join(__dirname, 'public', 'assets', 'icons');
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

for (const [filename, url] of Object.entries(iconLinks)) {
  const filePath = path.join(dest, filename);
  const file = fs.createWriteStream(filePath);
  https.get(url, (response) => {
    if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
      if (response.statusCode > 300) {
        https.get(response.headers.location, (res) => {
          res.pipe(file);
        });
      } else {
        response.pipe(file);
      }
    }
  });
}

console.log('Downloading icons...');
