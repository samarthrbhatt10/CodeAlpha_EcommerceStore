document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    const form = document.querySelector('form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const nameInput = document.querySelector('input[type="text"]');
    const titleHeader = document.querySelector('#auth-title h2');

    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const isLogin = submitBtn.innerText.trim() === 'LOG IN';
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        
        const payload = {
            email: emailInput.value,
            password: passwordInput.value
        };
        
        // For register, we can optionally send a name or role if we want
        // if (!isLogin) payload.name = nameInput.value;
        
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = '/catalog';
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Auth Error:', error);
            alert('Something went wrong!');
        }
    });
});
