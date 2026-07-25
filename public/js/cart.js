// cart.js — Cart page (renders cart from localStorage, different from drawer)

document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});

function renderCartPage() {
    const container = document.getElementById('cart-page-items');
    const summaryEl = document.getElementById('cart-page-summary');
    const emptyEl = document.getElementById('cart-empty-state');
    const filledEl = document.getElementById('cart-filled-state');

    if (!container) return;

    const cart = (() => { try { return JSON.parse(localStorage.getItem('dopamine_cart')) || []; } catch(e) { return []; }})();

    if (cart.length === 0) {
        if (emptyEl) emptyEl.classList.remove('hidden');
        if (filledEl) filledEl.classList.add('hidden');
        return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');
    if (filledEl) filledEl.classList.remove('hidden');

    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const shipping = subtotal > 200 ? 0 : 12.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    container.innerHTML = cart.map(item => `
        <div class="relative group" id="cart-item-${item._id}-${item.selectedSize.replace(/\\s/g, '_')}">
            <div class="flex flex-col sm:flex-row gap-md glass-panel p-md rounded-xl border-border-width border-surface-container-highest neo-shadow transition-all hover:scale-[1.01]">
                <div class="w-full sm:w-32 h-32 bg-surface-container rounded-lg border-2 border-surface-container-highest flex-shrink-0 overflow-hidden">
                    <img src="${item.images[0]}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'"/>
                </div>
                <div class="flex-1 flex flex-col justify-between">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-headline-md text-primary text-xl uppercase">${item.name}</h4>
                            <p class="font-label-bold text-on-surface-variant mt-xs">SIZE: ${item.selectedSize}</p>
                        </div>
                        <button onclick="cartPageRemove('${item._id}', '${item.selectedSize}')" class="material-symbols-outlined text-error hover:scale-125 transition-transform text-2xl">delete</button>
                    </div>
                    <div class="flex justify-between items-end mt-md">
                        <div class="flex items-center gap-xs bg-surface-container p-xs rounded border-border-width border-surface-container-highest">
                            <button onclick="cartPageQty('${item._id}', '${item.selectedSize}', -1)" class="w-8 h-8 flex items-center justify-center font-bold text-on-surface hover:text-primary-container active:scale-125 transition-transform">-</button>
                            <span class="font-label-bold px-sm text-lg">${item.quantity}</span>
                            <button onclick="cartPageQty('${item._id}', '${item.selectedSize}', 1)" class="w-8 h-8 flex items-center justify-center font-bold text-on-surface hover:text-primary-container active:scale-125 transition-transform">+</button>
                        </div>
                        <span class="font-headline-md text-primary-container text-2xl">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    if (summaryEl) {
        summaryEl.innerHTML = `
            <div class="space-y-md">
                <div class="relative">
                    <label class="block text-[10px] font-label-bold text-on-surface-variant mb-xs ml-xs">Got a discount code? ☕</label>
                    <div class="flex gap-xs">
                        <input type="text" placeholder="DROPCODE_404" class="flex-1 bg-surface-container border-border-width border-surface-container-highest rounded px-sm py-xs font-label-bold focus:ring-2 focus:ring-primary-container focus:outline-none text-primary placeholder:text-on-surface-variant/30" />
                        <button class="bg-primary text-background px-md py-xs rounded font-label-bold border-border-width border-surface-container-highest neo-shadow active-neo-interaction">APPLY</button>
                    </div>
                </div>

                <div class="space-y-sm">
                    <div class="flex justify-between font-label-bold">
                        <span class="text-on-surface-variant">SUBTOTAL (${cart.reduce((a, i) => a + i.quantity, 0)} items)</span>
                        <span class="text-primary">$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between font-label-bold">
                        <span class="text-on-surface-variant">SHIPPING</span>
                        <span class="${shipping === 0 ? 'text-primary-fixed' : 'text-secondary-container'}">${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between font-label-bold">
                        <span class="text-on-surface-variant">TAX (8%)</span>
                        <span class="text-primary">$${tax.toFixed(2)}</span>
                    </div>
                    ${subtotal < 200 ? `<p class="text-[10px] font-label-bold text-[#c3f400] text-right italic">Add $${(200 - subtotal).toFixed(2)} more for FREE shipping!</p>` : ''}
                    
                    <div class="flex justify-between font-headline-md text-headline-md pt-sm border-t-border-width border-surface-container-highest mt-md">
                        <span class="text-primary">TOTAL</span>
                        <span class="text-primary-container">$${total.toFixed(2)}</span>
                    </div>
                </div>
                
                <button onclick="checkout()" class="w-full py-md bg-primary-container text-on-primary-container font-headline-md text-headline-md rounded border-border-width border-surface-container-highest neo-shadow active-neo-interaction flex justify-center items-center gap-md group">
                    CHECKOUT NOW
                    <span class="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </button>
                <button onclick="window.location.href='/catalog.html'" class="w-full text-on-surface-variant font-label-bold py-xs text-center hover:text-primary transition-colors text-sm">
                    ← Continue Shopping
                </button>
            </div>
        `;
    }
}

function cartPageRemove(id, size) {
    let cart = (() => { try { return JSON.parse(localStorage.getItem('dopamine_cart')) || []; } catch(e) { return []; }})();
    cart = cart.filter(i => !(i._id === id && i.selectedSize === size));
    localStorage.setItem('dopamine_cart', JSON.stringify(cart));
    renderCartPage();
    if (typeof showToast === 'function') showToast('Item removed', 'info');
}

function cartPageQty(id, size, delta) {
    let cart = (() => { try { return JSON.parse(localStorage.getItem('dopamine_cart')) || []; } catch(e) { return []; }})();
    const item = cart.find(i => i._id === id && i.selectedSize === size);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) cart = cart.filter(i => !(i._id === id && i.selectedSize === size));
    }
    localStorage.setItem('dopamine_cart', JSON.stringify(cart));
    renderCartPage();
}
