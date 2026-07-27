const fs = require('fs');
const content = fs.readFileSync('public/js/shared_layout.js', 'utf8');
const match = content.match(/const TAILWIND_CONFIG = `([\s\S]*?)`;/);
if (match) {
  try {
    const code = match[1];
    eval(code);
    console.log('Eval success');
  } catch (e) {
    console.error('Eval error:', e);
  }
} else {
  console.log('Match not found');
}
