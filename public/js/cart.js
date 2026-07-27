// cart.js — Fixed element IDs to match cart.html
document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});

function renderCartPage() {
    const itemsList = document.getElementById('cart-items-list');
    const emptyCart = document.getElementById('empty-cart');
    const countEl = document.getElementById('cart-page-count');
    const subtotalEl = document.getElementById('cart-page-subtotal');
    const shippingEl = document.getElementById('cart-page-shipping');
    const taxEl = document.getElementById('cart-page-tax');
    const totalEl = document.getElementById('cart-page-total');

    if (!itemsList) return;

    if (cart.length === 0) {
        if (itemsList) itemsList.innerHTML = '';
        if (emptyCart) emptyCart.classList.remove('hidden');
        if (countEl) countEl.textContent = '0 ITEMS';
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (taxEl) taxEl.textContent = '$0.00';
        if (totalEl) totalEl.textContent = '$0.00';
        if (shippingEl) shippingEl.textContent = 'FREE';
        return;
    }

    if (emptyCart) emptyCart.classList.add('hidden');

    const itemCount = cart.reduce((acc, i) => acc + i.quantity, 0);
    if (countEl) countEl.textContent = `${itemCount} ITEM${itemCount !== 1 ? 'S' : ''}`;

    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 150 ? 0 : subtotal > 0 ? 9.99 : 0;
    const total = subtotal + tax + shipping;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    itemsList.innerHTML = cart.map(item => `
        <div class="glass-card flex gap-md group transition-all hover:-translate-y-1">
            <div class="w-28 h-36 bg-surface-container overflow-hidden flex-shrink-0 cursor-pointer border-4 border-black"
                 onclick="window.location.href='/pdp?id=${item._id}'">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                     src="${item.images[0]}"
                     alt="${item.name}"
                     onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'"/>
            </div>
            <div class="flex-1 flex flex-col justify-between py-sm">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-headline-md text-primary uppercase text-lg cursor-pointer hover:text-primary-fixed transition-colors"
                            onclick="window.location.href='/pdp?id=${item._id}'">${item.name}</h3>
                        <p class="font-label-bold text-xs text-on-surface-variant uppercase mt-xs">Size: ${item.selectedSize}</p>
                        <p class="font-label-bold text-xs text-primary-fixed mt-xs">$${item.price.toFixed(2)} each</p>
                    </div>
                    <button onclick="removeFromCart('${item._id}', '${item.selectedSize}'); renderCartPage();"
                            class="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors p-xs">
                        close
                    </button>
                </div>
                <div class="flex items-center justify-between mt-sm">
                    <div class="flex items-center border-4 border-black bg-surface-container">
                        <button onclick="updateCartQuantity('${item._id}', '${item.selectedSize}', -1); renderCartPage();"
                                class="px-md py-xs hover:bg-surface-container-highest transition-colors font-bold text-xl active:scale-95">
                            −
                        </button>
                        <span class="px-lg py-xs font-headline-md text-lg border-x-4 border-black min-w-[3.5rem] text-center">
                            ${item.quantity.toString().padStart(2, '0')}
                        </span>
                        <button onclick="updateCartQuantity('${item._id}', '${item.selectedSize}', 1); renderCartPage();"
                                class="px-md py-xs hover:bg-surface-container-highest transition-colors font-bold text-xl active:scale-95">
                            +
                        </button>
                    </div>
                    <span class="font-headline-md text-primary-fixed text-xl">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

window.applyPromo = function() {
    const input = document.getElementById('promo-input');
    if (!input || !input.value.trim()) { showToast('Enter a promo code', 'warning'); return; }
    const code = input.value.trim().toUpperCase();
    const codes = { 'DOPAMINE10': 10, 'VAULT20': 20, 'CHAOS15': 15 };
    if (codes[code]) {
        showToast(`${code} applied! ${codes[code]}% off`, 'success');
    } else {
        showToast('Invalid promo code', 'error');
    }
};
