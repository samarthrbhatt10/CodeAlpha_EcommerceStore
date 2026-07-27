const fs = require('fs');

let html = fs.readFileSync('profile_expert.html', 'utf8');
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

if(mainMatch) {
    let content = `<!DOCTYPE html>
<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>PLAYER STATS | DOPAMINE CLUB</title>
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
    <button data-auth-login class="bg-primary-fixed text-on-primary-fixed font-label-bold text-label-bold px-md py-xs rounded-full border-border-width border-surface-variant hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all active:scale-95">LOGOUT</button>
</div>
</header>

<main class="max-w-[1440px] mx-auto px-md py-xl grid grid-cols-1 lg:grid-cols-12 gap-lg relative z-10">
${mainMatch[1]}
</main>

<script src="/js/main.js"></script>
<script src="/js/profile.js"></script>
</body></html>`;

    // Dynamic hooks
    // User name
    content = content.replace(/<h1 class="font-display-xl text-[64px] leading-none text-primary uppercase italic">KIRA_99<\/h1>/, '<h1 id="profile-name" class="font-display-xl text-[64px] leading-none text-primary uppercase italic">LOADING_USER</h1>');
    
    // Status
    content = content.replace(/<span>\[ STATUS: ELITE \]<\/span>/, '<span id="profile-status">[ STATUS: ACTIVE ]</span>');
    
    // Rank
    content = content.replace(/<span class="font-display-xl text-primary-container text-5xl">42<\/span>/, '<span id="profile-rank" class="font-display-xl text-primary-container text-5xl">01</span>');
    
    // Balance
    content = content.replace(/<span class="font-display-xl text-secondary-container text-5xl">14\.5K<\/span>/, '<span id="profile-balance" class="font-display-xl text-secondary-container text-5xl">0.0K</span>');
    
    // Recent orders table
    // Find the tbody and give it an ID
    content = content.replace(/<tbody>[\s\S]*?<\/tbody>/, '<tbody id="profile-orders-list"></tbody>');

    fs.writeFileSync('public/profile.html', content);
    console.log('Updated public/profile.html');
}
