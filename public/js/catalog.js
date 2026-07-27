// catalog.js — Dynamic product grid with filtering and search

let allProducts = [];
let activeCategory = 'ALL';
let searchQuery = '';

// ─── RENDER ──────────────────────────────────────────────────
function renderProductCard(product) {
    const rarity = product.rarity || 'CORE COLLECTION';
    const isRare = rarity === 'RARE';
    const isUltraRare = rarity === 'ULTRA_RARE';
    const glowClass = isUltraRare ? 'ultra-rare-glow' : (isRare ? 'rare-glow' : 'hover:border-primary-fixed hover:shadow-[0_0_15px_#c3f400]');
    const barColor = isUltraRare ? 'bg-secondary-container text-secondary-container' : 'bg-primary-fixed-dim text-primary-fixed-dim';
    
    // Simulate hype velocity between 5% and 80% based on string hash
    let hash = 0;
    for (let i = 0; i < product._id.length; i++) hash += product._id.charCodeAt(i);
    const hypePercent = (hash % 75) + 5;

    return `
    <div class="glass-card ${glowClass} rounded-xl overflow-hidden flex flex-col group h-full cursor-pointer" onclick="window.location.href='/pdp.html?id=${product._id}'">
        <div class="relative h-[400px] overflow-hidden bg-surface-container-high shrink-0">
            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${product.images[0]}" onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'" />
            <div class="absolute inset-0 bg-surface/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col p-md justify-center items-center text-center">
                <div class="w-full space-y-sm">
                    <div class="flex justify-between border-b border-surface-variant pb-xs">
                        <span class="text-[10px] font-label-bold uppercase text-on-surface-variant">CATEGORY</span>
                        <span class="text-xs font-label-bold text-primary-fixed">${product.category}</span>
                    </div>
                    <div class="flex justify-between border-b border-surface-variant pb-xs">
                        <span class="text-[10px] font-label-bold uppercase text-on-surface-variant">ID</span>
                        <span class="text-xs font-label-bold text-primary-fixed">#${product._id.substring(0, 6).toUpperCase()}</span>
                    </div>
                </div>
            </div>
            
            <div class="absolute top-sm left-sm holographic-sticker px-sm py-[2px] text-[10px] font-label-bold uppercase text-black rounded -rotate-3">${rarity}</div>
            
            <div class="absolute top-md right-md z-20">
                <button class="bg-surface/80 p-sm rounded-full border-border-width border-on-surface flex items-center justify-center group/heart hover:bg-secondary-container transition-all" onclick="event.stopPropagation(); burst(this)">
                    <span class="material-symbols-outlined text-secondary" data-icon="favorite">favorite</span>
                </button>
            </div>
        </div>
        <div class="p-md flex flex-col justify-between flex-grow">
            <div>
                <div class="flex justify-between items-start mb-sm">
                    <div class="min-w-0 pr-2">
                        <h3 class="font-headline-md text-primary text-xl uppercase truncate">${product.name}</h3>
                    </div>
                    <span class="text-primary-fixed font-headline-md shrink-0">$${product.price.toFixed(2)}</span>
                </div>
                <div class="space-y-1 mb-md">
                    <div class="flex justify-between text-[10px] font-label-bold uppercase ${barColor.split(' ')[1]}">
                        <span>HYPE_VELOCITY</span>
                        <span>${hypePercent}% REMAINING</span>
                    </div>
                    <div class="h-4 bg-surface-container-low border-2 border-surface-variant relative overflow-hidden">
                        <div class="absolute inset-0 w-[${hypePercent}%] ${barColor.split(' ')[0]} progress-stripe"></div>
                    </div>
                </div>
            </div>
            <button class="mt-auto w-full bg-primary-fixed text-on-primary-fixed font-label-bold py-md rounded-lg border-4 border-on-surface shadow-[4px_4px_0px_#0D0B18] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-xs" onclick="event.stopPropagation(); instantCop(this, '${product._id}')">
                <span class="material-symbols-outlined text-sm">bolt</span> INSTANT COP
            </button>
        </div>
    </div>`;
}

function renderGrid(products) {
    const grid = document.getElementById('product-grid');
    const emptyState = document.getElementById('empty-state');
    const count = document.getElementById('product-count');

    if (!grid) return;
    if (count) count.textContent = `${products.length} item${products.length !== 1 ? 's' : ''}`;

    if (products.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    grid.innerHTML = products.map(renderProductCard).join('');
}

// ─── FILTER & SEARCH ─────────────────────────────────────────
function filterProducts() {
    let filtered = [...allProducts];

    if (activeCategory !== 'ALL') {
        filtered = filtered.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.tags || []).some(t => t.toLowerCase().includes(q)) ||
            p.category.toLowerCase().includes(q)
        );
    }

    renderGrid(filtered);
}

function setCategory(category, btn) {
    activeCategory = category;
    document.querySelectorAll('[data-filter-btn]').forEach(b => {
        b.classList.remove('bg-primary-container', 'text-on-primary-container', 'border-black');
        b.classList.add('bg-surface-container-high', 'text-on-surface-variant', 'border-surface-container-highest');
    });
    btn.classList.add('bg-primary-container', 'text-on-primary-container', 'border-black');
    btn.classList.remove('bg-surface-container-high', 'text-on-surface-variant', 'border-surface-container-highest');
    filterProducts();
}

// ─── QUICK ADD ───────────────────────────────────────────────
function quickAddToCart(productId) {
    const product = allProducts.find(p => p._id === productId);
    if (!product) return;
    const defaultSize = (product.sizes && product.sizes[0]) || 'OS';
    addToCart(product, defaultSize);
}

// ─── LOADING STATE ───────────────────────────────────────────
function showSkeleton() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = Array(8).fill(0).map(() => `
        <div class="bg-surface-container-low border-2 border-surface-container-highest rounded-xl overflow-hidden animate-pulse">
            <div class="aspect-square bg-surface-container-high"></div>
            <div class="p-md space-y-sm">
                <div class="h-4 bg-surface-container-high rounded w-3/4"></div>
                <div class="h-3 bg-surface-container-high rounded w-1/2"></div>
                <div class="h-5 bg-surface-container-high rounded w-1/3 mt-sm"></div>
            </div>
        </div>
    `).join('');
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    showSkeleton();

    try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        allProducts = await res.json();
        renderGrid(allProducts);

        // Update featured counter
        const featuredCount = document.getElementById('featured-count');
        if (featuredCount) featuredCount.textContent = allProducts.filter(p => p.isFeatured).length;

    } catch (err) {
        console.error('Error fetching products:', err);
        const grid = document.getElementById('product-grid');
        if (grid) grid.innerHTML = `<div class="col-span-full text-center py-xl text-on-surface-variant">
            <span class="material-symbols-outlined text-4xl">wifi_off</span>
            <p class="mt-sm font-label-bold">Could not load products. Make sure the server is running.</p>
        </div>`;
    }

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            searchQuery = e.target.value;
            filterProducts();
        });
    }
});

// UI Effects
function burst(btn) {
    const colors = ['#abd600', '#ffb1c3', '#00dbe9', '#ffffff'];
    const icon = btn.querySelector('span');
    icon.style.fontVariationSettings = "'FILL' 1";
    icon.classList.add('scale-125');
    
    // Quick burst without generating 15 DOM nodes (simplified for performance)
    btn.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.2)' },
        { transform: 'scale(1)' }
    ], { duration: 300 });

    setTimeout(() => {
        icon.classList.remove('scale-125');
    }, 200);
}

function instantCop(btn, productId) {
    quickAddToCart(productId); // Call the existing quick add logic
    const originalContent = btn.innerHTML;
    btn.classList.remove('bg-secondary-container');
    btn.classList.add('bg-primary-fixed-dim');
    btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> COP&apos;D!';
    btn.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.1) rotate(2deg)' },
        { transform: 'scale(1)' }
    ], { duration: 300 });

    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.classList.remove('bg-primary-fixed-dim');
        btn.classList.add('bg-secondary-container');
    }, 2000);
}
