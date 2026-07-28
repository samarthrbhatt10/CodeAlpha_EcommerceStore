// profile.js — Connected to correct API endpoints
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    const loadingEl = document.getElementById('profile-loading');
    const contentEl = document.getElementById('profile-content');
    const authRequiredEl = document.getElementById('profile-auth-required');

    if (!token || !userStr) {
        if (loadingEl) loadingEl.classList.add('hidden');
        if (contentEl) contentEl.classList.remove('hidden');
        if (authRequiredEl) authRequiredEl.classList.remove('hidden');
        return;
    }

    let user;
    try { user = JSON.parse(userStr); } catch (e) {
        window.location.href = '/auth';
        return;
    }

    document.title = `STATS: ${user.email} | DOPAMINE CLUB`;

    // Populate user info
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    if (nameEl) nameEl.textContent = (user.name || user.email.split('@')[0]).toUpperCase();
    if (emailEl) emailEl.textContent = user.email;

    // Fetch fresh user data
    try {
        const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const freshUser = await res.json();
            localStorage.setItem('user', JSON.stringify({ ...user, ...freshUser }));
            if (nameEl) nameEl.textContent = (freshUser.name || freshUser.email.split('@')[0]).toUpperCase();
            if (emailEl) emailEl.textContent = freshUser.email;
        }
    } catch(e) {}

    // Fetch orders
    let orders = [];
    try {
        const res = await fetch('/api/orders/myorders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) orders = await res.json();
    } catch(e) {}

    // Calculate stats
    const totalSpent = orders.reduce((acc, o) => {
        return acc + (o.totalAmount || o.items.reduce((a, i) => a + ((i.priceAtPurchase || (i.productId ? i.productId.price : 0) || 0) * (i.quantity || 1)), 0));
    }, 0);
    
    const rankTiers = [
        { min: 0, name: 'ROOKIE' }, { min: 1, name: 'COLLECTOR' },
        { min: 3, name: 'HYPE BEAST' }, { min: 7, name: 'VAULT ELITE' },
        { min: 15, name: 'S-TIER' }
    ];
    const rank = rankTiers.filter(r => orders.length >= r.min).pop()?.name || 'ROOKIE';

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('stat-orders', orders.length);
    setEl('stat-spent', '$' + totalSpent.toFixed(0));
    setEl('stat-rank', rank);
    setEl('stat-streak', Math.min(orders.length, 7));

    // Render order history
    const historyEl = document.getElementById('order-history');
    if (historyEl) {
        if (orders.length === 0) {
            historyEl.innerHTML = `
                <div class="text-center py-xl text-on-surface-variant">
                    <span class="material-symbols-outlined text-6xl">inbox</span>
                    <p class="mt-md font-body-md">No orders yet. Time to hit the vault.</p>
                    <button onclick="window.location.href='/catalog'" class="mt-lg bg-primary-fixed text-on-primary-fixed font-label-bold px-xl py-sm border-4 border-black neo-shadow uppercase">ENTER THE VAULT</button>
                </div>`;
        } else {
            historyEl.innerHTML = `
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b-4 border-black">
                                <th class="text-left py-sm px-md font-label-bold text-on-surface-variant uppercase text-xs">ORDER ID</th>
                                <th class="text-left py-sm px-md font-label-bold text-on-surface-variant uppercase text-xs">DATE</th>
                                <th class="text-right py-sm px-md font-label-bold text-on-surface-variant uppercase text-xs">TOTAL</th>
                                <th class="text-right py-sm px-md font-label-bold text-on-surface-variant uppercase text-xs">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.map(o => {
                                const date = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                const total = o.totalAmount || o.items.reduce((a, i) => a + ((i.priceAtPurchase || (i.productId ? i.productId.price : 0) || 0) * (i.quantity || 1)), 0);
                                const statusColors = {
                                    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                                    processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                                    shipped: 'bg-primary-fixed/20 text-primary-fixed border-primary-fixed/30',
                                    dispatched: 'bg-primary-fixed/20 text-primary-fixed border-primary-fixed/30',
                                    delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
                                    cancelled: 'bg-error/20 text-error border-error/30'
                                };
                                return `<tr class="border-b border-surface-container hover:bg-surface-container transition-colors">
                                    <td class="py-sm px-md font-label-bold text-secondary-container">#${o._id.slice(-6).toUpperCase()}</td>
                                    <td class="py-sm px-md text-on-surface-variant">${date}</td>
                                    <td class="py-sm px-md text-right font-label-bold text-primary-fixed">$${total.toFixed(2)}</td>
                                    <td class="py-sm px-md text-right">
                                        <span class="inline-block px-sm py-xs border rounded font-label-bold text-xs uppercase ${statusColors[o.status] || ''}">${o.status}</span>
                                    </td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>`;
        }
    }

    // Show content
    if (loadingEl) loadingEl.classList.add('hidden');
    if (contentEl) contentEl.classList.remove('hidden');
});
