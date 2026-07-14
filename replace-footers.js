const fs = require('fs');
const path = require('path');

const targetFiles = [
  'FeaturesPage.jsx',
  'HelpCenterPage.jsx',
  'CaseStudiesPage.jsx',
  'BlogPage.jsx',
  'ContactPage.jsx',
  'AboutUsPage.jsx',
  'PrivacyPolicyPage.jsx',
  'features/AnalyticsPage.jsx',
  'features/CampaignManagement.jsx',
  'features/FindMatchPage.jsx',
  'features/VerifiedProfilesPage.jsx'
];

targetFiles.forEach(fileRel => {
  const filePath = path.join(__dirname, 'src/pages', fileRel);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already imported
  if (content.includes('LandingFooter')) {
    console.log(`Already has LandingFooter: ${fileRel}`);
    return;
  }

  // 1. Add import
  // Find the last import statement
  const importRegex = /^import\s+.*?;?\s*$/gm;
  let lastMatch = null;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    lastMatch = match;
  }
  
  const importStmt = `\nimport LandingFooter from '${fileRel.includes('/') ? '../../' : '../'}components/layout/LandingFooter';\n`;
  if (lastMatch) {
    const insertPos = lastMatch.index + lastMatch[0].length;
    content = content.slice(0, insertPos) + importStmt + content.slice(insertPos);
  } else {
    content = importStmt + content;
  }

  // 2. Replace or Insert Footer
  const footerRegex = /\{\/\*\s*Footer.*?\*\/\}\s*<footer[\s\S]*?<\/footer>/;
  const rawFooterRegex = /<footer[\s\S]*?<\/footer>/;

  if (footerRegex.test(content) || rawFooterRegex.test(content)) {
    // Replace existing footer
    content = content.replace(footerRegex, '<LandingFooter />');
    content = content.replace(rawFooterRegex, '<LandingFooter />');
  } else {
    // Insert before the last </div> before the final export or end of component
    // Typically the last </div> is the root div of the return statement.
    const lastDivRegex = /<\/div>\s*\)\s*;\s*\}\s*$/;
    if (lastDivRegex.test(content)) {
      content = content.replace(lastDivRegex, '  <LandingFooter />\n    </div>\n  );\n}\n');
    } else {
       // alternative: last </div> in the file
       const lastIndex = content.lastIndexOf('</div>');
       if (lastIndex !== -1) {
           content = content.slice(0, lastIndex) + '  <LandingFooter />\n    ' + content.slice(lastIndex);
       }
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${fileRel}`);
});
