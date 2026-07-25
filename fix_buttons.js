const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'public');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  let changed = false;

  // Add global-cart-btn class to any button containing shopping_bag icon
  content = content.replace(/<button([^>]*)>(?:\s*<span[^>]*>shopping_bag<\/span>\s*|\s*shopping_bag\s*)/g, (match, p1) => {
    if (!p1.includes('global-cart-btn')) {
      changed = true;
      if (p1.includes('class="')) {
        return match.replace('class="', 'class="global-cart-btn ');
      } else {
        return match.replace('<button', '<button class="global-cart-btn"');
      }
    }
    return match;
  });

  // Also replace old onclick="/cart" buttons
  content = content.replace(/<button([^>]*)onclick=["']window\.location\.href=['"]\/?cart['"]["']([^>]*)>/g, (match, p1, p2) => {
      changed = true;
      let newBtn = `<button${p1}${p2}>`;
      if (newBtn.includes('class="')) {
          newBtn = newBtn.replace('class="', 'class="global-cart-btn ');
      } else {
          newBtn = newBtn.replace('<button', '<button class="global-cart-btn"');
      }
      return newBtn;
  });

  // Add global-login-btn class to any button containing LOGIN (text exactly)
  content = content.replace(/<button([^>]*)>(\s*LOGIN\s*)<\/button>/g, (match, p1, p2) => {
    if (!p1.includes('global-login-btn')) {
      changed = true;
      if (p1.includes('class="')) {
          return match.replace('class="', 'class="global-login-btn ');
      } else {
          return match.replace('<button', '<button class="global-login-btn"');
      }
    }
    return match;
  });
  
  if (changed) {
    fs.writeFileSync(path.join(dir, file), content);
    console.log('Fixed buttons in ' + file);
  }
});
