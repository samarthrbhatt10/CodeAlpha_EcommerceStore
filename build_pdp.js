const fs = require('fs');
let html = fs.readFileSync('pdp_expert.html', 'utf8');
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if(mainMatch) {
    let content = `<!DOCTYPE html>
<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>DOPAMINE CLUB | PDP</title>
<script src="/js/shared_layout.js"></script>
</head>
<body class="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
<div class="fixed inset-0 grainy-overlay z-[100]"></div>
<main class="max-w-7xl mx-auto px-md pt-32 pb-xl relative z-10 lg:pl-[120px]">
${mainMatch[1]}
</main>
<script src="/js/main.js"></script>
<script src="/js/pdp.js"></script>
</body></html>`;

    // Add IDs for JS hooks
    content = content.replace(/<img class="w-full h-full object-cover animate-float"[^>]*>/, '<img id="pdp-main-img" class="w-full h-full object-cover animate-float" src="" />');
    content = content.replace(/<h1 class="font-headline-lg text-headline-lg text-primary uppercase leading-tight italic">CYBER-NEKO <span class="text-secondary-container">V\.2<\/span><\/h1>/, '<h1 id="pdp-title" class="font-headline-lg text-headline-lg text-primary uppercase leading-tight italic">LOADING...</h1>');
    content = content.replace(/<p class="font-body-lg text-body-lg text-on-surface-variant max-w-md">\s*The ultimate evolution[\s\S]*?<\/p>/, '<p id="pdp-desc" class="font-body-lg text-body-lg text-on-surface-variant max-w-md">Description loading...</p>');
    
    // Rarity
    content = content.replace(/RARITY: LEGENDARY/, '<span id="pdp-rarity-text">RARITY: CORE COLLECTION</span>');
    // Hype velocity
    content = content.replace(/HYPE VELOCITY: 98%/, '<span id="pdp-hype-text">HYPE VELOCITY: --%</span>');

    // Prices
    content = content.replace(/<span class="font-headline-lg text-headline-lg text-primary-container">\$489\.00<\/span>/, '<span id="pdp-price" class="font-headline-lg text-headline-lg text-primary-container">$$$</span>');
    content = content.replace(/<div class="text-on-surface-variant line-through font-headline-md">\$620\.00<\/div>/, '<div id="pdp-original-price" class="text-on-surface-variant line-through font-headline-md"></div>');
    
    // Cop button
    content = content.replace(/id="cop-button"/, 'id="pdp-add-btn"');

    // Thumbs
    content = content.replace(/<div class="grid grid-cols-4 gap-md">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- Product Intel Right -->/, '<div id="pdp-thumbs" class="grid grid-cols-4 gap-md"></div>\n</div>\n<!-- Product Intel Right -->');

    // Remove the static left nav since it's desktop only and we have top nav.
    content = content.replace(/lg:pl-\[120px\]/, '');

    // Tactical Specs Grid (we'll keep it static or minimally dynamic in JS, let's add an ID)
    content = content.replace(/<div class="grid grid-cols-2 gap-sm">/, '<div id="pdp-tactical-specs" class="grid grid-cols-2 gap-sm">');
    
    // Add Size Selector Container
    content = content.replace(/<!-- Tactical Specs -->/, `
    <!-- Size Selector -->
    <div class="flex flex-col gap-sm mb-lg" id="size-section">
        <div class="flex justify-between items-center">
            <span class="text-[12px] font-label-bold uppercase text-on-surface-variant">SELECT ENERGY LEVEL (SIZE)</span>
            <span id="selected-size-label" class="text-[12px] font-label-bold text-primary-container"></span>
        </div>
        <div class="flex flex-wrap gap-sm" id="pdp-sizes"></div>
        <p id="pdp-stock" class="text-xs font-label-bold text-error"></p>
    </div>
    <!-- Tactical Specs -->
    `);

    fs.writeFileSync('public/pdp.html', content);
    console.log('Updated public/pdp.html');
}
