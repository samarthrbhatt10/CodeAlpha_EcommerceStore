const fs = require('fs');
let html = fs.readFileSync('catalog_expert.html', 'utf8');
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if(mainMatch) {
    let content = `<!DOCTYPE html>
<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>DOPAMINE CLUB | VAULT</title>
<script src="/js/shared_layout.js"></script>
</head>
<body class="bg-surface text-on-surface font-body-md overflow-x-hidden min-h-screen tactical-grid">
<div class="fixed inset-0 grain-overlay z-[60]"></div>
<main class="pt-32 pb-xl px-md max-w-7xl mx-auto flex flex-col md:flex-row gap-lg">
${mainMatch[1]}
</main>
<script src="/js/main.js"></script>
<script src="/js/catalog.js"></script>
</body></html>`;

    // Replace the static grid with the dynamic ID so catalog.js can populate it
    content = content.replace(/<div class="grid grid-cols-1 lg:grid-cols-2 gap-md">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '<div id="empty-state" class="hidden py-xl text-center"><div class="inline-block p-lg bg-surface-container rounded-full mb-md animate-float"><span class="material-symbols-outlined text-6xl text-on-surface-variant">search_off</span></div><h3 class="font-headline-md text-primary mb-xs">NOTHING FOUND</h3><p class="text-on-surface-variant font-body-md">The vibe you\'re looking for doesn\'t exist yet.</p></div><div id="product-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md items-start"></div></div></div>');
    
    // Add search bar
    content = content.replace(/<h1 class="font-display-xl[^>]*>[\s\S]*?<\/h1>/, `$&
        <div class="w-full md:w-auto relative group mt-md">
            <input type="text" id="search-input" placeholder="Search the drop..." class="w-full bg-surface-container border-2 border-surface-container-highest rounded-full py-sm pl-xl pr-md text-primary placeholder-on-surface-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all">
            <span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container transition-colors">search</span>
        </div>
    `);

    // Setup Category Sidebar clicks
    content = content.replace(/<div class="flex items-center justify-between group toggle-active"[^>]*>/g, '<div data-filter-btn class="flex items-center justify-between group toggle-active cursor-pointer" onclick="setCategory(\'ALL\', this)">');
    content = content.replace(/<div class="flex items-center justify-between group"[^>]*><span class="font-label-bold text-xs uppercase text-on-surface-variant">GOTH_LITE<\/span>/g, '<div data-filter-btn class="flex items-center justify-between group cursor-pointer" onclick="setCategory(\'Apparel\', this)"><span class="font-label-bold text-xs uppercase text-on-surface-variant">APPAREL</span>');
    content = content.replace(/<div class="flex items-center justify-between group"[^>]*><span class="font-label-bold text-xs uppercase text-on-surface-variant">Y2K_STREET<\/span>/g, '<div data-filter-btn class="flex items-center justify-between group cursor-pointer" onclick="setCategory(\'Accessories\', this)"><span class="font-label-bold text-xs uppercase text-on-surface-variant">ACCESSORIES</span>');
    content = content.replace(/<div class="flex items-center justify-between group"[^>]*><span class="font-label-bold text-xs uppercase text-on-surface-variant">UNDER_\$30<\/span>/g, '<div data-filter-btn class="flex items-center justify-between group cursor-pointer" onclick="setCategory(\'Collectibles\', this)"><span class="font-label-bold text-xs uppercase text-on-surface-variant">COLLECTIBLES</span>');

    fs.writeFileSync('public/catalog.html', content);
    console.log('Updated public/catalog.html');
}
