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

    // Fix the specific broken tags: / width="60" height="60"/>
    // We want to remove the floating / before the width.
    content = content.replace(/\/\s*(width="\d+"\s*height="\d+")\s*\/>/g, ' $1 />');
    
    // Also catch cases where it might be `//>` just in case
    content = content.replace(/\/\/>/g, '/>');

    if (original !== content) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed:', filePath);
    }
}

walkDir(srcDir, processFile);
console.log('Done fixing dimension syntax errors.');
