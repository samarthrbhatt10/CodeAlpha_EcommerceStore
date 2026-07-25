// catalog.js — Dynamic product grid with filtering and search

let allProducts = [];
let activeCategory = 'ALL';
let searchQuery = '';

// ─── RENDER ──────────────────────────────────────────────────
function renderProductCard(product) {
    const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
    const stars = '★'.repeat(Math.floor(product.rating || 4)) + '☆'.repeat(5 - Math.floor(product.rating || 4));
    const rarityColors = {
        'LEGENDARY DROP': 'bg-[#ff4b89] text-white',
        'LIMITED EDITION': 'bg-[#c3f400] text-[#161e00]',
        'VAULT ITEM': 'bg-[#00dbe9] text-[#002022]',
        'CORE COLLECTION': 'bg-[#2b2836] text-white border border-white/20',
        'STANDARD': 'bg-surface-container-high text-on-surface-variant'
    };
    const rarityClass = rarityColors[product.rarity] || rarityColors['STANDARD'];

    return `
    <div class="group relative flex flex-col bg-surface-container-low border-2 border-surface-container-highest rounded-xl overflow-hidden hover:border-primary-container transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(195,244,0,0.15)] cursor-pointer" 
         onclick="window.location.href='/pdp?id=${product._id}'" 
         data-product-id="${product._id}">
        
        <!-- Image -->
        <div class="relative aspect-square overflow-hidden bg-surface-container">
            <img 
                src="${product.images[0]}" 
                alt="${product.name}" 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'"
            />
            ${product.images[1] ? `
            <img 
                src="${product.images[1]}" 
                alt="${product.name}" 
                class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                onerror="this.style.display='none'"
            />` : ''}

            <!-- Badges -->
            <div class="absolute top-sm left-sm flex flex-col gap-xs">
                <span class="font-label-bold text-[10px] px-xs py-[2px] rounded ${rarityClass} uppercase tracking-wider">${product.rarity}</span>
                ${discount ? `<span class="font-label-bold text-[10px] px-xs py-[2px] rounded bg-[#ff4b89] text-white">-${discount}% OFF</span>` : ''}
                ${product.stock <= 10 ? `<span class="font-label-bold text-[10px] px-xs py-[2px] rounded bg-red-900/80 text-red-200">ONLY ${product.stock} LEFT</span>` : ''}
            </div>

            <!-- Quick Add -->
            <div class="absolute bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-sm p-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button 
                    onclick="event.stopPropagation(); quickAddToCart('${product._id}')"
                    class="w-full bg-primary-container text-on-primary-container font-label-bold text-sm py-xs rounded border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-xs">
                    <span class="material-symbols-outlined text-base" style="font-variation-settings:'FILL' 1">add_shopping_cart</span>
                    QUICK ADD
                </button>
            </div>
        </div>

        <!-- Info -->
        <div class="p-md flex flex-col gap-xs flex-1">
            <div class="flex justify-between items-start gap-xs">
                <h3 class="font-label-bold text-primary text-sm leading-tight">${product.name}</h3>
                <span class="text-on-surface-variant text-xs flex-shrink-0">${product.category}</span>
            </div>

            <!-- Rating -->
            <div class="flex items-center gap-xs">
                <span class="text-[#c3f400] text-xs tracking-tight">${stars}</span>
                <span class="text-on-surface-variant text-xs">(${(product.reviewCount || 0).toLocaleString()})</span>
            </div>

            <!-- Sizes preview -->
            ${product.sizes && product.sizes.length > 0 ? `
            <div class="flex flex-wrap gap-xs mt-xs">
                ${product.sizes.slice(0, 4).map(s => `<span class="text-[10px] font-label-bold px-xs py-[2px] bg-surface-container border border-surface-container-highest rounded text-on-surface-variant">${s}</span>`).join('')}
                ${product.sizes.length > 4 ? `<span class="text-[10px] text-on-surface-variant">+${product.sizes.length - 4}</span>` : ''}
            </div>` : ''}

            <!-- Price -->
            <div class="flex items-baseline gap-sm mt-auto pt-sm">
                <span class="font-label-bold text-primary-container text-lg">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="text-on-surface-variant text-sm line-through">$${product.originalPrice.toFixed(2)}</span>` : ''}
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
