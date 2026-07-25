// profile.js — User profile with order history

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch(e) { return null; } })();

    if (!token || !user) {
        window.location.href = '/auth';
        return;
    }

    // Fill user info
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('profile-email', user.email);
    setEl('profile-username', user.email.split('@')[0].toUpperCase());
    setEl('profile-role', user.role === 'admin' ? '⭐ ADMIN' : '🎯 MEMBER');

    // Fetch orders
    const ordersContainer = document.getElementById('order-history');
    if (ordersContainer) {
        ordersContainer.innerHTML = `<div class="animate-pulse space-y-sm">
            ${Array(3).fill('<div class="h-16 bg-surface-container-high rounded-lg"></div>').join('')}
        </div>`;

        try {
            const res = await fetch('/api/orders/myorders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch orders');
            const orders = await res.json();

            setEl('order-count', orders.length);

            if (orders.length === 0) {
                ordersContainer.innerHTML = `
                    <div class="text-center py-lg text-on-surface-variant">
                        <span class="material-symbols-outlined text-4xl">receipt_long</span>
                        <p class="mt-sm font-label-bold">No orders yet. Time to cop some drops!</p>
                        <a href="/catalog" class="mt-md inline-block bg-primary-container text-on-primary-container font-label-bold px-lg py-sm rounded border-2 border-black shadow-[3px_3px_0px_#000]">SHOP NOW</a>
                    </div>`;
                return;
            }

            ordersContainer.innerHTML = orders.map(order => {
                const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const statusColors = {
                    pending: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
                    processing: 'bg-blue-900/50 text-blue-300 border-blue-700',
                    shipped: 'bg-purple-900/50 text-purple-300 border-purple-700',
                    delivered: 'bg-green-900/50 text-green-300 border-green-700',
                    cancelled: 'bg-red-900/50 text-red-300 border-red-700'
                };
                const statusClass = statusColors[order.status] || statusColors.pending;
                const itemCount = order.items?.reduce((a, i) => a + i.quantity, 0) || order.items?.length || 0;
                const orderTotal = order.items?.reduce((a, i) => a + (i.priceAtPurchase * i.quantity), 0) || 0;

                return `
                <div class="p-md bg-surface-container-low border-2 border-surface-container-highest rounded-xl">
                    <div class="flex justify-between items-start flex-wrap gap-sm">
                        <div>
                            <p class="font-label-bold text-primary text-sm">Order #${order._id.toString().slice(-8).toUpperCase()}</p>
                            <p class="text-on-surface-variant text-xs mt-xs">${date} · ${itemCount} item${itemCount !== 1 ? 's' : ''}</p>
                        </div>
                        <div class="flex items-center gap-sm">
                            <span class="text-xs font-label-bold px-sm py-xs rounded border ${statusClass} uppercase">${order.status}</span>
                            <span class="font-label-bold text-primary-container">$${orderTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>`;
            }).join('');

        } catch (err) {
            ordersContainer.innerHTML = `<p class="text-on-surface-variant text-sm">Could not load order history.</p>`;
        }
    }

    // Logout button
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('dopamine_cart');
        window.location.href = '/';
    });

    // Cart stats from localStorage
    const cart = (() => { try { return JSON.parse(localStorage.getItem('dopamine_cart')) || []; } catch(e) { return []; }})();
    setEl('cart-count', cart.reduce((a, i) => a + i.quantity, 0));
});
