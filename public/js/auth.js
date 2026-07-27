// auth.js — Wired to correct API endpoints
let authMode = 'login';

window.handleAuth = async function() {
    const email = document.getElementById('auth-email')?.value?.trim();
    const password = document.getElementById('auth-password')?.value;
    const name = document.getElementById('signup-name')?.value?.trim();
    const submitBtn = document.getElementById('submit-btn');
    
    if (!email || !password) { showToast('Email and password required', 'warning'); return; }
    if (authMode === 'signup' && !name) { showToast('Name required for signup', 'warning'); return; }

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'AUTHENTICATING...';

    try {
        const isLogin = authMode === 'login';
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const body = isLogin 
            ? { email, password }
            : { name, email, password };

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (res.ok) {
            // API returns { _id, email, role, name, token } directly
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                _id: data._id,
                email: data.email,
                name: data.name,
                role: data.role
            }));
            
            showToast(isLogin ? '⚡ ACCESS GRANTED!' : '🔥 WELCOME TO THE CLUB!', 'success');
            setTimeout(() => {
                window.location.href = data.role === 'admin' ? '/admin' : '/catalog';
            }, 1200);
        } else {
            throw new Error(data.message || 'Authentication failed');
        }
    } catch (err) {
        showToast(err.message || 'Something went wrong', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
};

// Toggle login/signup UI
window.toggleAuth = function(type) {
    authMode = type;
    const toggleBg = document.getElementById('toggle-bg');
    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    const title = document.getElementById('auth-title');
    const signupFields = document.getElementById('signup-fields');
    const submitBtn = document.getElementById('submit-btn');

    if (type === 'signup') {
        toggleBg.style.transform = 'translateX(100%)';
        btnLogin.classList.remove('text-on-primary-fixed'); btnLogin.classList.add('text-on-surface-variant');
        btnSignup.classList.remove('text-on-surface-variant'); btnSignup.classList.add('text-on-primary-fixed');
        if (title) title.innerHTML = '<h2 class="font-headline-md text-headline-md text-primary mb-xs">JOIN THE CLUB</h2><p class="text-on-surface-variant">Rare aesthetics, zero friction.</p>';
        if (signupFields) signupFields.classList.remove('hidden');
        if (submitBtn) submitBtn.textContent = 'CREATE ACCOUNT';
    } else {
        toggleBg.style.transform = 'translateX(0%)';
        btnSignup.classList.add('text-on-surface-variant'); btnSignup.classList.remove('text-on-primary-fixed');
        btnLogin.classList.remove('text-on-surface-variant'); btnLogin.classList.add('text-on-primary-fixed');
        if (title) title.innerHTML = '<h2 class="font-headline-md text-headline-md text-primary mb-xs">WELCOME BACK</h2><p class="text-on-surface-variant">The arcade is waiting for you.</p>';
        if (signupFields) signupFields.classList.add('hidden');
        if (submitBtn) submitBtn.textContent = 'LOG IN';
    }
};

window.togglePassword = function() {
    const pw = document.getElementById('auth-password');
    const eye = document.getElementById('pw-eye');
    if (!pw) return;
    pw.type = pw.type === 'password' ? 'text' : 'password';
    if (eye) eye.textContent = pw.type === 'password' ? 'visibility' : 'visibility_off';
};

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
        const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch(e) { return null; } })();
        if (user) {
            window.location.href = user.role === 'admin' ? '/admin' : '/catalog';
            return;
        }
    }

    // Mascot eye tracking
    const mascot = document.getElementById('mascot-container');
    const eyeLeft = document.getElementById('eye-left');
    const eyeRight = document.getElementById('eye-right');
    
    if (mascot && eyeLeft && eyeRight) {
        document.addEventListener('mousemove', (e) => {
            const rect = mascot.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
            const dist = Math.min(10, Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2) / 20);
            const mx = Math.cos(angle) * dist;
            const my = Math.sin(angle) * dist;
            eyeLeft.style.transform = `translate(${mx}px, ${my}px)`;
            eyeRight.style.transform = `translate(${mx}px, ${my}px)`;
        });
    }
    
    // Enter key to submit
    document.getElementById('auth-form')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); window.handleAuth(); }
    });
});
