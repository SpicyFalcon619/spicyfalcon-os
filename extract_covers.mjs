import fs from 'fs';
import path from 'path';
import NodeID3 from 'node-id3';

const playlistPath = './src/data/playlist.json';
const audioDir = './public/audio';
const coversDir = './public/covers';

if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

let playlist = JSON.parse(fs.readFileSync(playlistPath, 'utf8'));

for (let track of playlist) {
  if (track.previewUrl) {
    const filename = path.basename(track.previewUrl);
    const audioPath = path.join(audioDir, filename);
    if (fs.existsSync(audioPath)) {
      const tags = NodeID3.read(audioPath);
      if (tags && tags.image && tags.image.imageBuffer) {
        const coverFilename = filename.replace('.mp3', '.jpg');
        const coverPath = path.join(coversDir, coverFilename);
        fs.writeFileSync(coverPath, tags.image.imageBuffer);
        track.albumArt = '/covers/' + coverFilename;
        console.log(`Extracted cover for ${filename}`);
      } else {
        console.log(`No embedded cover for ${filename}`);
      }
    }
  }
}

fs.writeFileSync(playlistPath, JSON.stringify(playlist, null, 2));
console.log('Finished extracting covers and updating playlist.json');
