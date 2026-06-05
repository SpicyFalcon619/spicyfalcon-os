const https = require('https');
const fs = require('fs');
const path = require('path');

const wallpapers = [
  { name: 'windows7-bg.jpg', url: 'https://raw.githubusercontent.com/B00merang-Project/Windows-7/master/wallpaper.jpg' },
  { name: 'architecture.jpg', url: 'https://archive.org/download/windows-7-wallpapers/Architecture/img1.jpg' },
  { name: 'characters.jpg', url: 'https://archive.org/download/windows-7-wallpapers/Characters/img7.jpg' },
  { name: 'landscapes.jpg', url: 'https://archive.org/download/windows-7-wallpapers/Landscapes/img13.jpg' },
  { name: 'nature.jpg', url: 'https://archive.org/download/windows-7-wallpapers/Nature/img19.jpg' },
  { name: 'scenes.jpg', url: 'https://archive.org/download/windows-7-wallpapers/Scenes/img25.jpg' }
];

const destDir = path.join(__dirname, 'public', 'assets', 'wallpapers');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const wp of wallpapers) {
    console.log(`Downloading ${wp.name}...`);
    try {
      await download(wp.url, path.join(destDir, wp.name));
      console.log(`Successfully downloaded ${wp.name}`);
    } catch (e) {
      console.error(`Error downloading ${wp.name}: ${e.message}`);
    }
  }
}

main();
