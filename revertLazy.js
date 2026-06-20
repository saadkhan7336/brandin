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

function revertFile(filePath) {
    if (!filePath.endsWith('.jsx')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix the specific broken tags
    content = content.replace(/\/ loading="lazy" decoding="async"\/>/g, '/>');
    content = content.replace(/\/ fetchpriority="high"\/>/g, '/>');
    content = content.replace(/loading="lazy" decoding="async"\/>/g, '/>');
    content = content.replace(/fetchpriority="high"\/>/g, '/>');
    content = content.replace(/ loading="lazy" decoding="async">/g, '>');
    content = content.replace(/ fetchpriority="high">/g, '>');

    if (original !== content) {
        fs.writeFileSync(filePath, content);
        console.log('Reverted:', filePath);
    }
}

walkDir(srcDir, revertFile);
console.log('Done reverting lazy loading changes.');
