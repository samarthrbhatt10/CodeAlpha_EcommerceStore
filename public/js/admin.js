// admin.js — Admin Dashboard with live stats

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch(e) { return null; } })();

    if (!token || !user || user.role !== 'admin') {
        if (typeof showToast === 'function') showToast('Access denied. Admins only.', 'error');
        setTimeout(() => window.location.href = '/', 1500);
        return;
    }

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    // Fetch products
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        setEl('admin-product-count', products.length);
        setEl('admin-revenue', '$' + products.reduce((a, p) => a + p.price * Math.max(0, 100 - p.stock), 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        setEl('admin-low-stock', products.filter(p => p.stock <= 10).length);

        // Populate product table if it exists
        const tableBody = document.getElementById('admin-product-table');
        if (tableBody) {
            tableBody.innerHTML = products.map(p => `
                <tr class="border-b border-surface-container-highest hover:bg-surface-container transition-colors">
                    <td class="py-sm px-md">
                        <div class="flex items-center gap-sm">
                            <img src="${p.images[0]}" class="w-10 h-10 rounded object-cover border border-surface-container-highest" onerror="this.style.display='none'"/>
                            <div>
                                <p class="font-label-bold text-primary text-sm">${p.name}</p>
                                <p class="text-on-surface-variant text-xs">${p.category}</p>
                            </div>
                        </div>
                    </td>
                    <td class="py-sm px-md font-label-bold text-primary-container">$${p.price.toFixed(2)}</td>
                    <td class="py-sm px-md">
                        <span class="text-sm font-label-bold ${p.stock <= 10 ? 'text-red-400' : p.stock <= 30 ? 'text-yellow-400' : 'text-[#c3f400]'}">${p.stock}</span>
                    </td>
                    <td class="py-sm px-md">
                        <span class="text-xs font-label-bold px-xs py-[2px] rounded bg-surface-container-high border border-surface-container-highest">${p.rarity}</span>
                    </td>
                    <td class="py-sm px-md">
                        <button onclick="deleteProduct('${p._id}')" class="material-symbols-outlined text-sm text-error hover:scale-125 transition-transform">delete</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch(err) {
        console.error('Failed to load admin products:', err);
    }

    // Fetch orders
    try {
        const res = await fetch('/api/orders/all', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const orders = await res.json();
            setEl('admin-order-count', orders.length);
        }
    } catch(err) {
        setEl('admin-order-count', '—');
    }
});

async function deleteProduct(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            if (typeof showToast === 'function') showToast('Product deleted', 'success');
            document.querySelector(`button[onclick="deleteProduct('${id}')"]`)?.closest('tr')?.remove();
        }
    } catch(err) {
        if (typeof showToast === 'function') showToast('Delete failed', 'error');
    }
}
