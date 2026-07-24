const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'public');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  if (!content.includes('<script src="/js/main.js"></script>')) {
    content = content.replace('</body>', '<script src="/js/main.js"></script>\n</body>');
    fs.writeFileSync(path.join(dir, file), content);
  }
});
console.log('Injected main.js script');
