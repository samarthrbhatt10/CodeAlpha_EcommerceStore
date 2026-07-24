// main.js - Global utilities

// Cart State Management (LocalStorage)
let cart = JSON.parse(localStorage.getItem('dopamine_cart')) || [];

function saveCart() {
    localStorage.setItem('dopamine_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(product) {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    // Open drawer
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer) {
        drawer.classList.remove('translate-x-full');
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100', 'pointer-events-auto');
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item._id !== id);
    saveCart();
}

function updateCartQuantity(id, delta) {
    const item = cart.find(i => i._id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
        }
    }
}

function updateCartUI() {
    const cartCountBtns = document.querySelectorAll('button[onclick="window.location.href=\'/cart\'"]');
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    // Update header cart button text
    cartCountBtns.forEach(btn => {
        btn.innerHTML = `Cart (${totalCount}) <span class="material-symbols-outlined">shopping_cart</span>`;
    });

    // Update Drawer UI
    const drawerContainer = document.querySelector('#cart-drawer .custom-scrollbar');
    if (!drawerContainer) return;

    if (cart.length === 0) {
        drawerContainer.innerHTML = '<p class="text-on-surface-variant p-md">Your stash is empty.</p>';
    } else {
        drawerContainer.innerHTML = cart.map(item => `
            <div class="relative group" id="item-${item._id}">
                <div class="flex gap-md glass-panel p-sm rounded-lg border-border-width border-surface-container-highest neo-shadow transition-all group-hover:scale-[1.02]">
                    <div class="w-20 h-20 bg-surface-container rounded-md border-2 border-surface-container-highest flex-shrink-0 overflow-hidden">
                        <img class="w-full h-full object-cover" src="${item.images[0]}" />
                    </div>
                    <div class="flex-1 flex flex-col justify-between">
                        <div class="flex justify-between items-start">
                            <h4 class="font-label-bold text-primary">${item.name}</h4>
                            <button class="material-symbols-outlined text-error hover:scale-125 transition-transform text-lg" onclick="removeFromCart('${item._id}')">delete</button>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-xs bg-surface-container p-xs rounded border-border-width border-surface-container-highest">
                                <button onclick="updateCartQuantity('${item._id}', -1)" class="w-6 h-6 flex items-center justify-center font-bold text-on-surface hover:text-primary-container active:scale-125 transition-transform">-</button>
                                <span class="font-label-bold px-xs">${item.quantity}</span>
                                <button onclick="updateCartQuantity('${item._id}', 1)" class="w-6 h-6 flex items-center justify-center font-bold text-on-surface hover:text-primary-container active:scale-125 transition-transform">+</button>
                            </div>
                            <span class="font-label-bold text-primary-container">$${item.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update Totals
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const subtotalEl = document.querySelector('#cart-drawer .text-primary.subtotal');
    if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
}

// Global Auth State
document.addEventListener('DOMContentLoaded', () => {
    // Override toggleCart function if it exists to slide the drawer
    window.toggleCart = function() {
        const drawer = document.getElementById('cart-drawer');
        const backdrop = document.getElementById('cart-backdrop');
        if (drawer && backdrop) {
            if (drawer.classList.contains('translate-x-full')) {
                drawer.classList.remove('translate-x-full');
                backdrop.classList.remove('opacity-0', 'pointer-events-none');
                backdrop.classList.add('opacity-100', 'pointer-events-auto');
            } else {
                drawer.classList.add('translate-x-full');
                backdrop.classList.add('opacity-0', 'pointer-events-none');
                backdrop.classList.remove('opacity-100', 'pointer-events-auto');
            }
        }
    };

    // Change Cart header buttons to use toggleCart instead of navigating
    const cartBtns = document.querySelectorAll('button[onclick="window.location.href=\'/cart\'"]');
    cartBtns.forEach(btn => {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', toggleCart);
    });

    updateCartUI();

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Fix Auth Buttons
    const loginBtns = document.querySelectorAll('button[onclick="window.location.href=\'/auth\'"]');
    if (token && user) {
        loginBtns.forEach(btn => {
            btn.innerText = 'LOGOUT';
            btn.removeAttribute('onclick');
            btn.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
            });
        });
    }

    // Mark subtotal element with class for easy query
    const subtotalElms = document.querySelectorAll('#cart-drawer .space-y-xs .text-primary');
    if (subtotalElms.length > 0) {
        subtotalElms[0].classList.add('subtotal');
    }
});
