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

    // Fix the arrow function breakage
    content = content.replace(/=\s+width="\d+"\s+height="\d+">/g, '=>');
    content = content.replace(/=\swidth="\d+"\sheight="\d+">/g, '=>');
    content = content.replace(/=width="\d+"\sheight="\d+">/g, '=>');
    
    // Some might have been inserted with a space: `= width="56" height="56">`
    content = content.replace(/=\s*width="\d+"\s*height="\d+"\s*>/g, '=>');

    if (original !== content) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed arrow functions in:', filePath);
    }
}

walkDir(srcDir, processFile);
console.log('Done fixing arrow functions.');
