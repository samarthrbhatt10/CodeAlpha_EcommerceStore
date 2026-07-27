const fs = require('fs');

let html = fs.readFileSync('auth_expert.html', 'utf8');

// Extract the main content and footer
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

if(mainMatch) {
    let content = `<!DOCTYPE html>
<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>CLUB ACCESS | AUTH</title>
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
</div>
</header>

<main class="relative z-10 flex items-center justify-center min-h-screen p-md lg:p-xl">
${mainMatch[1]}
</main>

<script src="/js/main.js"></script>
<script src="/js/auth.js"></script>
</body></html>`;

    // Add ID to form so JS can capture submission
    content = content.replace(/<form class="space-y-md">/, '<form id="auth-form" class="space-y-md">');
    // Inputs
    content = content.replace(/<input class="w-full bg-surface-container[^>]*placeholder="Email Address"[^>]*>/, '<input id="auth-email" type="email" required class="w-full bg-surface-container px-md py-sm rounded-xl border-border-width border-surface-container-highest focus:border-primary-fixed outline-none transition-colors neo-shadow-sm font-label-bold placeholder:text-on-surface-variant/50" placeholder="Email Address"/>');
    content = content.replace(/<input class="w-full bg-surface-container[^>]*placeholder="Password"[^>]*>/, '<input id="auth-password" type="password" required class="w-full bg-surface-container px-md py-sm rounded-xl border-border-width border-surface-container-highest focus:border-primary-fixed outline-none transition-colors neo-shadow-sm font-label-bold placeholder:text-on-surface-variant/50" placeholder="Password"/>');
    // Submit btn
    content = content.replace(/<button class="w-full py-md bg-primary-fixed[^>]*>[\s\S]*?<\/button>/, '<button type="submit" id="auth-submit-btn" class="w-full py-md bg-primary-fixed text-on-primary-fixed rounded-xl border-border-width border-on-surface neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95 font-headline-md text-headline-md uppercase italic tracking-wide">Enter The Vault</button>');
    
    fs.writeFileSync('public/auth.html', content);
    console.log('Updated public/auth.html');
}
