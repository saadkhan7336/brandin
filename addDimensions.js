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

    // fix the `//>` syntax error first
    content = content.replace(/\/\/>/g, '/>');

    // Add dimensions again
    let modified = content.replace(/<img([^>]+)>/g, (match, attrs) => {
        // Remove trailing slash if present
        let cleanAttrs = attrs;
        let isSelfClosing = false;
        if (cleanAttrs.endsWith('/')) {
            isSelfClosing = true;
            cleanAttrs = cleanAttrs.slice(0, -1).trim();
        }

        if (cleanAttrs.includes('width=') || cleanAttrs.includes('height=')) {
            return match; // Already processed
        }

        let width = null;
        let height = null;

        const classMatch = cleanAttrs.match(/className=["']([^"']+)["']/);
        if (classMatch) {
            const classes = classMatch[1].split(' ');
            
            for (let c of classes) {
                const wMatch = c.match(/^w-(\d+)$/);
                if (wMatch) width = parseInt(wMatch[1], 10) * 4;
                
                const hMatch = c.match(/^h-(\d+)$/);
                if (hMatch) height = parseInt(hMatch[1], 10) * 4;
                
                const wPxMatch = c.match(/^w-\[(\d+)px\]$/);
                if (wPxMatch) width = parseInt(wPxMatch[1], 10);
                
                const hPxMatch = c.match(/^h-\[(\d+)px\]$/);
                if (hPxMatch) height = parseInt(hPxMatch[1], 10);
            }
        }

        let newAttrs = cleanAttrs;
        if (width && height) {
            newAttrs += ` width="${width}" height="${height}"`;
        }

        if (isSelfClosing) {
            return `<img ${newAttrs} />`;
        } else {
            return `<img ${newAttrs}>`;
        }
    });

    if (original !== modified) {
        fs.writeFileSync(filePath, modified);
        console.log('Modified:', filePath);
    }
}

walkDir(srcDir, processFile);
console.log('Done fixing dimensions syntax.');
