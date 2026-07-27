const fs = require('fs');

let html = fs.readFileSync('cart_expert.html', 'utf8');

// Extract the main content and footer
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

if(mainMatch) {
    let content = `<!DOCTYPE html>
<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>THE LOOT BAG | CHECKOUT</title>
<script src="/js/shared_layout.js"></script>
</head>
<body class="bg-background text-on-surface font-body-md min-h-screen selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
<div class="fixed inset-0 grainy-overlay z-[100]"></div>

<header class="sticky top-md z-50 flex justify-between items-center px-md py-sm rounded-full border-border-width border-surface-container-highest mt-md mx-auto w-[95%] max-w-7xl bg-surface-container-low/20 backdrop-blur-xl shadow-offset-shadow transition-all duration-300">
<div class="font-headline-lg text-headline-lg-mobile italic uppercase tracking-tighter text-primary cursor-pointer" onclick="window.location.href='/'">
    DOPAMINE CLUB
</div>
<nav class="hidden md:flex gap-md items-center">
    <a class="font-label-bold text-label-bold text-on-surface-variant hover:text-secondary-fixed-dim hover:scale-105 transition-transform" href="/catalog.html">DROPS</a>
    <a class="font-label-bold text-label-bold text-on-surface-variant hover:text-secondary-fixed-dim hover:scale-105 transition-transform" href="/catalog.html">VAULT</a>
</nav>
<div class="flex items-center gap-sm">
    <button onclick="window.location.href='/cart.html'" class="p-2 text-primary hover:scale-110 transition-transform relative">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">shopping_bag</span>
        <span id="nav-cart-count" class="absolute -top-1 -right-1 bg-primary-container text-on-primary-container text-[10px] font-bold px-1 rounded-full">0</span>
    </button>
    <button onclick="window.location.href='/auth.html'" id="nav-auth-btn" class="bg-primary-fixed text-on-primary-fixed font-label-bold text-label-bold px-md py-xs rounded-full border-border-width border-surface-variant hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all active:scale-95">LOGIN</button>
</div>
</header>

<main class="max-w-7xl mx-auto px-md py-xl grid grid-cols-1 lg:grid-cols-12 gap-lg relative mt-xl">
${mainMatch[1]}
</main>

<script src="/js/main.js"></script>
<script src="/js/cart.js"></script>
</body></html>`;

    // Hook in our dynamic ids
    // Change item list container
    content = content.replace(/<!-- Item List -->[\s\S]*?<!-- Frequently Copied Section -->/, '<!-- Item List -->\n<div id="cart-page-items" class="space-y-md"></div>\n<!-- Frequently Copied Section -->');
    
    // Total counters
    content = content.replace(/<span>\$205\.00<\/span>/, '<span id="cart-page-subtotal">$0.00</span>');
    content = content.replace(/<span>\$17\.43<\/span>/, '<span id="cart-page-tax">$0.00</span>');
    content = content.replace(/<span class="text-headline-lg font-headline-lg text-primary">\$222\.43<\/span>/, '<span id="cart-page-total" class="text-headline-lg font-headline-lg text-primary">$0.00</span>');
    content = content.replace(/Initialize Checkout/, 'Initialize Checkout <span id="cart-page-btn-total"></span>');
    content = content.replace(/<button class="w-full bg-primary-container[^>]*>/, '<button id="cart-page-checkout-btn" class="w-full bg-primary-container text-on-primary-container py-md font-headline-md text-headline-md uppercase italic active-click neo-shadow-lime hover:scale-[1.02] transition-all flex items-center justify-center gap-sm">');
    
    content = content.replace(/<span class="font-label-bold text-label-bold text-secondary-container mb-2">\[ 02 ITEMS DETECTED \]/, '<span id="cart-page-count" class="font-label-bold text-label-bold text-secondary-container mb-2">[ 0 ITEMS DETECTED ]');

    fs.writeFileSync('public/cart.html', content);
    console.log('Updated public/cart.html');
}
