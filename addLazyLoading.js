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

    const isHeroImage = (imgTag) => {
        return imgTag.includes('alt="Cover"') || 
               imgTag.includes('w-44 h-44') || // MyProfileView hero avatar
               imgTag.includes('h-56'); // InfluencerProfile hero cover
    };

    let modified = content.replace(/<img([^>]+)\/?>/g, (match, attrs) => {
        if (attrs.includes('loading=') || attrs.includes('decoding=')) {
            return match;
        }

        let newAttrs = attrs;

        if (isHeroImage(match)) {
            newAttrs += ' fetchpriority="high"';
        } else {
            newAttrs += ' loading="lazy" decoding="async"';
        }

        if (match.endsWith('/>')) {
            return `<img${newAttrs}/>`;
        } else {
            return `<img${newAttrs}>`;
        }
    });

    if (original !== modified) {
        fs.writeFileSync(filePath, modified);
        console.log('Modified:', filePath);
    }
}

walkDir(srcDir, processFile);
console.log('Done processing JSX files for lazy loading.');
