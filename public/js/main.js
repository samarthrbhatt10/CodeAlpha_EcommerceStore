// ============================================================
// main.js — Global Utilities for Dopamine Club
// Cart, Auth, Toast, Navigation — runs on every page
// ============================================================

// ─── TOAST NOTIFICATION SYSTEM ───────────────────────────────
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: 'check_circle', error: 'error', info: 'info', warning: 'warning' };
    const colors = {
        success: 'bg-[#c3f400] text-[#161e00]',
        error: 'bg-[#ff4b89] text-white',
        info: 'bg-[#00dbe9] text-[#002022]',
        warning: 'bg-[#ffd9e0] text-[#3f0019]'
    };

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-sm px-md py-sm rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] font-label-bold text-label-bold translate-x-full opacity-0 transition-all duration-300 ${colors[type]}`;
    toast.innerHTML = `<span class="material-symbols-outlined text-lg" style="font-variation-settings:'FILL' 1">${icons[type]}</span><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    });

    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ─── CART STATE MANAGEMENT ─────────────────────────────────
let cart = [];
try { cart = JSON.parse(localStorage.getItem('dopamine_cart')) || []; } catch(e) { cart = []; }

function saveCart() {
    localStorage.setItem('dopamine_cart', JSON.stringify(cart));
    renderCartDrawer();
    updateCartBadges();
}

function addToCart(product, selectedSize) {
    if (!product || !product._id) return;
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'OS';
    const itemKey = `${product._id}-${size}`;
    const existing = cart.find(i => i._id === product._id && i.selectedSize === size);

    if (existing) {
        existing.quantity += 1;
        showToast(`Added another ${product.name} to your stash!`, 'success');
    } else {
        cart.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images || ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'],
            selectedSize: size,
            quantity: 1
        });
        showToast(`${product.name} dropped in your bag! 🔥`, 'success');
    }
    saveCart();
    openCart();
}

function removeFromCart(id, size) {
    cart = cart.filter(i => !(i._id === id && i.selectedSize === size));
    saveCart();
    showToast('Removed from stash', 'info');
}

function updateCartQuantity(id, size, delta) {
    const item = cart.find(i => i._id === id && i.selectedSize === size);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => !(i._id === id && i.selectedSize === size));
        }
        saveCart();
    }
}

function openCart() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
        drawer.classList.remove('translate-x-full');
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100', 'pointer-events-auto');
    }
}

function closeCart() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
        drawer.classList.add('translate-x-full');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    }
}

window.toggleCart = function() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    if (drawer.classList.contains('translate-x-full')) {
        openCart();
    } else {
        closeCart();
    }
};

function updateCartBadges() {
    const total = cart.reduce((acc, i) => acc + i.quantity, 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => {
        el.textContent = total;
        el.style.display = total > 0 ? 'flex' : 'none';
    });
    document.querySelectorAll('[data-cart-label]').forEach(el => {
        el.textContent = total > 0 ? `Cart (${total})` : 'Cart';
    });
}

function renderCartDrawer() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const shipping = subtotal > 200 ? 0 : 12.99;
    const total = subtotal + shipping;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    const shippingEl = document.getElementById('cart-shipping');
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full gap-md text-on-surface-variant">
                <span class="material-symbols-outlined text-5xl opacity-30">shopping_bag</span>
                <p class="font-label-bold text-center">Your stash is empty.<br/>Go cop some drops!</p>
                <button onclick="window.location.href='/catalog'" class="bg-primary-container text-on-primary-container font-label-bold px-md py-sm rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    EXPLORE DROPS
                </button>
            </div>`;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="flex gap-sm p-sm bg-surface-container-high rounded-lg border-2 border-surface-container-highest">
            <div class="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 border-surface-container-highest bg-surface-container">
                <img src="${item.images[0]}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'"/>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start gap-xs">
                    <div>
                        <p class="font-label-bold text-primary text-sm leading-tight truncate">${item.name}</p>
                        <p class="text-on-surface-variant text-xs mt-1">Size: ${item.selectedSize}</p>
                    </div>
                    <button onclick="removeFromCart('${item._id}', '${item.selectedSize}')" class="material-symbols-outlined text-base text-error hover:scale-125 transition-transform flex-shrink-0">delete</button>
                </div>
                <div class="flex justify-between items-center mt-sm">
                    <div class="flex items-center gap-xs bg-surface-container rounded border-2 border-surface-container-highest">
                        <button onclick="updateCartQuantity('${item._id}', '${item.selectedSize}', -1)" class="w-6 h-6 flex items-center justify-center font-bold text-on-surface hover:text-primary-container transition-colors">−</button>
                        <span class="font-label-bold px-xs text-sm">${item.quantity}</span>
                        <button onclick="updateCartQuantity('${item._id}', '${item.selectedSize}', 1)" class="w-6 h-6 flex items-center justify-center font-bold text-on-surface hover:text-primary-container transition-colors">+</button>
                    </div>
                    <span class="font-label-bold text-primary-container">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ─── CHECKOUT ──────────────────────────────────────────────
async function checkout() {
    if (cart.length === 0) { showToast('Your stash is empty!', 'warning'); return; }
    const token = localStorage.getItem('token');
    if (!token) {
        showToast('Please login to checkout', 'warning');
        setTimeout(() => window.location.href = '/auth', 1500);
        return;
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> PROCESSING...';
    }

    try {
        const items = cart.map(i => ({ productId: i._id, quantity: i.quantity }));
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ items })
        });
        const data = await res.json();

        if (res.ok) {
            cart = [];
            saveCart();
            closeCart();
            showToast('Order placed! Welcome to the Club 🔥', 'success');
        } else {
            throw new Error(data.message || 'Order failed');
        }
    } catch (err) {
        showToast(err.message || 'Something went wrong', 'error');
    } finally {
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = 'CHECKOUT NOW <span class="material-symbols-outlined">arrow_forward</span>';
        }
    }
}

// ─── AUTH HEADER MANAGEMENT ───────────────────────────────
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch(e) { return null; } })();

    document.querySelectorAll('[data-auth-login]').forEach(el => {
        if (token && user) {
            el.textContent = 'LOGOUT';
            el.onclick = (e) => { e.preventDefault(); logout(); };
        } else {
            el.textContent = 'LOGIN';
            el.onclick = (e) => { e.preventDefault(); window.location.href = '/auth'; };
        }
    });

    document.querySelectorAll('[data-auth-user]').forEach(el => {
        el.textContent = token && user ? user.email.split('@')[0].toUpperCase() : 'GUEST';
    });

    document.querySelectorAll('[data-auth-admin]').forEach(el => {
        el.style.display = (token && user && user.role === 'admin') ? 'flex' : 'none';
    });
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    cart = [];
    localStorage.removeItem('dopamine_cart');
    showToast('Logged out. Come back for more drops!', 'info');
    setTimeout(() => window.location.href = '/', 1500);
}

// ─── NAVIGATION BINDING ─────────────────────────────────────
function bindNavigation() {
    // Cart buttons — any element with [data-cart-toggle]
    document.querySelectorAll('[data-cart-toggle]').forEach(el => {
        el.addEventListener('click', e => { e.preventDefault(); toggleCart(); });
    });

    // Close cart
    document.querySelectorAll('[data-cart-close]').forEach(el => {
        el.addEventListener('click', closeCart);
    });

    // Backdrop click closes cart
    const backdrop = document.getElementById('cart-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeCart);

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);

    // Mobile menu toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }
}

// ─── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    bindNavigation();
    updateAuthUI();
    renderCartDrawer();
    updateCartBadges();
});
