const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

const desktopNavRegex = /<nav class="hidden lg:flex items-center gap-xl">([\s\S]*?)<\/nav>/;
const desktopNavReplacement = `<nav class="hidden lg:flex items-center gap-lg">
    <a class="font-label-bold text-label-bold text-on-surface-variant hover:text-primary-fixed transition-all uppercase" href="/catalog">VAULT</a>
    <a class="font-label-bold text-label-bold text-on-surface-variant hover:text-primary-fixed transition-all uppercase" href="/drop">LIVE DROP</a>
    <a class="font-label-bold text-label-bold text-on-surface-variant hover:text-primary-fixed transition-all uppercase" href="/trade">TRADE HUB</a>
    <a class="font-label-bold text-label-bold text-on-surface-variant hover:text-primary-fixed transition-all uppercase" href="/unboxing">UNBOXING</a>
    <a class="font-label-bold text-label-bold text-on-surface-variant hover:text-primary-fixed transition-all uppercase" href="/chat">SQUAD CHAT</a>
    <a class="font-label-bold text-label-bold text-on-surface-variant hover:text-primary-fixed transition-all uppercase" href="/recruitment">RECRUIT</a>
  </nav>`;

const mobileNavRegex = /<div id="mobile-menu" class="hidden fixed inset-0 z-\[80\] bg-surface flex-col items-center justify-center gap-xl">([\s\S]*?)<button class="mt-8/;
const mobileNavReplacement = `<div id="mobile-menu" class="hidden fixed inset-0 z-[80] bg-surface flex-col items-center justify-center gap-lg overflow-y-auto py-10">
  <a href="/catalog" class="font-display-xl text-[32px] text-on-surface-variant hover:text-primary-fixed transition-colors uppercase">VAULT</a>
  <a href="/drop" class="font-display-xl text-[32px] text-on-surface-variant hover:text-primary-fixed transition-colors uppercase">LIVE DROP</a>
  <a href="/trade" class="font-display-xl text-[32px] text-on-surface-variant hover:text-primary-fixed transition-colors uppercase">TRADE HUB</a>
  <a href="/unboxing" class="font-display-xl text-[32px] text-on-surface-variant hover:text-primary-fixed transition-colors uppercase">UNBOXING</a>
  <a href="/chat" class="font-display-xl text-[32px] text-on-surface-variant hover:text-primary-fixed transition-colors uppercase">SQUAD CHAT</a>
  <a href="/recruitment" class="font-display-xl text-[32px] text-on-surface-variant hover:text-primary-fixed transition-colors uppercase">RECRUIT</a>
  <button class="mt-8`;

for (const file of htmlFiles) {
  if (['admin.html'].includes(file)) continue; // Admin has different sidebar
  
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  let modified = false;
  if (desktopNavRegex.test(content)) {
    content = content.replace(desktopNavRegex, desktopNavReplacement);
    modified = true;
  }
  
  if (mobileNavRegex.test(content)) {
    content = content.replace(mobileNavRegex, mobileNavReplacement);
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated navigation in ${file}`);
  }
}
console.log('Navigation update complete.');
