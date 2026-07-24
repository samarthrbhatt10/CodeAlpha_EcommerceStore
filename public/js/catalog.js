const fetchProducts = async () => {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        console.log('Products:', products);
        // Note: For now we retain the mock UI layout, but in a full implementation 
        // we would iterate over `products` to render the DOM.
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    
    // Check if logged in
    const token = localStorage.getItem('token');
    const loginBtn = document.querySelector('header button:nth-of-type(3)');
    if (token) {
        if(loginBtn) {
            loginBtn.innerText = 'LOGOUT';
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
            });
        }
    } else {
        if(loginBtn) {
            loginBtn.addEventListener('click', () => {
                window.location.href = '/auth';
            });
        }
    }
});
