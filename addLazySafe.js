const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.jsx')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // We replace `<img ` and `<img\n` with `<img loading="lazy" decoding="async" `
    // First, let's make sure we don't duplicate it.
    if (!content.includes('loading="lazy"')) {
        content = content.replace(/<img\s/g, '<img loading="lazy" decoding="async" ');
        
        // Now find the known hero images and swap them to fetchpriority="high"
        // This is a bit tricky, but we can look for specific classNames or alt tags if needed.
        // Actually it's easier to just apply lazy everywhere and I will fix the 3 hero images manually.

        if (original !== content) {
            fs.writeFileSync(filePath, content);
            console.log('Modified:', filePath);
        }
    }
}

walkDir(srcDir, processFile);
console.log('Done lazy loading.');
