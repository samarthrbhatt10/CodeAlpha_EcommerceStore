const fs = require('fs');
const path = require('path');
const pub = path.join(__dirname, 'public');
const pages = ['home.html','catalog.html','cart.html','pdp.html','profile.html','settings.html'];

pages.forEach(p => {
  const fp = path.join(pub, p);
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;

  // Remove neo-shadow / neo-shadow-sm from <header> elements
  html = html.replace(/<header([^>]*?)neo-shadow([^>]*?)>/g, '<header$1$2>');
  html = html.replace(/<header([^>]*?)neo-shadow-sm([^>]*?)>/g, '<header$1$2>');

  if (html !== before) {
    fs.writeFileSync(fp, html);
    console.log('✅ Cleaned neo-shadow from header in', p);
  } else {
    console.log('  No neo-shadow on header in', p);
  }
});
console.log('\nDone. Headers are now safe from transform micro-interactions.');
