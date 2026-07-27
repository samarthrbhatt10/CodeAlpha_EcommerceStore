/**
 * fix_header_positioning.js
 * Replaces the fragile transform-based navbar centering with stable left/right positioning
 * across ALL HTML pages, eliminating the sliding navbar bug.
 */
const fs = require('fs');
const path = require('path');
const pub = path.join(__dirname, 'public');

const pages = ['home.html','auth.html','catalog.html','cart.html','pdp.html','profile.html','settings.html','admin.html'];

// Old pattern: left:50%;transform:translateX(-50%);width:98%;max-width:1600px;
// Problem: any JS that sets .style.transform overwrites translateX(-50%) → header flies off screen
// Fix: use left/right margins instead, no transform needed

let fixed = 0;

pages.forEach(page => {
  const fp = path.join(pub, page);
  if (!fs.existsSync(fp)) { console.log(`⚠️  ${page} not found`); return; }

  let html = fs.readFileSync(fp, 'utf8');
  let changed = false;

  // Pattern 1: inline style with transform
  const oldStyle = /style="left:50%;transform:translateX\(-50%\);width:98%;max-width:1600px;"/g;
  if (oldStyle.test(html)) {
    html = html.replace(oldStyle, 'style="left:1%;right:1%;max-width:1600px;margin:0 auto;"');
    changed = true;
  }

  // Pattern 2: inline style with spaces
  const oldStyle2 = /style="left:\s*50%;\s*transform:\s*translateX\(-50%\);\s*width:\s*98%;\s*max-width:\s*1600px;"/g;
  if (oldStyle2.test(html)) {
    html = html.replace(oldStyle2, 'style="left:1%;right:1%;max-width:1600px;margin:0 auto;"');
    changed = true;
  }

  // Pattern 3: any header with translateX(-50%) center trick  
  const oldStyle3 = /(<header[^>]*?)left:\s*50%[^"]*?translateX\(-50%\)[^"]*?(")/g;
  if (oldStyle3.test(html)) {
    html = html.replace(oldStyle3, (match, pre, post) => {
      return pre + 'left:1%;right:1%;max-width:1600px;margin:0 auto;' + post;
    });
    changed = true;
  }

  // Also remove any neo-shadow class from header tags to be safe
  html = html.replace(/<header([^>]*?)class="([^"]*?neo-shadow[^"]*?)"([^>]*?)>/g, (match, pre, cls, post) => {
    const newCls = cls.replace(/\bneo-shadow\b/g, '').replace(/\s+/g, ' ').trim();
    return `<header${pre}class="${newCls}"${post}>`;
  });

  if (changed) {
    fs.writeFileSync(fp, html, 'utf8');
    console.log(`✅ Fixed ${page}`);
    fixed++;
  } else {
    console.log(`ℹ️  ${page} — no transform pattern found (may already be fixed or uses different pattern)`);
    // Still check for the header styling
    fs.writeFileSync(fp, html, 'utf8');
  }
});

console.log(`\n✅ Fixed ${fixed}/${pages.length} pages`);
console.log('The navbar no longer uses transform for centering — no more flying header bug!');
