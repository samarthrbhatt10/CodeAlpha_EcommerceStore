const fetchProducts = async () => {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        
        const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-12');
        if (gridContainer) {
            gridContainer.innerHTML = ''; // clear static items
            
            products.forEach(product => {
                const productHtml = `
                <div class="md:col-span-4 group h-full">
                    <div class="glass-card rounded-xl overflow-hidden h-full flex flex-col cursor-pointer" onclick="window.location.href='/pdp?id=${product._id}'">
                        <div class="relative h-[280px] overflow-hidden">
                            <img class="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" src="${product.images[0]}" />
                            ${product.images.length > 1 ? `<div class="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background-image: url('${product.images[1]}')"></div>` : ''}
                            <div class="absolute top-sm left-sm">
                                <div class="holographic-sticker px-xs py-[2px] text-[10px] rounded border-2">${product.rarity}</div>
                            </div>
                        </div>
                        <div class="p-md bg-surface-container-lowest/50 flex-grow border-t-border-width border-surface-variant flex flex-col justify-between">
                            <div>
                                <h3 class="font-label-bold text-headline-md text-primary">${product.name}</h3>
                                <span class="text-primary-fixed font-label-bold text-label-bold">$${product.price.toFixed(2)}</span>
                            </div>
                            <button class="mt-md bg-secondary-container text-on-secondary-container font-label-bold text-label-bold px-md py-sm rounded-lg border-border-width border-on-surface shadow-offset-shadow transition-all active:translate-x-1 active:translate-y-1 active:shadow-none w-full flex items-center justify-center gap-xs" onclick="event.stopPropagation(); addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                                <span class="material-symbols-outlined" data-icon="flash_on">flash_on</span>
                                INSTANT COP
                            </button>
                        </div>
                    </div>
                </div>
                `;
                gridContainer.insertAdjacentHTML('beforeend', productHtml);
            });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});
