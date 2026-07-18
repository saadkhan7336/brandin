const fs = require('fs');
const path = require('path');

const srcDir = '/Users/samiafzal/.gemini/antigravity-ide/brain/5e000a7c-f9c9-43df-ad4b-e4cdc0d90095';
const destDir = path.join(__dirname, 'public', 'images', 'about');

fs.mkdirSync(destDir, { recursive: true });

const files = [
  { src: 'founder_sami_1784319328047.png', dest: 'founder-sami.png' },
  { src: 'founder_saad_1784319337774.png', dest: 'founder-saad.png' },
];

files.forEach(({ src, dest }) => {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${dest}`);
  } catch (err) {
    console.error(`Failed to copy ${dest}: ${err.message}`);
  }
});

console.log('Done!');
