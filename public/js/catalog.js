// catalog.js — Dynamic product grid with filtering and search

let allProducts = [];
let activeCategory = 'ALL';
let searchQuery = '';

// ─── RENDER ──────────────────────────────────────────────────
function renderProductCard(product) {
    const rarity = product.rarity || 'CORE COLLECTION';
    return `
    <div class="md:col-span-4 group h-[450px]">
        <div class="glass-card rounded-xl overflow-hidden h-full flex flex-col cursor-pointer" onclick="window.location.href='/pdp.html?id=${product._id}'">
            <div class="relative flex-1 overflow-hidden bg-surface-container-high">
                <img class="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" src="${product.images[0]}" onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'" />
                ${product.images[1] ? `<div class="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background-image: url('${product.images[1]}')"></div>` : ''}
                
                <!-- Badge -->
                <div class="absolute top-sm left-sm">
                    <div class="holographic-sticker px-xs py-[2px] text-[10px] font-label-bold rounded border-2 uppercase text-black">${rarity}</div>
                </div>
                
                <!-- Favorite -->
                <div class="absolute top-md right-md z-20">
                    <button class="bg-surface/80 p-sm rounded-full border-border-width border-on-surface flex items-center justify-center group/heart hover:bg-secondary-container transition-all" onclick="event.stopPropagation(); burst(this)">
                        <span class="material-symbols-outlined text-secondary" data-icon="favorite">favorite</span>
                    </button>
                </div>
            </div>
            
            <div class="p-md bg-surface-container-lowest/50 border-t-border-width border-surface-variant flex flex-col justify-between shrink-0">
                <div class="flex justify-between items-start">
                    <h3 class="font-label-bold text-headline-md text-primary uppercase leading-tight truncate mr-2">${product.name}</h3>
                    <div class="text-primary-fixed font-label-bold text-headline-md">$${product.price.toFixed(2)}</div>
                </div>
                <button class="mt-md bg-secondary-container text-on-secondary-container font-label-bold text-label-bold px-md py-sm rounded-lg border-border-width border-on-surface shadow-offset-shadow transition-all active:translate-x-1 active:translate-y-1 active:shadow-none w-full flex items-center justify-center gap-xs" onclick="event.stopPropagation(); instantCop(this, '${product._id}')">
                    <span class="material-symbols-outlined" data-icon="flash_on">flash_on</span>
                    INSTANT COP
                </button>
            </div>
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
    btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> COP\\'D!';
    
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
