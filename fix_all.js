const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'public');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// 1. Extract Cart Drawer from cart.html
const cartHtml = fs.readFileSync(path.join(dir, 'cart.html'), 'utf8');
const backdropMatch = cartHtml.match(/<!-- Overlay Backdrop -->[\s\S]*?<\/aside>/);
const scriptMatch = cartHtml.match(/<script>[\s\S]*?function toggleCart\(\) \{[\s\S]*?<\/script>/);

if (!backdropMatch || !scriptMatch) {
  console.error("Could not find cart drawer or script in cart.html");
  process.exit(1);
}

const cartDrawerHtml = backdropMatch[0];
const cartScriptHtml = scriptMatch[0];

// 2. Process all files
files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');

  // Fix dead links
  content = content.replace(/href="#"/g, 'href="/catalog"');
  
  // Specific routes based on text
  content = content.replace(/>Shop<\/a>/g, ' href="/catalog">Shop</a>');
  content = content.replace(/>Drops<\/a>/g, ' href="/catalog">Drops</a>');
  content = content.replace(/>LOGIN<\/button>/gi, ' onclick="window.location.href=\'/auth\'">LOGIN</button>');
  
  // Update COP THE DROP to go to catalog
  content = content.replace(/<button([^>]+)>([^<]*)<span([^>]+)>COP THE DROP<\/span>/i, '<button$1 onclick="window.location.href=\'/catalog\'">$2<span$3>COP THE DROP</span>');
  content = content.replace(/<button([^>]+)>EXPLORE ALL<\/button>/i, '<button$1 onclick="window.location.href=\'/catalog\'">EXPLORE ALL</button>');

  // If the file is not cart.html, we need to inject the cart drawer!
  if (file !== 'cart.html') {
    // Check if it already has cart drawer
    if (!content.includes('id="cart-drawer"')) {
      // Inject before </body> or at end
      content = content.replace('</body>', `\n${cartDrawerHtml}\n${cartScriptHtml}\n</body>`);
    }
  }

  fs.writeFileSync(path.join(dir, file), content);
});

console.log('Successfully injected cart drawer and fixed links across all files!');
