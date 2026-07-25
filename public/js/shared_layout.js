// shared_layout.js — inject shared nav + cart drawer + toast container into every page

const SHARED_NAV = `
<!-- TOAST CONTAINER -->
<div id="toast-container" class="fixed bottom-lg right-lg z-[9999] flex flex-col gap-sm pointer-events-none max-w-xs w-full"></div>

<!-- CART BACKDROP -->
<div id="cart-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] opacity-0 pointer-events-none transition-opacity duration-300"></div>

<!-- CART DRAWER -->
<aside id="cart-drawer" class="fixed top-0 right-0 h-full w-full max-w-md z-[101] bg-surface border-l-2 border-surface-container-highest translate-x-full transition-transform duration-400 ease-out flex flex-col">
    <div class="flex items-center justify-between p-md border-b-2 border-surface-container-highest">
        <div>
            <h2 class="font-headline-md text-primary">YOUR STASH</h2>
            <p class="text-on-surface-variant text-xs mt-xs">Items saved in your bag</p>
        </div>
        <button data-cart-close class="material-symbols-outlined text-on-surface-variant hover:text-error hover:rotate-90 transition-all p-xs">close</button>
    </div>
    
    <div id="cart-items-container" class="flex-1 overflow-y-auto p-md space-y-sm">
        <!-- Rendered by main.js -->
    </div>

    <div class="p-md border-t-2 border-surface-container-highest space-y-sm bg-surface-container-low">
        <div class="flex justify-between text-sm">
            <span class="text-on-surface-variant">Subtotal</span>
            <span id="cart-subtotal" class="font-label-bold">$0.00</span>
        </div>
        <div class="flex justify-between text-sm">
            <span class="text-on-surface-variant">Shipping</span>
            <span id="cart-shipping" class="font-label-bold text-[#c3f400]">FREE</span>
        </div>
        <div class="flex justify-between items-center">
            <span class="font-label-bold text-primary">TOTAL</span>
            <span id="cart-total" class="font-headline-md text-primary-container">$0.00</span>
        </div>
        <button id="checkout-btn" class="w-full bg-primary-container text-on-primary-container font-headline-md py-md rounded-xl border-3 border-black shadow-[6px_6px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-sm">
            CHECKOUT NOW
            <span class="material-symbols-outlined">arrow_forward</span>
        </button>
        <button onclick="window.location.href='/catalog'" class="w-full text-on-surface-variant font-label-bold py-xs text-center hover:text-primary transition-colors text-sm">← Keep Shopping</button>
    </div>
</aside>
`;

function injectSharedLayout() {
    // Only inject if not already present
    if (!document.getElementById('cart-drawer')) {
        document.body.insertAdjacentHTML('afterbegin', SHARED_NAV);
    }
}

// Auto-inject on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSharedLayout);
} else {
    injectSharedLayout();
}
