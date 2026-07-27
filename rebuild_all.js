/**
 * rebuild_all.js
 * Rebuilds all public HTML files from Stitch expert sources with correct
 * Tailwind config loading order and dynamic JS integration.
 * Run: node rebuild_all.js
 */
const fs = require('fs');
const path = require('path');

// Shared Tailwind + Fonts head block (Tailwind CDN FIRST, config AFTER)
const SHARED_HEAD = `<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;700&family=Space+Grotesk:wght@700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          "secondary-fixed": "#ffd9e0",
          "surface-variant": "#363342",
          "primary": "#ffffff",
          "on-error-container": "#ffdad6",
          "surface-container-low": "#1c1a27",
          "surface": "#14121f",
          "primary-fixed-dim": "#abd600",
          "tertiary": "#ffffff",
          "on-background": "#e5e0f3",
          "primary-fixed": "#c3f400",
          "primary-container": "#c3f400",
          "on-primary": "#283500",
          "on-tertiary-container": "#006f77",
          "surface-dim": "#14121f",
          "tertiary-fixed-dim": "#00dbe9",
          "surface-container-lowest": "#0e0c1a",
          "background": "#14121f",
          "secondary-fixed-dim": "#ffb1c3",
          "inverse-primary": "#506600",
          "on-tertiary-fixed": "#002022",
          "on-tertiary": "#00363a",
          "on-secondary-fixed-variant": "#8f0041",
          "on-secondary-fixed": "#3f0019",
          "on-secondary-container": "#590026",
          "outline-variant": "#444933",
          "inverse-surface": "#e5e0f3",
          "on-surface-variant": "#c4c9ac",
          "error": "#ffb4ab",
          "on-surface": "#e5e0f3",
          "secondary-container": "#ff4b89",
          "on-primary-fixed": "#161e00",
          "on-secondary": "#66002c",
          "surface-container": "#201e2c",
          "surface-container-highest": "#363342",
          "inverse-on-surface": "#312f3d",
          "secondary": "#ffb1c3",
          "tertiary-container": "#7df4ff",
          "error-container": "#93000a",
          "surface-container-high": "#2b2836",
          "tertiary-fixed": "#7df4ff",
          "on-primary-fixed-variant": "#3c4d00",
          "surface-bright": "#3a3746",
          "on-primary-container": "#556d00",
          "surface-tint": "#abd600",
          "on-error": "#690005",
          "on-tertiary-fixed-variant": "#004f54",
          "outline": "#8e9379"
        },
        borderRadius: {
          DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px"
        },
        spacing: {
          "offset-shadow": "8px 8px 0px #000000",
          lg: "48px", md: "24px", base: "8px",
          "border-width": "4px", xs: "4px", sm: "12px", xl: "80px"
        },
        fontFamily: {
          "headline-lg": ["Syne"],
          "headline-md": ["Syne"],
          "body-lg": ["Plus Jakarta Sans"],
          "body-md": ["Plus Jakarta Sans"],
          "display-xl": ["Syne"],
          "headline-lg-mobile": ["Syne"],
          "label-bold": ["Space Grotesk"]
        },
        fontSize: {
          "headline-lg": ["48px", {lineHeight:"1.2", fontWeight:"800"}],
          "headline-md": ["24px", {lineHeight:"1.3", fontWeight:"700"}],
          "body-lg": ["18px", {lineHeight:"1.6", fontWeight:"500"}],
          "body-md": ["16px", {lineHeight:"1.6", fontWeight:"400"}],
          "display-xl": ["80px", {lineHeight:"1.1", letterSpacing:"-0.04em", fontWeight:"800"}],
          "headline-lg-mobile": ["32px", {lineHeight:"1.2", fontWeight:"800"}],
          "label-bold": ["14px", {lineHeight:"1.0", fontWeight:"700"}]
        }
      }
    }
  };
</script>
<style>
  @keyframes rainbow-border {
    0% { border-color: #ff4b89; box-shadow: 0 0 10px #ff4b89; }
    33% { border-color: #c3f400; box-shadow: 0 0 10px #c3f400; }
    66% { border-color: #00dbe9; box-shadow: 0 0 10px #00dbe9; }
    100% { border-color: #ff4b89; box-shadow: 0 0 10px #ff4b89; }
  }
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(-1deg); }
    50% { transform: translateY(-20px) rotate(1deg); }
  }
  @keyframes drift {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
  @keyframes glitch {
    0% { transform: translate(0); } 20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); } 60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); } 100% { transform: translate(0); }
  }
  @keyframes holo-sweep {
    0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; }
  }
  @keyframes holoFlow {
    0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; }
  }
  .animate-rainbow { animation: rainbow-border 3s linear infinite; }
  .animate-marquee { animation: marquee 15s linear infinite; }
  .animate-float { animation: float 5s ease-in-out infinite; }
  .animate-drift { animation: drift 6s ease-in-out infinite; }
  .delay-75 { animation-delay: 0.75s; }
  .delay-500 { animation-delay: 2s; }
  .delay-1000 { animation-delay: 4s; }
  .neo-shadow { box-shadow: 8px 8px 0px #000000; }
  .neo-shadow-sm { box-shadow: 4px 4px 0px #0D0B18; }
  .neo-shadow-hover:hover { box-shadow: 0px 0px 0px #000000; transform: translate(8px, 8px); }
  .neo-shadow-active { box-shadow: 0 0 0 #0D0B18; transform: translate(4px, 4px); }
  .glass {
    background: rgba(20, 18, 31, 0.7);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }
  .glass-card {
    background: rgba(20, 18, 31, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 4px solid #0D0B18;
    box-shadow: 6px 6px 0 #0D0B18;
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .glass-panel {
    background: rgba(32, 30, 44, 0.7);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
  }
  .holographic {
    background: linear-gradient(135deg, #00dbe944 0%, #ff4b8944 50%, #c3f40044 100%);
    background-size: 300% 300%;
    animation: holo-sweep 8s ease infinite;
  }
  .holographic-sticker, .holographic-glow {
    background: linear-gradient(45deg, rgba(0,219,233,0.8), rgba(255,75,137,0.8), rgba(195,244,0,0.8));
    background-size: 300% 300%;
    animation: holoFlow 5s ease infinite;
  }
  .holographic-gradient {
    background: linear-gradient(45deg, rgba(0,219,233,0.4), rgba(255,75,137,0.4), rgba(195,244,0,0.4));
  }
  .outline-text { -webkit-text-stroke: 3px #c3f400; color: transparent; }
  .dopamine-texture {
    background-image: radial-gradient(#c3f400 0.5px, transparent 0.5px), radial-gradient(#ff4b89 0.5px, transparent 0.5px);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
  }
  .tactical-grid {
    background-image: radial-gradient(circle, #363342 1px, transparent 1px);
    background-size: 24px 24px;
  }
  .grainy-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 9999; opacity: 0.08;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }
  .rare-glow:hover { box-shadow: 0 0 20px #abd600, 6px 6px 0 #0D0B18; border-color: #abd600; }
  .ultra-rare-glow:hover { box-shadow: 0 0 20px #ff4b89, 6px 6px 0 #0D0B18; border-color: #ff4b89; }
  .holographic-sticker { border: 4px solid white; box-shadow: 2px 2px 10px rgba(0,0,0,0.2); transform: rotate(-5deg); }
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    display: inline-block; white-space: nowrap;
  }
  .progress-stripe {
    background: repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px);
  }
  .toggle-switch { width: 48px; height: 24px; background: #1c1a27; border: 2px solid #363342; position: relative; cursor: pointer; transition: all 0.2s; }
  .toggle-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: #8e9379; transition: all 0.2s; }
  .toggle-active .toggle-switch { background: #abd600; border-color: #0D0B18; }
  .toggle-active .toggle-switch::after { left: 26px; background: #0D0B18; }
  .grain-overlay { opacity: 0.05; pointer-events: none; }
  input:focus { outline: none; box-shadow: 0 0 0 4px rgba(195, 244, 0, 0.3); }
  #toast-container .opacity-100 { pointer-events: auto; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #14121f; }
  ::-webkit-scrollbar-thumb { background: #363342; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #abd600; }
  .eye-container { perspective: 1000px; }
  .neo-shadow-active { box-shadow: 0 0 0 #0D0B18; transform: translate(4px, 4px); }
</style>`;

// Shared nav for all pages
const NAV_HTML = `
<!-- Live Drop Ticker -->
<div class="fixed top-0 w-full z-[70] bg-secondary-container text-on-secondary-container font-label-bold text-[11px] py-1.5 uppercase tracking-[0.2em] border-b-4 border-black overflow-hidden whitespace-nowrap">
  <div class="inline-block animate-marquee">⚡ LIVE DROP: SYSTEM OVERLOAD // 042 ACTIVE &nbsp;&nbsp;•&nbsp;&nbsp; ⚡ LIVE DROP: SYSTEM OVERLOAD // 042 ACTIVE &nbsp;&nbsp;•&nbsp;&nbsp; ⚡ LIVE DROP: SYSTEM OVERLOAD // 042 ACTIVE &nbsp;&nbsp;•&nbsp;&nbsp; ⚡ LIVE DROP: SYSTEM OVERLOAD // 042 ACTIVE &nbsp;&nbsp;•&nbsp;&nbsp;</div>
  <div class="inline-block animate-marquee">⚡ LIVE DROP: SYSTEM OVERLOAD // 042 ACTIVE &nbsp;&nbsp;•&nbsp;&nbsp; ⚡ LIVE DROP: SYSTEM OVERLOAD // 042 ACTIVE &nbsp;&nbsp;•&nbsp;&nbsp; ⚡ LIVE DROP: SYSTEM OVERLOAD // 042 ACTIVE &nbsp;&nbsp;•&nbsp;&nbsp; ⚡ LIVE DROP: SYSTEM OVERLOAD // 042 ACTIVE &nbsp;&nbsp;•&nbsp;&nbsp;</div>
</div>
<!-- TopNavBar -->
<header class="fixed top-10 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 rounded-none mx-auto w-[98%] max-w-[1600px] border-4 border-black bg-surface/80 backdrop-blur-xl neo-shadow transition-all" style="left:50%;transform:translateX(-50%);">
  <div class="flex items-center gap-6">
    <a href="/" class="font-headline-lg text-headline-lg-mobile italic uppercase tracking-tighter text-primary flex items-center gap-2 select-none no-underline">DOPAMINE CLUB</a>
    <div class="hidden xl:flex items-center gap-3 px-4 py-1.5 bg-black/40 border-2 border-primary-fixed/30 rounded-sm">
      <div class="w-2 h-2 rounded-full bg-primary-fixed animate-pulse shadow-[0_0_10px_#c3f400]"></div>
      <span class="font-label-bold text-[10px] text-primary-fixed uppercase tracking-widest">System: Operational</span>
      <span class="text-[10px] text-white/40 font-label-bold">|</span>
      <span class="font-label-bold text-[10px] text-white/60 uppercase tracking-widest">Ping: 14ms</span>
    </div>
  </div>
  <nav class="hidden lg:flex items-center gap-xl">
    <a class="font-label-bold text-label-bold text-primary-fixed border-b-4 border-primary-fixed hover:text-secondary-fixed-dim transition-all" href="/catalog.html">DROPS</a>
    <a class="font-label-bold text-label-bold text-on-surface-variant hover:text-primary-fixed transition-all" href="/catalog.html">VAULT</a>
    <a class="font-label-bold text-label-bold text-on-surface-variant hover:text-primary-fixed transition-all" href="#">GAMES</a>
    <a class="font-label-bold text-label-bold text-on-surface-variant hover:text-primary-fixed transition-all" href="#">CLUBS</a>
  </nav>
  <div class="flex items-center gap-6">
    <div class="hidden sm:flex gap-6 items-center">
      <button data-cart-toggle class="relative p-2 text-primary hover:text-primary-fixed transition-colors" onclick="window.location.href='/cart.html'">
        <span class="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
        <span data-cart-count class="absolute -top-1 -right-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-1.5 rounded-sm border-2 border-black hidden items-center justify-center">0</span>
      </button>
    </div>
    <button data-auth-login onclick="window.location.href='/auth.html'" class="font-label-bold text-label-bold bg-primary-fixed text-on-primary-fixed px-8 py-3 rounded-none border-4 border-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all neo-shadow active:scale-95 uppercase">LOGIN</button>
    <button id="mobile-menu-btn" class="lg:hidden p-2 text-primary">
      <span class="material-symbols-outlined">menu</span>
    </button>
  </div>
</header>
<!-- Mobile Menu -->
<div id="mobile-menu" class="hidden fixed inset-0 z-[80] bg-surface flex-col items-center justify-center gap-xl">
  <a href="/catalog.html" class="font-display-xl text-[40px] text-primary-fixed uppercase">DROPS</a>
  <a href="/catalog.html" class="font-display-xl text-[40px] text-on-surface-variant hover:text-primary-fixed uppercase">VAULT</a>
  <a href="#" class="font-display-xl text-[40px] text-on-surface-variant hover:text-primary-fixed uppercase">GAMES</a>
  <a href="#" class="font-display-xl text-[40px] text-on-surface-variant hover:text-primary-fixed uppercase">CLUBS</a>
  <button data-auth-login onclick="window.location.href='/auth.html'" class="mt-8 font-label-bold text-label-bold bg-primary-fixed text-on-primary-fixed px-8 py-3 rounded-full border-4 border-black neo-shadow uppercase">LOGIN</button>
  <button id="mobile-menu-close" class="absolute top-8 right-8 p-2 text-primary" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
    <span class="material-symbols-outlined text-3xl">close</span>
  </button>
</div>
<!-- Toast Container -->
<div id="toast-container" class="fixed bottom-12 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-xs w-full"></div>
<div class="grainy-overlay"></div>`;

// Shared footer
const FOOTER_HTML = `
<footer class="w-full py-20 px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 border-t-4 border-black bg-black text-white relative">
  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-fixed via-secondary-container to-tertiary-fixed"></div>
  <div class="flex flex-col gap-4">
    <div class="font-headline-md text-headline-md text-primary-fixed italic uppercase tracking-tighter">DOPAMINE CLUB</div>
    <p class="font-body-md text-sm text-white/60 max-w-sm tracking-wide uppercase">©2024 DOPAMINE CLUB // OPERATED BY POP MART UNIVERSE SYSTEMS</p>
  </div>
  <div class="flex flex-wrap gap-12">
    <div class="flex flex-col gap-4">
      <span class="font-label-bold text-primary-fixed uppercase tracking-widest text-[10px]">Information</span>
      <a class="font-label-bold text-sm text-white/80 hover:text-white transition-colors" href="#">PRIVACY_PROTOCOL</a>
      <a class="font-label-bold text-sm text-white/80 hover:text-white transition-colors" href="#">USER_TERMS</a>
    </div>
    <div class="flex flex-col gap-4">
      <span class="font-label-bold text-primary-fixed uppercase tracking-widest text-[10px]">Operations</span>
      <a class="font-label-bold text-sm text-white/80 hover:text-white transition-colors" href="#">DEFECT_RECALL</a>
      <a class="font-label-bold text-sm text-white/80 hover:text-white transition-colors" href="#">COMMS_LINK</a>
    </div>
  </div>
  <div class="flex gap-8">
    <button class="w-16 h-16 border-4 border-white/20 flex items-center justify-center hover:border-primary-fixed hover:bg-primary-fixed hover:text-black transition-all">
      <span class="material-symbols-outlined" data-icon="share">share</span>
    </button>
    <button class="w-16 h-16 border-4 border-white/20 flex items-center justify-center hover:border-secondary-container hover:bg-secondary-container hover:text-black transition-all">
      <span class="material-symbols-outlined" data-icon="favorite">favorite</span>
    </button>
  </div>
</footer>`;

// Shared init script at end of body
const SHARED_INIT_SCRIPT = `
<script>
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
    });
  }

  // Neo-shadow micro-interactions
  document.querySelectorAll('.neo-shadow').forEach(card => {
    card.addEventListener('mousedown', () => {
      card.style.transform = 'translate(8px, 8px)';
      card.style.boxShadow = '0px 0px 0px #000000';
    });
    card.addEventListener('mouseup', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  // 3D Tilt for glass cards
  document.querySelectorAll('.glass, .glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y - rect.height/2) / 40;
      const rotateY = (rect.width/2 - x) / 40;
      card.style.transform = \`perspective(2000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale3d(1.01, 1.01, 1.01)\`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
</script>`;

// ─── HOME PAGE ─────────────────────────────────────────────────────────────
const homeHTML = `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="description" content="DOPAMINE CLUB — High-octane streetwear drops for the digital native. Limited quantities. Unapologetic aesthetics."/>
<title>DOPAMINE CLUB | WEAR THE CHAOS</title>
${SHARED_HEAD}
</head>
<body class="bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden font-body-md dopamine-texture">
${NAV_HTML}
<main>
  <!-- Hero Section -->
  <section class="min-h-screen pt-48 pb-xl px-md max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
    <!-- Left Content -->
    <div class="relative z-10 flex flex-col gap-8">
      <div>
        <div class="inline-block bg-secondary-container text-on-secondary-container px-4 py-2 border-4 border-black neo-shadow rotate-[-1deg] font-label-bold tracking-widest mb-8">
          DROP #042 // SYSTEM OVERLOAD
        </div>
        <h1 class="font-display-xl text-[80px] xl:text-[120px] leading-[0.85] uppercase mb-8 text-primary drop-shadow-[10px_10px_0px_rgba(0,0,0,1)]">
          WEAR THE <br/>
          <span class="outline-text italic">CHAOS</span>
        </h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-12 leading-relaxed bg-surface/40 p-4 border-l-4 border-primary-fixed">
          High-octane garments for the digital native. Limited quantities. Unapologetic aesthetics. Designed to trigger that dopamine hit with every stitch.
        </p>
      </div>
      <div class="flex flex-wrap gap-8 items-center">
        <button onclick="window.location.href='/catalog.html'" class="group relative inline-flex items-center gap-6 bg-primary-fixed text-on-primary-fixed px-12 py-8 rounded-none border-4 border-black neo-shadow hover:translate-x-[8px] hover:translate-y-[8px] hover:shadow-none active:scale-95 transition-all">
          <span class="font-headline-md text-[32px] uppercase tracking-tighter">COP THE DROP</span>
          <span class="material-symbols-outlined text-[40px] animate-pulse" data-icon="bolt" style="font-variation-settings: 'FILL' 1;">bolt</span>
        </button>
        <div class="flex flex-col gap-1">
          <span class="font-label-bold text-secondary text-sm uppercase">Next Drop In:</span>
          <span id="countdown" class="font-headline-md text-primary tracking-widest">02:14:55:09</span>
        </div>
      </div>
    </div>
    <!-- Right Content: 3D Product Showcase -->
    <div class="relative flex items-center justify-center">
      <div class="absolute w-[120%] h-[120%] bg-primary-fixed/10 blur-[120px] -z-10 animate-pulse"></div>
      <!-- Main Product Card -->
      <div class="relative w-full max-w-xl glass border-4 border-black rounded-none neo-shadow p-6 group transition-all duration-700 hover:rotate-1">
        <div class="relative overflow-hidden border-4 border-black aspect-square">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
          <img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" alt="Cyberpunk hoodie showcase" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDloCodPPX-KztBSNyry6bmWkLnpliipUl6o4WcSt3rnn8AUwvk6Do1V0Cw7RbOLH_40ok1-jg0qepAAIgh8yhhjmEackRKX5oVHGINRAybPHH69RM6fMJCAkND7G7vmaFFloQH7QvUCJTCP0zAfD_sm40yC_o3MD-Tl8weeKQ5txaxY7BacXUFjS2URtoVoBuTIyEYjNhJA3YwqHw5eDevN8MEVsVzW2YS6qSJz7eoIGRSVTzvD-w8ZjljLlSr_J8gTxxKA5ZX8jDO"/>
        </div>
        <!-- Floating UI Widgets -->
        <div class="absolute -top-12 -right-8 animate-float">
          <div class="bg-white text-black border-4 border-black p-4 neo-shadow rotate-12 flex items-center gap-3">
            <span class="material-symbols-outlined text-secondary-container" data-icon="verified" style="font-variation-settings: 'FILL' 1;">verified</span>
            <span class="font-label-bold text-lg">AUTHENTIC // DC-042</span>
          </div>
        </div>
        <div class="absolute top-1/3 -left-12 animate-float delay-500">
          <div class="holographic border-4 border-black p-6 neo-shadow -rotate-6">
            <div class="font-headline-md text-[40px] text-white tracking-tighter drop-shadow-md">$149.00</div>
          </div>
        </div>
        <div class="absolute -bottom-8 right-12 animate-float delay-1000">
          <div class="bg-primary-container border-4 border-black p-4 px-8 neo-shadow rotate-3 font-label-bold text-on-primary-container text-xl uppercase">LAST 05 UNITS</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Infinite Ticker Banner -->
  <div class="w-full bg-primary-fixed text-on-primary-fixed py-8 border-y-4 border-black overflow-hidden whitespace-nowrap mb-xl transform -rotate-1 scale-105 origin-center">
    <div class="flex animate-marquee">
      <span class="font-display-xl text-[56px] uppercase px-12 italic tracking-tighter">ELITE ACCESS ONLY ✦</span>
      <span class="font-display-xl text-[56px] uppercase px-12 italic tracking-tighter">GLOBAL RECON ✦</span>
      <span class="font-display-xl text-[56px] uppercase px-12 italic tracking-tighter">CHAOS ENGINEERED ✦</span>
      <span class="font-display-xl text-[56px] uppercase px-12 italic tracking-tighter">ELITE ACCESS ONLY ✦</span>
      <span class="font-display-xl text-[56px] uppercase px-12 italic tracking-tighter">GLOBAL RECON ✦</span>
      <span class="font-display-xl text-[56px] uppercase px-12 italic tracking-tighter">CHAOS ENGINEERED ✦</span>
    </div>
  </div>

  <!-- Curated Bento Grid -->
  <section class="max-w-[1600px] mx-auto px-md pb-xl">
    <div class="flex items-end justify-between mb-16 border-b-4 border-black pb-8">
      <h2 class="font-headline-lg text-[64px] uppercase flex items-center gap-8">
        <span class="bg-primary-fixed text-on-primary-fixed px-8 py-2 border-4 border-black neo-shadow">CATALOGUE</span>
        <span class="text-on-surface-variant font-light">/ 01</span>
      </h2>
      <div class="hidden md:block font-label-bold text-primary-fixed text-xl uppercase tracking-[0.4em]">[ DATA_ENTRY_NODE ]</div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-12 gap-10 h-auto lg:h-[850px]">
      <!-- Large Feature -->
      <div class="md:col-span-7 h-full group relative overflow-hidden glass border-4 border-black neo-shadow p-8 transition-all hover:translate-x-2 hover:translate-y-2">
        <div class="flex flex-col h-full justify-between relative z-20">
          <div>
            <span class="font-label-bold bg-secondary-container text-on-secondary-container px-6 py-2 border-4 border-black mb-8 inline-block uppercase tracking-widest">S-TIER RELEASE</span>
            <h3 class="font-headline-lg text-[72px] leading-none uppercase text-primary mb-6">SQUAD<br/>UNIFORMS</h3>
          </div>
          <button onclick="window.location.href='/catalog.html'" class="w-fit font-label-bold bg-primary text-background px-12 py-5 border-4 border-black neo-shadow hover:bg-primary-fixed transition-all uppercase tracking-widest text-lg">ENTER PORTAL</button>
        </div>
        <div class="absolute inset-0 z-0 opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000">
          <img class="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" alt="Fashion models feature" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsPmhIdVH6wb85X-YuGJi8DldTQWLQ32Dea7AgwpY4MgjosGi5EeMit8oieYsiuOma3vh70F3Rf3bUTesj0pzTsqeP_sw5uvncEh7L_5xq88avgmzadryS4KQxucoc5YwDiI1TXyWVnBBfKdjrbbwpqN4TmQjmBHcxYKq6WA9a0lepztPkTJqe76kQLXmrnHJUZx9KEHFfo1jlfgjiMbEUGGnN4eJx_mTGDo189Hg4L1fSwHt3SN82Kvz7JqJs1VQyRbpKwxG7Lk87"/>
        </div>
      </div>
      <!-- Right Column Stack -->
      <div class="md:col-span-5 flex flex-col gap-10 h-full">
        <div class="flex-1 glass border-4 border-black neo-shadow p-8 relative overflow-hidden group hover:translate-x-2 hover:translate-y-2 transition-all">
          <div class="relative z-20">
            <h3 class="font-headline-md text-[40px] uppercase text-primary mb-4 leading-none">LOOT BOXES</h3>
            <p class="text-primary-fixed font-label-bold tracking-widest uppercase text-sm">ENCRYPTED // RARE ASSETS</p>
          </div>
          <div class="absolute bottom-6 right-6 animate-float z-10">
            <span class="material-symbols-outlined text-[100px] text-primary-fixed group-hover:text-secondary-container transition-colors" data-icon="inventory_2" style="font-variation-settings: 'FILL' 1;">inventory_2</span>
          </div>
          <div class="absolute inset-0 z-0 opacity-10 group-hover:opacity-40 transition-opacity">
            <img class="w-full h-full object-cover" alt="Mystery boxes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkWm0RlrqWciOZeu34eE5TSYCGONk__W8SQquYyJp6wWHFBN5WjhJSq_T_xkPCLB3i-5-E21uBMeytdw4nPVfflcqjKxPeNkRRNLD4ilAr0zF_C5om5ydO1b6A3XG8p8vFvhoF7qcKMG3yu2pUDYkmh_Pf0wpQJ48ZRUEAmEZhRHX-5I_t0UabiYy7CuKC54_X_b-IFDPHv-H2jffaJaBT0V98Tl7nbIYISssPA6LnL6OxOoU-oULqecclswsdLwGhONT8YCy8AoLt"/>
          </div>
        </div>
        <div class="flex-1 bg-black border-4 border-black neo-shadow p-8 relative overflow-hidden group hover:translate-x-2 hover:translate-y-2 transition-all">
          <div class="relative z-20">
            <h3 class="font-headline-md text-[40px] uppercase text-white mb-6 leading-none">ARCHIVE<br/>THRIFT</h3>
            <button onclick="window.location.href='/catalog.html'" class="bg-primary text-background px-8 py-3 font-label-bold border-4 border-black hover:bg-secondary-container transition-colors uppercase tracking-widest">DECODE VINTAGE</button>
          </div>
          <div class="absolute top-0 right-0 w-3/5 h-full z-0">
            <img class="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Vintage clothes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLsaQBzqitgXqTuLa-Igr9qnCCmuAAbnCx38g-1KeU1qGZhRkzsJ8EpY6ElxoZVPW87efjNm3-DLj_16Go0n5ttWtvYD9RFgJSgI29icze3NgR6EdcqrWQYBZYpKfN3mg7-D7zDIH22heZcsAbcvnY2DK3Y1S7DxSrTgpfFCV0wE7Wsh0xHV2CE7Zac7CGDykZVZx-dM74COHUc3LFnxTzuFfttAyi9RxcE-3-jxCTZw3d0DMPTvxGPYCLxtv91_NDjaUv9cidMRIE"/>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
${FOOTER_HTML}
<script src="/js/main.js"></script>
${SHARED_INIT_SCRIPT}
<script>
  // Countdown Timer
  function updateCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const target = new Date();
    target.setHours(target.getHours() + 2);
    target.setMinutes(target.getMinutes() + 14);
    target.setSeconds(target.getSeconds() + 55);
    const diff = target - new Date();
    const h = Math.floor(diff/3600000).toString().padStart(2,'0');
    const m = Math.floor((diff%3600000)/60000).toString().padStart(2,'0');
    const s = Math.floor((diff%60000)/1000).toString().padStart(2,'0');
    el.textContent = '0' + h + ':' + m + ':' + s + ':00';
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();
</script>
</body>
</html>`;

// ─── AUTH PAGE ─────────────────────────────────────────────────────────────
const authHTML = `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="description" content="DOPAMINE CLUB — Login or sign up to get access to exclusive drops."/>
<title>DOPAMINE CLUB | CLUB ACCESS</title>
${SHARED_HEAD}
<style>
  .grain-overlay-auth {
    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuCfJqaoD6fVjOnQT8O-p6ObjlFOYXhtLLGziHKSRaCJ44SI3Ytqm-noFfvFhPStCz-VAoCeDBUNHKhyUy5aCDDPXexsb1X1SnuWzaq7mNfbgiMFQzr71UlR-BmkblZqA7yeuKgOwUwLgpRQl2Amii-8czBWd_G3R_ZCboitPNMPBX9Qc5Jm7CFmWtdsIQnfqV7mpMM1v9oTub3BCPfqaqwx2H8WMlruEkpM-vQPTvvohILtVuItfyLsiUzVMJuz69Om6NMccMIjpWa5);
    filter: contrast(150%) brightness(100%);
  }
</style>
</head>
<body class="bg-background text-on-surface min-h-screen overflow-x-hidden font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
<div id="toast-container" class="fixed bottom-12 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-xs w-full"></div>
<div class="grainy-overlay"></div>
<!-- Background Layers -->
<div class="fixed inset-0 z-0">
  <div class="absolute inset-0 bg-gradient-to-tr from-surface-container-lowest via-surface-dim to-surface-container-low"></div>
  <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-fixed/20 blur-[120px] rounded-full"></div>
  <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary-container/20 blur-[120px] rounded-full"></div>
  <div class="absolute inset-0 grain-overlay-auth opacity-20 pointer-events-none"></div>
</div>
<!-- Auth Shell -->
<main class="relative z-10 flex items-center justify-center min-h-screen p-md lg:p-xl">
  <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-[40px] border-4 border-surface-variant neo-shadow overflow-hidden">
    <!-- Left Side: Mascot -->
    <div class="hidden lg:flex flex-col items-center justify-center p-xl relative overflow-hidden bg-surface-container">
      <div class="absolute inset-0 holographic-gradient opacity-10"></div>
      <div class="relative w-80 h-80 flex items-center justify-center" id="mascot-container" style="animation: drift 6s ease-in-out infinite;">
        <div class="absolute inset-0 bg-primary-fixed rounded-[45%_55%_70%_30%_/_30%_40%_60%_70%] border-4 border-on-surface neo-shadow animate-pulse"></div>
        <div class="relative z-10 flex gap-md">
          <div class="w-16 h-16 bg-on-surface rounded-full flex items-center justify-center overflow-hidden border-4 border-on-surface">
            <div class="w-6 h-6 bg-primary rounded-full transition-transform duration-75" id="eye-left"></div>
          </div>
          <div class="w-16 h-16 bg-on-surface rounded-full flex items-center justify-center overflow-hidden border-4 border-on-surface">
            <div class="w-6 h-6 bg-primary rounded-full transition-transform duration-75" id="eye-right"></div>
          </div>
        </div>
        <div class="absolute bottom-20 w-12 h-4 border-b-4 border-on-surface rounded-full"></div>
      </div>
      <div class="mt-xl text-center relative z-10">
        <h1 class="font-headline-lg text-headline-lg text-primary tracking-tighter uppercase italic">DOPAMINE CLUB</h1>
        <p class="font-label-bold text-label-bold text-on-surface-variant mt-sm tracking-widest">GET YOUR FIX. JOIN THE VAULT.</p>
      </div>
      <div class="absolute top-10 left-10 rotate-[-12deg] bg-secondary-container text-on-secondary px-md py-xs font-label-bold text-label-bold rounded-full border-4 border-on-surface neo-shadow-sm">RARE DROPS</div>
      <div class="absolute bottom-20 right-10 rotate-[8deg] bg-tertiary-fixed-dim text-on-tertiary-fixed px-md py-xs font-label-bold text-label-bold rounded-full border-4 border-on-surface neo-shadow-sm">VIBE CHECK: 100%</div>
    </div>
    <!-- Right Side: Auth Form -->
    <div class="flex flex-col p-md md:p-xl glass-card border-l-0 lg:border-l-4 border-surface-variant">
      <div class="relative flex bg-surface-container-high p-xs rounded-full border-4 border-surface-variant mb-xl neo-shadow-sm">
        <div class="absolute top-xs bottom-xs left-xs w-[calc(50%-4px)] bg-primary-fixed rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]" id="toggle-bg"></div>
        <button class="relative z-10 flex-1 py-sm font-label-bold text-label-bold transition-colors duration-300 text-on-primary-fixed" id="btn-login" onclick="toggleAuth('login')">LOGIN</button>
        <button class="relative z-10 flex-1 py-sm font-label-bold text-label-bold text-on-surface-variant transition-colors duration-300" id="btn-signup" onclick="toggleAuth('signup')">SIGN UP</button>
      </div>
      <div class="space-y-md">
        <div id="auth-title">
          <h2 class="font-headline-md text-headline-md text-primary mb-xs">WELCOME BACK</h2>
          <p class="text-on-surface-variant">The arcade is waiting for you.</p>
        </div>
        <!-- Social Auth Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-sm">
          <button class="flex items-center justify-center p-sm bg-surface-bright rounded-xl border-4 border-on-surface neo-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group">
            <span class="material-symbols-outlined text-headline-md group-hover:scale-110 transition-transform">google</span>
          </button>
          <button class="flex items-center justify-center p-sm bg-surface-bright rounded-xl border-4 border-on-surface neo-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group">
            <span class="material-symbols-outlined text-headline-md group-hover:scale-110 transition-transform">file_download</span>
          </button>
          <button class="flex items-center justify-center p-sm bg-surface-bright rounded-xl border-4 border-on-surface neo-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group">
            <span class="material-symbols-outlined text-headline-md group-hover:scale-110 transition-transform">music_note</span>
          </button>
          <button class="flex items-center justify-center p-sm bg-surface-bright rounded-xl border-4 border-on-surface neo-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group">
            <span class="material-symbols-outlined text-headline-md group-hover:scale-110 transition-transform">forum</span>
          </button>
        </div>
        <div class="flex items-center gap-sm">
          <div class="flex-1 h-[2px] bg-surface-variant"></div>
          <span class="font-label-bold text-label-bold text-on-surface-variant">OR EMAIL</span>
          <div class="flex-1 h-[2px] bg-surface-variant"></div>
        </div>
        <form class="space-y-sm" onsubmit="return false;" id="auth-form">
          <div class="hidden space-y-sm" id="signup-fields">
            <div class="space-y-xs">
              <label class="font-label-bold text-label-bold text-on-surface ml-xs uppercase">Full Name</label>
              <input class="w-full px-md py-sm bg-surface-container border-4 border-on-surface rounded-xl font-label-bold text-primary focus:border-primary-fixed transition-colors" placeholder="CHAD DOPAMINE" type="text" id="signup-name"/>
            </div>
          </div>
          <div class="space-y-xs">
            <label class="font-label-bold text-label-bold text-on-surface ml-xs uppercase">Email Address</label>
            <input class="w-full px-md py-sm bg-surface-container border-4 border-on-surface rounded-xl font-label-bold text-primary focus:border-primary-fixed transition-colors" placeholder="YOU@VAULT.COM" type="email" id="auth-email" autocomplete="email"/>
          </div>
          <div class="space-y-xs relative">
            <label class="font-label-bold text-label-bold text-on-surface ml-xs uppercase">Password</label>
            <input class="w-full px-md py-sm bg-surface-container border-4 border-on-surface rounded-xl font-label-bold text-primary focus:border-primary-fixed transition-colors" placeholder="••••••••" type="password" id="auth-password" autocomplete="current-password"/>
            <button class="absolute right-sm top-[38px] text-on-surface-variant" type="button" onclick="togglePassword()">
              <span class="material-symbols-outlined" id="pw-eye">visibility</span>
            </button>
          </div>
          <div class="flex items-center justify-between py-sm">
            <label class="flex items-center gap-sm cursor-pointer group">
              <div class="relative">
                <input class="peer sr-only" type="checkbox"/>
                <div class="w-6 h-6 border-4 border-on-surface rounded-md peer-checked:bg-primary-fixed transition-colors"></div>
                <span class="material-symbols-outlined absolute inset-0 text-on-primary-fixed opacity-0 peer-checked:opacity-100 flex items-center justify-center text-body-md">check</span>
              </div>
              <span class="font-label-bold text-label-bold text-on-surface-variant uppercase group-hover:text-primary transition-colors">Remember Me</span>
            </label>
            <a class="font-label-bold text-label-bold text-primary-fixed hover:text-white transition-colors" href="#">FORGOT?</a>
          </div>
          <button class="w-full py-md bg-primary-fixed text-on-primary-fixed font-headline-md text-headline-md uppercase italic border-4 border-on-surface rounded-2xl neo-shadow hover:neo-shadow-active transition-all active:scale-95" id="submit-btn" onclick="handleAuth()">LOG IN</button>
        </form>
        <p class="text-center font-body-md text-on-surface-variant text-sm mt-md">
          By entering, you agree to the <a class="text-primary underline decoration-primary-fixed underline-offset-4" href="#">Vault Terms</a> & <a class="text-primary underline decoration-primary-fixed underline-offset-4" href="#">Privacy Loop</a>.
        </p>
      </div>
    </div>
  </div>
</main>
<script src="/js/main.js"></script>
<script src="/js/auth.js"></script>
<script>
  let currentMode = 'login';
  function toggleAuth(type) {
    currentMode = type;
    const toggleBg = document.getElementById('toggle-bg');
    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    const title = document.getElementById('auth-title');
    const signupFields = document.getElementById('signup-fields');
    const submitBtn = document.getElementById('submit-btn');
    if (type === 'signup') {
      toggleBg.style.transform = 'translateX(100%)';
      btnLogin.classList.remove('text-on-primary-fixed'); btnLogin.classList.add('text-on-surface-variant');
      btnSignup.classList.remove('text-on-surface-variant'); btnSignup.classList.add('text-on-primary-fixed');
      title.innerHTML = '<h2 class="font-headline-md text-headline-md text-primary mb-xs">JOIN THE CLUB</h2><p class="text-on-surface-variant">Rare aesthetics, zero friction.</p>';
      signupFields.classList.remove('hidden');
      submitBtn.innerText = 'CREATE ACCOUNT';
    } else {
      toggleBg.style.transform = 'translateX(0%)';
      btnSignup.classList.add('text-on-surface-variant'); btnSignup.classList.remove('text-on-primary-fixed');
      btnLogin.classList.remove('text-on-surface-variant'); btnLogin.classList.add('text-on-primary-fixed');
      title.innerHTML = '<h2 class="font-headline-md text-headline-md text-primary mb-xs">WELCOME BACK</h2><p class="text-on-surface-variant">The arcade is waiting for you.</p>';
      signupFields.classList.add('hidden');
      submitBtn.innerText = 'LOG IN';
    }
  }
  function togglePassword() {
    const pw = document.getElementById('auth-password');
    const eye = document.getElementById('pw-eye');
    pw.type = pw.type === 'password' ? 'text' : 'password';
    eye.textContent = pw.type === 'password' ? 'visibility' : 'visibility_off';
  }
  // Mascot eye tracking
  const mascot = document.getElementById('mascot-container');
  const eyeLeft = document.getElementById('eye-left');
  const eyeRight = document.getElementById('eye-right');
  document.addEventListener('mousemove', (e) => {
    if (!mascot || !eyeLeft || !eyeRight) return;
    const rect = mascot.getBoundingClientRect();
    const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const dist = Math.min(10, Math.sqrt((e.clientX-cx)**2 + (e.clientY-cy)**2) / 20);
    const mx = Math.cos(angle)*dist, my = Math.sin(angle)*dist;
    eyeLeft.style.transform = \`translate(\${mx}px, \${my}px)\`;
    eyeRight.style.transform = \`translate(\${mx}px, \${my}px)\`;
  });
</script>
</body>
</html>`;

// ─── CATALOG PAGE ──────────────────────────────────────────────────────────
const catalogHTML = fs.readFileSync(path.join(__dirname, 'catalog_expert.html'), 'utf8');
let catalogBody = catalogHTML.replace(/<\/body>[\s\S]*$/, '').replace(/^[\s\S]*?<body[^>]*>/, '');
// Strip the existing header/nav from catalog since we inject our own NAV_HTML
// The catalog expert has its own header — we keep it but wire up the links
let catalogFixed = `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="description" content="DOPAMINE CLUB Vault — Browse all limited drops. Filter by category, price, and rarity."/>
<title>DOPAMINE CLUB | THE DROP VAULT</title>
${SHARED_HEAD}
<style>
  .tactical-grid { background-image: radial-gradient(circle, #363342 1px, transparent 1px); background-size: 24px 24px; }
</style>
</head>
<body class="bg-surface text-on-surface font-body-md overflow-x-hidden min-h-screen tactical-grid">
${NAV_HTML}
<main class="pt-40 pb-xl px-md max-w-7xl mx-auto flex flex-col md:flex-row gap-lg">
  <!-- Command Filter Sidebar -->
  <aside class="w-full md:w-64 flex-shrink-0">
    <div class="glass-card p-md sticky top-40">
      <h2 class="font-label-bold text-label-bold uppercase tracking-widest text-primary-fixed-dim mb-md">COMMAND_FILTER</h2>
      <div class="space-y-sm">
        <div>
          <p class="font-label-bold text-xs text-on-surface-variant uppercase mb-xs tracking-widest">Category</p>
          <div class="space-y-xs">
            <label class="flex items-center gap-sm cursor-pointer group">
              <input type="checkbox" class="sr-only peer" checked onchange="filterCatalog()">
              <div class="w-5 h-5 border-2 border-surface-variant peer-checked:bg-primary-fixed peer-checked:border-primary-fixed rounded-sm transition-all"></div>
              <span class="font-label-bold text-label-bold text-on-surface-variant peer-checked:text-primary group-hover:text-primary-fixed transition-colors">ALL DROPS</span>
            </label>
            <label class="flex items-center gap-sm cursor-pointer group" onclick="setCategoryFilter('hoodies')">
              <div class="w-5 h-5 border-2 border-surface-variant rounded-sm transition-all"></div>
              <span class="font-label-bold text-label-bold text-on-surface-variant group-hover:text-primary-fixed transition-colors">HOODIES</span>
            </label>
            <label class="flex items-center gap-sm cursor-pointer group" onclick="setCategoryFilter('tees')">
              <div class="w-5 h-5 border-2 border-surface-variant rounded-sm transition-all"></div>
              <span class="font-label-bold text-label-bold text-on-surface-variant group-hover:text-primary-fixed transition-colors">TEES</span>
            </label>
            <label class="flex items-center gap-sm cursor-pointer group" onclick="setCategoryFilter('accessories')">
              <div class="w-5 h-5 border-2 border-surface-variant rounded-sm transition-all"></div>
              <span class="font-label-bold text-label-bold text-on-surface-variant group-hover:text-primary-fixed transition-colors">ACCESSORIES</span>
            </label>
          </div>
        </div>
        <div class="pt-sm border-t-2 border-surface-variant">
          <p class="font-label-bold text-xs text-on-surface-variant uppercase mb-sm tracking-widest">Price Range</p>
          <div class="space-y-xs">
            <label class="flex items-center gap-sm cursor-pointer group">
              <input type="radio" name="price" class="sr-only peer" checked onchange="setPriceFilter('all')">
              <div class="w-4 h-4 border-2 border-surface-variant rounded-full peer-checked:bg-primary-fixed transition-all"></div>
              <span class="font-label-bold text-xs text-on-surface-variant group-hover:text-primary-fixed transition-colors">ALL PRICES</span>
            </label>
            <label class="flex items-center gap-sm cursor-pointer group">
              <input type="radio" name="price" class="sr-only peer" onchange="setPriceFilter('0-50')">
              <div class="w-4 h-4 border-2 border-surface-variant rounded-full peer-checked:bg-primary-fixed transition-all"></div>
              <span class="font-label-bold text-xs text-on-surface-variant group-hover:text-primary-fixed transition-colors">UNDER $50</span>
            </label>
            <label class="flex items-center gap-sm cursor-pointer group">
              <input type="radio" name="price" class="sr-only peer" onchange="setPriceFilter('50-150')">
              <div class="w-4 h-4 border-2 border-surface-variant rounded-full peer-checked:bg-primary-fixed transition-all"></div>
              <span class="font-label-bold text-xs text-on-surface-variant group-hover:text-primary-fixed transition-colors">$50 - $150</span>
            </label>
            <label class="flex items-center gap-sm cursor-pointer group">
              <input type="radio" name="price" class="sr-only peer" onchange="setPriceFilter('150+')">
              <div class="w-4 h-4 border-2 border-surface-variant rounded-full peer-checked:bg-primary-fixed transition-all"></div>
              <span class="font-label-bold text-xs text-on-surface-variant group-hover:text-primary-fixed transition-colors">$150+</span>
            </label>
          </div>
        </div>
        <div class="pt-sm border-t-2 border-surface-variant">
          <p class="font-label-bold text-xs text-on-surface-variant uppercase mb-sm tracking-widest">Rarity</p>
          <div class="space-y-xs">
            <label class="flex items-center gap-sm cursor-pointer group">
              <input type="radio" name="rarity" class="sr-only peer" checked>
              <div class="w-4 h-4 border-2 border-surface-variant rounded-full peer-checked:bg-primary-fixed transition-all"></div>
              <span class="font-label-bold text-xs text-on-surface-variant">ALL TIERS</span>
            </label>
            <label class="flex items-center gap-sm cursor-pointer group">
              <input type="radio" name="rarity" class="sr-only peer">
              <div class="w-4 h-4 border-2 border-secondary-container rounded-full peer-checked:bg-secondary-container transition-all"></div>
              <span class="font-label-bold text-xs text-secondary-container">S-TIER ONLY</span>
            </label>
            <label class="flex items-center gap-sm cursor-pointer group">
              <input type="radio" name="rarity" class="sr-only peer">
              <div class="w-4 h-4 border-2 border-primary-fixed rounded-full peer-checked:bg-primary-fixed transition-all"></div>
              <span class="font-label-bold text-xs text-primary-fixed">RARE+</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </aside>
  <!-- Product Grid Area -->
  <div class="flex-1">
    <div class="flex items-center justify-between mb-lg">
      <h1 class="font-headline-lg text-[48px] uppercase text-primary">THE DROP VAULT</h1>
      <div class="flex items-center gap-sm">
        <div class="relative">
          <input id="search-input" type="text" placeholder="SEARCH THE VAULT..." 
            class="bg-surface-container border-4 border-surface-variant font-label-bold text-primary pl-md pr-xl py-sm focus:border-primary-fixed transition-colors w-64"
            oninput="filterCatalog()">
          <span class="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        </div>
        <select id="sort-select" class="bg-surface-container border-4 border-surface-variant font-label-bold text-primary px-md py-sm focus:border-primary-fixed" onchange="filterCatalog()">
          <option value="default">SORT: DEFAULT</option>
          <option value="price-asc">PRICE: LOW→HIGH</option>
          <option value="price-desc">PRICE: HIGH→LOW</option>
          <option value="name-asc">NAME: A→Z</option>
        </select>
      </div>
    </div>
    <!-- Empty State -->
    <div id="empty-state" class="hidden py-xl text-center">
      <div class="inline-block p-lg bg-surface-container rounded-full mb-md animate-float">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant">search_off</span>
      </div>
      <h3 class="font-headline-md text-primary mb-xs">NOTHING FOUND</h3>
      <p class="text-on-surface-variant font-body-md">The vibe you're looking for doesn't exist yet.</p>
    </div>
    <!-- Product Grid -->
    <div id="product-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md items-start">
      <!-- Populated by catalog.js -->
    </div>
  </div>
</main>
${FOOTER_HTML}
<script src="/js/main.js"></script>
<script src="/js/catalog.js"></script>
${SHARED_INIT_SCRIPT}
</body>
</html>`;

// ─── CART PAGE ─────────────────────────────────────────────────────────────
const cartHTML = `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="description" content="DOPAMINE CLUB — Your loot bag. Review and checkout your drops."/>
<title>DOPAMINE CLUB | THE LOOT BAG</title>
${SHARED_HEAD}
</head>
<body class="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
${NAV_HTML}
<main class="pt-40 pb-xl px-md max-w-7xl mx-auto">
  <div class="flex items-end justify-between mb-lg border-b-4 border-black pb-md">
    <h1 class="font-headline-lg text-[64px] uppercase flex items-center gap-6">
      <span class="material-symbols-outlined text-[64px] text-primary-fixed" style="font-variation-settings:'FILL' 1;">shopping_bag</span>
      THE LOOT BAG
    </h1>
    <span id="cart-page-count" class="font-label-bold text-on-surface-variant">0 ITEMS</span>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-xl">
    <!-- Cart Items -->
    <div class="lg:col-span-2 space-y-md" id="cart-items-list">
      <!-- Populated by cart.js -->
    </div>
    <!-- Order Summary -->
    <div class="glass-card p-lg h-fit sticky top-40">
      <h2 class="font-headline-md text-headline-md text-primary mb-lg uppercase border-b-4 border-black pb-md">Order Summary</h2>
      <div class="space-y-sm mb-lg">
        <div class="flex justify-between font-label-bold">
          <span class="text-on-surface-variant">SUBTOTAL</span>
          <span id="cart-page-subtotal" class="text-primary">$0.00</span>
        </div>
        <div class="flex justify-between font-label-bold">
          <span class="text-on-surface-variant">SHIPPING</span>
          <span id="cart-page-shipping" class="text-primary-fixed">FREE</span>
        </div>
        <div class="flex justify-between font-label-bold">
          <span class="text-on-surface-variant">TAX (8%)</span>
          <span id="cart-page-tax" class="text-on-surface-variant">$0.00</span>
        </div>
      </div>
      <!-- Promo Code -->
      <div class="flex gap-sm mb-lg">
        <input type="text" placeholder="PROMO CODE" id="promo-input" class="flex-1 bg-surface-container border-4 border-surface-variant font-label-bold text-primary px-md py-sm focus:border-primary-fixed transition-colors">
        <button onclick="applyPromo()" class="bg-surface-variant text-primary font-label-bold px-md py-sm border-4 border-black neo-shadow-sm hover:bg-primary-fixed hover:text-on-primary-fixed transition-all uppercase">APPLY</button>
      </div>
      <div class="border-t-4 border-black pt-md mb-lg">
        <div class="flex justify-between font-headline-md text-headline-md">
          <span class="text-primary">TOTAL</span>
          <span id="cart-page-total" class="text-primary-fixed">$0.00</span>
        </div>
      </div>
      <button id="checkout-btn" onclick="checkout()" class="w-full py-md bg-primary-fixed text-on-primary-fixed font-headline-md text-headline-md uppercase border-4 border-black neo-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-md group">
        CHECKOUT NOW
        <span class="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
      </button>
      <p class="text-center text-on-surface-variant font-label-bold text-xs mt-sm">🔒 SECURE CHECKOUT // ENCRYPTED</p>
    </div>
  </div>
  <!-- Empty Cart State -->
  <div id="empty-cart" class="hidden py-xl text-center">
    <div class="inline-block p-xl bg-surface-container border-4 border-black neo-shadow mb-lg animate-float">
      <span class="material-symbols-outlined text-[80px] text-on-surface-variant">shopping_bag</span>
    </div>
    <h2 class="font-headline-lg text-[48px] uppercase mb-md">YOUR BAG IS EMPTY</h2>
    <p class="text-on-surface-variant font-body-lg mb-xl">No drops secured yet. The vault awaits.</p>
    <button onclick="window.location.href='/catalog.html'" class="bg-primary-fixed text-on-primary-fixed font-headline-md text-headline-md px-xl py-lg border-4 border-black neo-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all uppercase">
      ENTER THE VAULT
    </button>
  </div>
</main>
${FOOTER_HTML}
<script src="/js/main.js"></script>
<script src="/js/cart.js"></script>
${SHARED_INIT_SCRIPT}
</body>
</html>`;

// ─── PDP PAGE ──────────────────────────────────────────────────────────────
const pdpExpert = fs.readFileSync(path.join(__dirname, 'pdp_expert.html'), 'utf8');
// Extract body content from pdp_expert
const pdpBodyMatch = pdpExpert.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
const pdpBodyContent = pdpBodyMatch ? pdpBodyMatch[1] : '';

const pdpHTML = `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="description" content="DOPAMINE CLUB — The Hype Piece. Get this limited drop before it's gone."/>
<title>DOPAMINE CLUB | THE HYPE PIECE</title>
${SHARED_HEAD}
</head>
<body class="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
${NAV_HTML}
<main class="pt-40 pb-xl px-md max-w-7xl mx-auto">
  <div id="pdp-content" class="grid grid-cols-1 lg:grid-cols-2 gap-xl">
    <!-- Gallery -->
    <div class="space-y-md">
      <div class="aspect-square glass-card overflow-hidden relative border-4 border-black neo-shadow" id="main-image-container">
        <img id="main-image" class="w-full h-full object-cover" alt="Product Image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDloCodPPX-KztBSNyry6bmWkLnpliipUl6o4WcSt3rnn8AUwvk6Do1V0Cw7RbOLH_40ok1-jg0qepAAIgh8yhhjmEackRKX5oVHGINRAybPHH69RM6fMJCAkND7G7vmaFFloQH7QvUCJTCP0zAfD_sm40yC_o3MD-Tl8weeKQ5txaxY7BacXUFjS2URtoVoBuTIyEYjNhJA3YwqHw5eDevN8MEVsVzW2YS6qSJz7eoIGRSVTzvD-w8ZjljLlSr_J8gTxxKA5ZX8jDO"/>
        <div class="absolute top-md left-md">
          <span class="bg-secondary-container text-on-secondary-container font-label-bold text-label-bold px-md py-xs border-4 border-black uppercase tracking-widest">LIVE DROP</span>
        </div>
      </div>
      <div id="thumbnail-gallery" class="flex gap-sm overflow-x-auto"></div>
    </div>
    <!-- Product Info -->
    <div class="space-y-lg" id="product-info">
      <!-- Populated by pdp.js -->
      <div class="animate-pulse space-y-md">
        <div class="h-8 bg-surface-container rounded w-3/4"></div>
        <div class="h-16 bg-surface-container rounded w-full"></div>
        <div class="h-4 bg-surface-container rounded w-1/2"></div>
      </div>
    </div>
  </div>
</main>
${FOOTER_HTML}
<script src="/js/main.js"></script>
<script src="/js/pdp.js"></script>
${SHARED_INIT_SCRIPT}
</body>
</html>`;

// ─── PROFILE PAGE ──────────────────────────────────────────────────────────
const profileExpert = fs.readFileSync(path.join(__dirname, 'profile_expert.html'), 'utf8');
const profileBodyMatch = profileExpert.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
const profileBodyRaw = profileBodyMatch ? profileBodyMatch[1] : '';

const profileHTML = `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="description" content="DOPAMINE CLUB — Player Stats. Your profile, order history, and achievements."/>
<title>DOPAMINE CLUB | PLAYER STATS</title>
${SHARED_HEAD}
</head>
<body class="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
${NAV_HTML}
<main class="pt-40 pb-xl px-md max-w-7xl mx-auto" id="profile-main">
  <!-- Loading state -->
  <div id="profile-loading" class="flex items-center justify-center py-xl">
    <div class="text-center">
      <span class="material-symbols-outlined text-6xl text-primary-fixed animate-spin">progress_activity</span>
      <p class="mt-md font-label-bold text-on-surface-variant uppercase tracking-widest">LOADING PLAYER DATA...</p>
    </div>
  </div>
  <!-- Profile content populated by profile.js -->
  <div id="profile-content" class="hidden space-y-xl">
    <!-- Profile Header -->
    <div class="glass-card p-xl border-4 border-black neo-shadow relative overflow-hidden">
      <div class="absolute inset-0 holographic opacity-10"></div>
      <div class="relative z-10 flex flex-col md:flex-row items-center gap-xl">
        <div class="w-32 h-32 rounded-full border-4 border-primary-fixed neo-shadow flex items-center justify-center bg-surface-container">
          <span class="material-symbols-outlined text-6xl text-primary-fixed">person</span>
        </div>
        <div class="text-center md:text-left">
          <h1 class="font-headline-lg text-[48px] uppercase text-primary" id="profile-name">LOADING...</h1>
          <p class="text-primary-fixed font-label-bold tracking-widest uppercase" id="profile-email">loading@vault.com</p>
          <div class="flex flex-wrap gap-sm mt-sm justify-center md:justify-start">
            <span class="bg-secondary-container text-on-secondary-container font-label-bold text-xs px-md py-xs border-2 border-black uppercase">VAULT MEMBER</span>
            <span class="bg-primary-fixed text-on-primary-fixed font-label-bold text-xs px-md py-xs border-2 border-black uppercase">DOPAMINE LEVEL: 42</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-md">
      <div class="glass-card p-lg border-4 border-black neo-shadow text-center">
        <div class="font-headline-lg text-[48px] text-primary-fixed" id="stat-orders">0</div>
        <div class="font-label-bold text-xs text-on-surface-variant uppercase tracking-widest">TOTAL ORDERS</div>
      </div>
      <div class="glass-card p-lg border-4 border-black neo-shadow text-center">
        <div class="font-headline-lg text-[48px] text-primary-fixed" id="stat-spent">$0</div>
        <div class="font-label-bold text-xs text-on-surface-variant uppercase tracking-widest">INVESTED</div>
      </div>
      <div class="glass-card p-lg border-4 border-black neo-shadow text-center">
        <div class="font-headline-lg text-[48px] text-tertiary-fixed-dim" id="stat-rank">ROOKIE</div>
        <div class="font-label-bold text-xs text-on-surface-variant uppercase tracking-widest">RANK</div>
      </div>
      <div class="glass-card p-lg border-4 border-black neo-shadow text-center">
        <div class="font-headline-lg text-[48px] text-secondary-container" id="stat-streak">0</div>
        <div class="font-label-bold text-xs text-on-surface-variant uppercase tracking-widest">DROP STREAK</div>
      </div>
    </div>
    <!-- Order History -->
    <div class="glass-card border-4 border-black neo-shadow">
      <div class="p-lg border-b-4 border-black flex items-center justify-between">
        <h2 class="font-headline-md text-headline-md text-primary uppercase">Order Archive</h2>
        <span class="font-label-bold text-xs text-on-surface-variant uppercase tracking-widest">DROP HISTORY</span>
      </div>
      <div id="order-history" class="p-lg space-y-md">
        <div class="text-center py-xl text-on-surface-variant">
          <span class="material-symbols-outlined text-6xl">inbox</span>
          <p class="mt-md font-body-md">No orders yet. Time to hit the vault.</p>
        </div>
      </div>
    </div>
    <!-- Not Logged In State -->
    <div id="profile-auth-required" class="hidden text-center py-xl">
      <span class="material-symbols-outlined text-[80px] text-on-surface-variant">lock</span>
      <h2 class="font-headline-lg text-[48px] uppercase my-lg">ACCESS DENIED</h2>
      <p class="text-on-surface-variant font-body-lg mb-xl">You need to be logged in to view your stats.</p>
      <button onclick="window.location.href='/auth.html'" class="bg-primary-fixed text-on-primary-fixed font-headline-md text-headline-md px-xl py-lg border-4 border-black neo-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all uppercase">JOIN THE CLUB</button>
    </div>
  </div>
</main>
${FOOTER_HTML}
<script src="/js/main.js"></script>
<script src="/js/profile.js"></script>
${SHARED_INIT_SCRIPT}
</body>
</html>`;

// ─── SETTINGS PAGE ─────────────────────────────────────────────────────────
const settingsHTML = `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="description" content="DOPAMINE CLUB — System Override. Configure your vault settings."/>
<title>DOPAMINE CLUB | SYSTEM OVERRIDE</title>
${SHARED_HEAD}
</head>
<body class="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
${NAV_HTML}
<main class="pt-40 pb-xl px-md max-w-4xl mx-auto">
  <div class="flex items-center gap-6 mb-xl border-b-4 border-black pb-lg">
    <span class="material-symbols-outlined text-[48px] text-primary-fixed">settings</span>
    <h1 class="font-headline-lg text-[48px] uppercase">SYSTEM OVERRIDE</h1>
  </div>
  <div class="space-y-xl">
    <!-- Account Settings -->
    <div class="glass-card p-xl border-4 border-black neo-shadow">
      <h2 class="font-headline-md text-headline-md text-primary uppercase mb-lg border-b-4 border-surface-variant pb-md">Account Config</h2>
      <div class="space-y-md">
        <div class="space-y-xs">
          <label class="font-label-bold text-label-bold text-on-surface uppercase">Display Name</label>
          <input type="text" class="w-full px-md py-sm bg-surface-container border-4 border-surface-variant font-label-bold text-primary focus:border-primary-fixed transition-colors" placeholder="CHAD DOPAMINE"/>
        </div>
        <div class="space-y-xs">
          <label class="font-label-bold text-label-bold text-on-surface uppercase">Email</label>
          <input type="email" class="w-full px-md py-sm bg-surface-container border-4 border-surface-variant font-label-bold text-primary focus:border-primary-fixed transition-colors" placeholder="you@vault.com"/>
        </div>
        <button class="bg-primary-fixed text-on-primary-fixed font-label-bold px-xl py-sm border-4 border-black neo-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all uppercase">SAVE CHANGES</button>
      </div>
    </div>
    <!-- Notification Settings -->
    <div class="glass-card p-xl border-4 border-black neo-shadow">
      <h2 class="font-headline-md text-headline-md text-primary uppercase mb-lg border-b-4 border-surface-variant pb-md">Drop Alerts</h2>
      <div class="space-y-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-label-bold text-label-bold text-primary">Email Notifications</p>
            <p class="text-on-surface-variant text-sm">Get notified when new drops land</p>
          </div>
          <div class="toggle-switch" onclick="this.parentElement.classList.toggle('toggle-active')"></div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-label-bold text-label-bold text-primary">Push Notifications</p>
            <p class="text-on-surface-variant text-sm">Real-time drop alerts on device</p>
          </div>
          <div class="toggle-switch" onclick="this.parentElement.classList.toggle('toggle-active')"></div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-label-bold text-label-bold text-primary">Restock Alerts</p>
            <p class="text-on-surface-variant text-sm">Know when sold-out items return</p>
          </div>
          <div class="toggle-switch" onclick="this.parentElement.classList.toggle('toggle-active')"></div>
        </div>
      </div>
    </div>
    <!-- Danger Zone -->
    <div class="border-4 border-error p-xl rounded-lg">
      <h2 class="font-headline-md text-headline-md text-error uppercase mb-lg">DANGER ZONE</h2>
      <div class="flex flex-col md:flex-row gap-md">
        <button onclick="logout()" class="flex-1 bg-surface-container text-error font-label-bold px-xl py-sm border-4 border-error hover:bg-error hover:text-on-error transition-all uppercase">LOGOUT ALL DEVICES</button>
        <button class="flex-1 bg-error-container text-error font-label-bold px-xl py-sm border-4 border-error hover:bg-error hover:text-on-error transition-all uppercase">DELETE ACCOUNT</button>
      </div>
    </div>
  </div>
</main>
${FOOTER_HTML}
<script src="/js/main.js"></script>
${SHARED_INIT_SCRIPT}
</body>
</html>`;

// ─── WRITE ALL FILES ────────────────────────────────────────────────────────
const pages = [
  { file: 'home.html', content: homeHTML },
  { file: 'auth.html', content: authHTML },
  { file: 'catalog.html', content: catalogFixed },
  { file: 'cart.html', content: cartHTML },
  { file: 'pdp.html', content: pdpHTML },
  { file: 'profile.html', content: profileHTML },
  { file: 'settings.html', content: settingsHTML },
];

const publicDir = path.join(__dirname, 'public');
pages.forEach(({ file, content }) => {
  fs.writeFileSync(path.join(publicDir, file), content, 'utf8');
  console.log(`✅ Written: ${file} (${Math.round(content.length/1024)}KB)`);
});

console.log('\n🎉 All pages rebuilt! Visit http://localhost:3000 to verify.');
console.log('Pages: ' + pages.map(p => p.file).join(', '));
