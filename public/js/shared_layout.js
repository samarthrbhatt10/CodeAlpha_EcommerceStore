// shared_layout.js — inject shared config, styles, nav + cart drawer + toast container into every page

const TAILWIND_CONFIG = `
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
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
        "borderRadius": {
          "DEFAULT": "0.25rem",
          "lg": "0.5rem",
          "xl": "0.75rem",
          "full": "9999px"
        },
        "spacing": {
          "offset-shadow": "6px 6px 0px #0D0B18",
          "lg": "48px",
          "md": "24px",
          "base": "8px",
          "border-width": "3px",
          "xs": "4px",
          "sm": "12px",
          "xl": "80px"
        },
        "fontFamily": {
          "headline-lg": ["Syne"],
          "headline-md": ["Syne"],
          "body-lg": ["Plus Jakarta Sans"],
          "body-md": ["Plus Jakarta Sans"],
          "display-xl": ["Syne"],
          "headline-lg-mobile": ["Syne"],
          "label-bold": ["Space Grotesk"]
        },
        "fontSize": {
          "headline-lg": ["48px", {"lineHeight": "1.2", "fontWeight": "800"}],
          "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "700"}],
          "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "500"}],
          "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
          "display-xl": ["80px", {"lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "800"}],
          "headline-lg-mobile": ["32px", {"lineHeight": "1.2", "fontWeight": "800"}],
          "label-bold": ["14px", {"lineHeight": "1.0", "fontWeight": "700"}]
        }
      },
    },
  }
`;

const STITCH_STYLES = `
  @keyframes rainbow-border {
      0% { border-color: #ff4b89; box-shadow: 0 0 10px #ff4b89; }
      33% { border-color: #c3f400; box-shadow: 0 0 10px #c3f400; }
      66% { border-color: #00dbe9; box-shadow: 0 0 10px #00dbe9; }
      100% { border-color: #ff4b89; box-shadow: 0 0 10px #ff4b89; }
  }
  @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
  }
  @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(-2deg); }
      50% { transform: translateY(-15px) rotate(2deg); }
  }
  @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
  }
  @keyframes holoFlow {
      0% { background-position: 0% 50%; } 
      50% { background-position: 100% 50%; } 
      100% { background-position: 0% 50%; }
  }
  @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
  }
  .animate-rainbow { animation: rainbow-border 4s linear infinite; }
  .animate-marquee { animation: marquee 20s linear infinite; }
  .animate-float { animation: float 4s ease-in-out infinite; }
  .shimmer-effect { position: relative; overflow: hidden; }
  .shimmer-effect::after {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      animation: shimmer 2s infinite;
  }
  .neo-shadow { box-shadow: 6px 6px 0px #0D0B18; transition: all 0.2s; }
  .active-neo-interaction:active, .neo-shadow-hover:hover {
      box-shadow: 0px 0px 0px #0D0B18;
      transform: translate(6px, 6px);
  }
  .glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
  }
  .glass-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 3px solid #0D0B18;
      box-shadow: 6px 6px 0 #0D0B18;
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .glass-card:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 #abd600; }
  .glass-card:active { transform: translate(4px, 4px); box-shadow: 0 0 0 #0D0B18; }
  .glass-panel {
      background: rgba(32, 30, 44, 0.7);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
  }
  .holographic-sticker, .holographic-glow, .holographic {
      background: linear-gradient(45deg, rgba(0, 219, 233, 0.8), rgba(255, 75, 137, 0.8), rgba(195, 244, 0, 0.8));
      background-size: 300% 300%;
      animation: holoFlow 5s ease infinite;
  }
  .holographic-sticker { border: 4px solid white; box-shadow: 2px 2px 10px rgba(0,0,0,0.2); transform: rotate(-5deg); }
  .grainy-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;
      opacity: 0.05;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }
  .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; display: inline-block; white-space: nowrap; }
  
  #toast-container .opacity-100 { pointer-events:auto; }
`;

const SHARED_HTML = `
<!-- TOAST CONTAINER -->
<div id="toast-container" class="fixed bottom-lg right-lg z-[9999] flex flex-col gap-sm pointer-events-none max-w-xs w-full"></div>

<!-- CART BACKDROP -->
<div id="cart-backdrop" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] opacity-0 pointer-events-none transition-opacity duration-300" data-cart-close></div>

<!-- CART DRAWER -->
<aside id="cart-drawer" class="fixed top-0 right-0 h-full w-full max-w-md z-[101] glass-panel border-l-border-width border-surface-container-highest translate-x-full transition-transform duration-500 ease-in-out flex flex-col">
    <!-- Header -->
    <div class="p-md border-b-border-width border-surface-container-highest flex justify-between items-center">
        <h2 class="font-headline-md text-headline-md text-primary flex items-center gap-sm">
            YOUR STASH
            <span id="cart-drawer-count" class="bg-primary-container text-on-primary-container text-label-bold px-xs py-0 rounded text-xs">0</span>
        </h2>
        <button class="material-symbols-outlined text-primary hover:rotate-90 transition-transform p-xs" data-cart-close>close</button>
    </div>
    
    <!-- Gamified Perks Bar -->
    <div class="px-md py-sm bg-surface-container-highest/50 border-b-border-width border-surface-container-highest">
        <div class="flex justify-between items-center mb-xs">
            <span class="font-label-bold text-xs text-on-surface-variant">HOLOGRAPHIC PROGRESS</span>
            <span id="shipping-progress-text" class="font-label-bold text-xs text-primary-container"></span>
        </div>
        <div class="h-4 w-full bg-surface-container rounded-full border-2 border-surface-container-highest overflow-hidden">
            <div id="shipping-progress-bar" class="h-full holographic-glow rounded-full" style="width: 0%"></div>
        </div>
    </div>
    
    <!-- Cart Items Scrollable -->
    <div id="cart-items-container" class="flex-1 overflow-y-auto p-md space-y-md custom-scrollbar">
        <!-- Rendered by main.js -->
    </div>

    <!-- Footer / Checkout Section -->
    <div class="p-md space-y-md border-t-border-width border-surface-container-highest bg-surface-container-low">
        <div class="space-y-xs">
            <div class="flex justify-between font-label-bold text-sm">
                <span class="text-on-surface-variant">SUBTOTAL</span>
                <span id="cart-subtotal" class="text-primary">$0.00</span>
            </div>
            <div class="flex justify-between font-label-bold text-sm">
                <span class="text-on-surface-variant">SHIPPING</span>
                <span id="cart-shipping" class="text-secondary-container">FREE</span>
            </div>
            <div class="flex justify-between font-headline-md text-headline-md pt-xs border-t-2 border-surface-container-highest">
                <span class="text-primary">TOTAL</span>
                <span id="cart-total" class="text-primary-container">$0.00</span>
            </div>
        </div>
        <button id="checkout-btn" class="w-full py-md bg-primary-container text-on-primary-container font-headline-md text-headline-md rounded border-border-width border-surface-container-highest neo-shadow active-neo-interaction flex justify-center items-center gap-md group">
            CHECKOUT NOW
            <span class="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
        </button>
        <button onclick="window.location.href='/cart'" class="w-full text-on-surface-variant font-label-bold py-xs text-center hover:text-primary transition-colors text-sm">View Full Cart →</button>
    </div>
</aside>
`;

function injectSharedLayout() {
    // 1. Inject Tailwind script if not present
    if (!document.querySelector('script[src*="tailwindcss"]')) {
        const twScript = document.createElement('script');
        twScript.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
        document.head.appendChild(twScript);
    }
    
    // 2. Inject Tailwind Config
    if (!document.getElementById('tailwind-config')) {
        const configScript = document.createElement('script');
        configScript.id = "tailwind-config";
        configScript.innerHTML = TAILWIND_CONFIG;
        document.head.appendChild(configScript);
    } else {
        document.getElementById('tailwind-config').innerHTML = TAILWIND_CONFIG;
    }
    
    // 3. Inject Stitch Styles
    if (!document.getElementById('stitch-styles')) {
        const styleTag = document.createElement('style');
        styleTag.id = "stitch-styles";
        styleTag.innerHTML = STITCH_STYLES;
        document.head.appendChild(styleTag);
    } else {
        document.getElementById('stitch-styles').innerHTML = STITCH_STYLES;
    }

    // 4. Inject Cart Drawer and Toast Container
    if (!document.getElementById('cart-drawer')) {
        document.body.insertAdjacentHTML('afterbegin', SHARED_HTML);
    }
    
    // 5. Apply the grainy overlay if not present
    if (!document.querySelector('.grainy-overlay')) {
        document.body.insertAdjacentHTML('afterbegin', '<div class="grainy-overlay"></div>');
    }
    
    // Ensure body has the right classes
    document.body.classList.add('bg-background', 'text-on-surface', 'font-body-md', 'min-h-screen', 'overflow-x-hidden', 'selection:bg-primary-container', 'selection:text-on-primary-container');
}

// Auto-inject on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSharedLayout);
} else {
    injectSharedLayout();
}
