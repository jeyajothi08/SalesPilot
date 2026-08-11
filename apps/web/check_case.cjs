const fs = require('fs');
const path = require('path');

function checkDir(dir) {
  let issues = 0;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      issues += checkDir(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
          const resolvedDir = path.dirname(path.resolve(dir, importPath));
          const baseName = path.basename(importPath);
          
          try {
             const actualFiles = fs.readdirSync(resolvedDir);
             const exactMatch = actualFiles.find(f => f === baseName || f === baseName + '.js' || f === baseName + '.jsx' || f.startsWith(baseName + '.'));
             const caseInsensitiveMatch = actualFiles.find(f => f.toLowerCase() === baseName.toLowerCase() || f.toLowerCase() === baseName.toLowerCase() + '.js' || f.toLowerCase() === baseName.toLowerCase() + '.jsx' || f.toLowerCase().startsWith(baseName.toLowerCase() + '.'));
             
             if (!exactMatch && caseInsensitiveMatch) {
               console.log('Case mismatch in ' + fullPath + ': imported ' + importPath + ' but actual file is ' + caseInsensitiveMatch);
               issues++;
             }
          } catch {}
        }
      }
    }
  }
  return issues;
}
const total = checkDir('src');
console.log('Total issues: ' + total);
