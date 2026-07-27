// shared_layout.js — inject shared nav + cart drawer + toast container into every page

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
    // Inject Cart Drawer and Toast Container
    if (!document.getElementById('cart-drawer')) {
        document.body.insertAdjacentHTML('afterbegin', SHARED_HTML);
    }
    
    // Apply the grainy overlay if not present
    if (!document.querySelector('.grainy-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'grainy-overlay';
        document.body.appendChild(overlay);
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
