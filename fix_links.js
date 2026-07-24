const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'public');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  if (file !== 'cart.html') {
    content = content.replace(/onclick="toggleCart\(\)"/g, 'onclick="window.location.href=\'/cart\'"');
  } else {
    // Modify cart.html to be open by default
    content = content.replace('translate-x-full', '');
    content = content.replace('opacity-0 pointer-events-none', 'opacity-100 pointer-events-auto');
    content = content.replace(/function toggleCart\(\) \{[\s\S]*?\}/, 'function toggleCart() { window.location.href = \'/catalog\'; }');
  }

  // Replace links that go nowhere
  content = content.replace(/href="#"/g, 'href="/catalog"');

  fs.writeFileSync(path.join(dir, file), content);
});
console.log('Done fixing links');
