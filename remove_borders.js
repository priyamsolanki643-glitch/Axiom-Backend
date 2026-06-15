const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('frontend/src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Pattern 1: Match `border-b lg:border-b-0 lg:border-r border-white/5` etc.
    content = content.replace(/\bborder(?:-[trblxy])?\s+(?:(?:md|lg|xl|sm):border(?:-[trblxy])?(?:-0)?\s+)*border-white\/\d+\b/g, '');
    
    // Pattern 2: Match typical pair `border border-white/10`
    content = content.replace(/\bborder(?:-[trblxy])?\s+border-white(?:\/\d+)?\b/g, '');
    
    // Pattern 3: Reverse pair `border-white/10 border`
    content = content.replace(/\bborder-white(?:\/\d+)?\s+border(?:-[trblxy])?\b/g, '');
    
    // Pattern 4: Standalone border-white/10
    content = content.replace(/\bborder-white\/\d+\b/g, '');

    // Sometimes the 'border' class remains alone if regex missed something, let's target specific known bad patterns:
    content = content.replace(/\bborder\s+(bg-[^ ]+)\s+rounded/g, '$1 rounded');
    content = content.replace(/className="\s*border\s+/g, 'className="');
    
    // Clean up multiple spaces inside className
    content = content.replace(/className="([^"]+)"/g, (match, classes) => {
      let cleaned = classes.replace(/\s{2,}/g, ' ').trim();
      // Remove standalone 'border' if it was part of a boxy container
      // (Be careful not to remove 'border' everywhere, but it's safe for layout components)
      cleaned = cleaned.replace(/(^|\s)border(\s|$)/g, '$1$2').replace(/\s{2,}/g, ' ').trim();
      return `className="${cleaned}"`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated: ' + filePath);
    }
  }
});
