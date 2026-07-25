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
        <div class="flex gap-md p-md bg-surface-container-low border-2 border-surface-container-highest rounded-xl" id="cart-item-${item._id}-${item.selectedSize.replace(/\s/g, '_')}">
            <div class="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 border-surface-container-highest">
                <img src="${item.images[0]}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'"/>
            </div>
            <div class="flex-1">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-label-bold text-primary">${item.name}</h3>
                        <p class="text-on-surface-variant text-sm mt-xs">Size: ${item.selectedSize}</p>
                    </div>
                    <button onclick="cartPageRemove('${item._id}', '${item.selectedSize}')" class="material-symbols-outlined text-error hover:scale-125 transition-transform">delete</button>
                </div>
                <div class="flex justify-between items-center mt-md">
                    <div class="flex items-center gap-xs bg-surface-container border-2 border-surface-container-highest rounded-lg overflow-hidden">
                        <button onclick="cartPageQty('${item._id}', '${item.selectedSize}', -1)" class="w-8 h-8 flex items-center justify-center font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors">−</button>
                        <span class="font-label-bold px-sm w-8 text-center">${item.quantity}</span>
                        <button onclick="cartPageQty('${item._id}', '${item.selectedSize}', 1)" class="w-8 h-8 flex items-center justify-center font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors">+</button>
                    </div>
                    <span class="font-label-bold text-primary-container text-lg">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');

    if (summaryEl) {
        summaryEl.innerHTML = `
            <div class="space-y-sm text-sm">
                <div class="flex justify-between">
                    <span class="text-on-surface-variant">Subtotal (${cart.reduce((a, i) => a + i.quantity, 0)} items)</span>
                    <span class="font-label-bold">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-on-surface-variant">Shipping</span>
                    <span class="font-label-bold ${shipping === 0 ? 'text-[#c3f400]' : ''}">${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-on-surface-variant">Tax (8%)</span>
                    <span class="font-label-bold">$${tax.toFixed(2)}</span>
                </div>
                ${subtotal < 200 ? `<p class="text-xs text-[#c3f400]">Add $${(200 - subtotal).toFixed(2)} more for FREE shipping!</p>` : ''}
                <div class="border-t-2 border-surface-container-highest pt-sm flex justify-between items-center">
                    <span class="font-headline-md text-primary">TOTAL</span>
                    <span class="font-headline-md text-primary-container">$${total.toFixed(2)}</span>
                </div>
            </div>
            <button id="checkout-btn" onclick="checkout()" class="mt-md w-full bg-primary-container text-on-primary-container font-headline-md py-md rounded-xl border-3 border-black shadow-[6px_6px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-sm">
                CHECKOUT NOW
                <span class="material-symbols-outlined">arrow_forward</span>
            </button>
            <button onclick="window.location.href='/catalog'" class="mt-sm w-full text-on-surface-variant font-label-bold py-sm text-center hover:text-primary transition-colors text-sm">
                ← Continue Shopping
            </button>
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
