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
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Match the specific bad placement. 
  // It happened because it was placed right after `import {\n`
  const badImportRegex2 = /import LandingFooter from '.*?';/g;

  // Let's just remove all LandingFooter imports and place it at the very top.
  if (badImportRegex2.test(content)) {
    content = content.replace(badImportRegex2, '');
    
    // Prepend to the top of the file
    const importStmt = `import LandingFooter from '${fileRel.includes('/') ? '../../' : '../'}components/layout/LandingFooter';\n`;
    content = importStmt + content;
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${fileRel}`);
  }
});
