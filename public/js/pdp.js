// pdp.js — Product Detail Page

let currentProduct = null;
let selectedSize = null;

// ─── STAR RATING ────────────────────────────────────────────
function renderStars(rating) {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(rating));
}

// ─── GALLERY SWITCHER ────────────────────────────────────────
function setMainImage(src, thumbEl) {
    const mainImg = document.getElementById('pdp-main-img');
    if (mainImg) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
            mainImg.src = src;
            mainImg.style.opacity = '1';
        }, 150);
    }
    document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('ring-2', 'ring-primary-container'));
    if (thumbEl) thumbEl.classList.add('ring-2', 'ring-primary-container');
}

// ─── SIZE SELECTION ──────────────────────────────────────────
function selectSize(size, btn) {
    selectedSize = size;
    document.querySelectorAll('.size-btn').forEach(b => {
        b.classList.remove('bg-primary-container', 'text-on-primary-container', 'border-black');
        b.classList.add('bg-surface-container', 'text-on-surface', 'border-surface-container-highest');
    });
    btn.classList.add('bg-primary-container', 'text-on-primary-container', 'border-black');
    btn.classList.remove('bg-surface-container', 'text-on-surface', 'border-surface-container-highest');
    document.getElementById('selected-size-label').textContent = size;
}

// ─── BUILD PAGE ──────────────────────────────────────────────
function buildPDP(product) {
    currentProduct = product;
    selectedSize = product.sizes?.[0] || 'OS';
    document.title = `${product.name} | DOPAMINE CLUB`;

    // Title & meta
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('pdp-title', product.name);
    set('pdp-desc', product.description);
    set('pdp-price', `$${product.price.toFixed(2)}`);
    set('pdp-rarity', product.rarity || 'STANDARD');
    set('pdp-category', product.category || '');
    set('pdp-reviews', `(${(product.reviewCount || 0).toLocaleString()} reviews)`);
    set('pdp-rating-text', product.rating?.toFixed(1) || '4.5');
    set('selected-size-label', selectedSize);

    // Float price
    set('pdp-float-price', `$${product.price.toFixed(2)}`);

    // Original price / discount
    const originalPriceEl = document.getElementById('pdp-original-price');
    const discountEl = document.getElementById('pdp-discount');
    if (product.originalPrice && originalPriceEl) {
        originalPriceEl.textContent = `$${product.originalPrice.toFixed(2)}`;
        originalPriceEl.classList.remove('hidden');
        const discount = Math.round((1 - product.price / product.originalPrice) * 100);
        if (discountEl) {
            discountEl.textContent = `-${discount}%`;
            discountEl.classList.remove('hidden');
        }
    }

    // Stars
    const starsEl = document.getElementById('pdp-stars');
    if (starsEl) starsEl.textContent = renderStars(product.rating || 4.5);

    // Stock badge
    const stockEl = document.getElementById('pdp-stock');
    if (stockEl) {
        if (product.stock <= 5) {
            stockEl.textContent = `Only ${product.stock} left!`;
            stockEl.className = 'font-label-bold text-xs text-red-400';
        } else if (product.stock <= 20) {
            stockEl.textContent = `${product.stock} left — selling fast`;
            stockEl.className = 'font-label-bold text-xs text-yellow-400';
        } else {
            stockEl.textContent = 'In Stock';
            stockEl.className = 'font-label-bold text-xs text-[#c3f400]';
        }
    }

    // Main image
    const mainImg = document.getElementById('pdp-main-img');
    if (mainImg && product.images?.[0]) {
        mainImg.src = product.images[0];
        mainImg.style.transition = 'opacity 0.15s ease';
        mainImg.onerror = () => mainImg.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800';
    }

    // Thumbnails
    const thumbContainer = document.getElementById('pdp-thumbs');
    if (thumbContainer && product.images?.length > 1) {
        thumbContainer.innerHTML = product.images.map((img, i) => `
            <div class="pdp-thumb aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? 'border-primary-container ring-2 ring-primary-container' : 'border-surface-container-highest'} hover:border-primary-container"
                 onclick="setMainImage('${img}', this)">
                <img src="${img}" alt="View ${i + 1}" class="w-full h-full object-cover" onerror="this.parentElement.style.display='none'"/>
            </div>
        `).join('');
    } else if (thumbContainer) {
        thumbContainer.style.display = 'none';
    }

    // Sizes
    const sizeContainer = document.getElementById('pdp-sizes');
    if (sizeContainer && product.sizes?.length > 0) {
        sizeContainer.innerHTML = product.sizes.map((size, i) => `
            <button class="size-btn font-label-bold text-sm px-md py-xs rounded border-2 transition-all hover:border-primary-container ${i === 0 ? 'bg-primary-container text-on-primary-container border-black' : 'bg-surface-container text-on-surface border-surface-container-highest'}"
                    onclick="selectSize('${size}', this)">
                ${size}
            </button>
        `).join('');
    } else if (sizeContainer) {
        sizeContainer.closest('[id="size-section"]')?.remove();
    }

    // Tags
    const tagsEl = document.getElementById('pdp-tags');
    if (tagsEl && product.tags?.length > 0) {
        tagsEl.innerHTML = product.tags.map(t => `<span class="text-xs font-label-bold px-xs py-[2px] bg-surface-container-high border border-surface-container-highest rounded text-on-surface-variant uppercase">#${t}</span>`).join('');
    }

    // Add to cart button
    const addBtn = document.getElementById('pdp-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (!selectedSize && product.sizes?.length > 0) {
                showToast('Please select a size first!', 'warning');
                document.getElementById('pdp-sizes')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            addToCart(currentProduct, selectedSize || 'OS');
        });
    }
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    const mainEl = document.querySelector('main');

    if (!productId) {
        if (mainEl) mainEl.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-[60vh] gap-md text-on-surface-variant">
                <span class="material-symbols-outlined text-6xl">search_off</span>
                <h1 class="font-headline-md text-primary">No product selected</h1>
                <a href="/catalog" class="bg-primary-container text-on-primary-container font-label-bold px-lg py-md rounded border-2 border-black shadow-[4px_4px_0px_#000]">Browse Catalog</a>
            </div>`;
        return;
    }

    // Loading state
    document.getElementById('pdp-title')?.closest('div')?.classList.add('animate-pulse');

    try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Product not found');
        const product = await res.json();
        buildPDP(product);
    } catch (err) {
        console.error('PDP error:', err);
        if (mainEl) mainEl.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-[60vh] gap-md">
                <span class="material-symbols-outlined text-6xl text-error">error</span>
                <h1 class="font-headline-md text-primary">Product not found</h1>
                <a href="/catalog" class="bg-primary-container text-on-primary-container font-label-bold px-lg py-md rounded border-2 border-black shadow-[4px_4px_0px_#000]">Back to Catalog</a>
            </div>`;
    }
});
