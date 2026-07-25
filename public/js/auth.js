// auth.js — Login & Registration with inline validation

document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) submitBtn.addEventListener('click', handleAuth);

    // If already logged in, redirect
    if (localStorage.getItem('token')) {
        window.location.href = '/catalog';
    }
});

function setError(fieldId, message) {
    const errEl = document.getElementById(`${fieldId}-error`);
    const inputEl = document.getElementById(fieldId);
    if (errEl) { errEl.textContent = message; errEl.classList.remove('hidden'); }
    if (inputEl) inputEl.classList.add('border-error', 'ring-1', 'ring-error');
}

function clearError(fieldId) {
    const errEl = document.getElementById(`${fieldId}-error`);
    const inputEl = document.getElementById(fieldId);
    if (errEl) { errEl.textContent = ''; errEl.classList.add('hidden'); }
    if (inputEl) inputEl.classList.remove('border-error', 'ring-1', 'ring-error');
}

function clearAllErrors() {
    ['email-input', 'password-input', 'name-input'].forEach(clearError);
}

async function handleAuth(e) {
    e.preventDefault();
    clearAllErrors();

    const submitBtn = document.getElementById('submit-btn');
    const isLogin = submitBtn?.dataset.mode !== 'signup';
    const email = document.getElementById('email-input')?.value?.trim();
    const password = document.getElementById('password-input')?.value;
    const name = document.getElementById('name-input')?.value?.trim();

    // Validation
    let hasError = false;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('email-input', 'Please enter a valid email address'); hasError = true;
    }
    if (!password || password.length < 6) {
        setError('password-input', 'Password must be at least 6 characters'); hasError = true;
    }
    if (!isLogin && !name) {
        setError('name-input', 'Name is required'); hasError = true;
    }
    if (hasError) return;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span>';

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = { email, password };
    if (!isLogin && name) payload.name = name;

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ _id: data._id, email: data.email, role: data.role }));
            if (typeof showToast === 'function') showToast(`Welcome${name ? ', ' + name : ''}! 🔥`, 'success');
            setTimeout(() => window.location.href = '/catalog', 1000);
        } else {
            const msg = data.message || 'Authentication failed';
            if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('user')) {
                setError('email-input', msg);
            } else if (msg.toLowerCase().includes('password')) {
                setError('password-input', msg);
            } else {
                setError('email-input', msg);
            }
        }
    } catch (err) {
        setError('email-input', 'Connection error — is the server running?');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = isLogin ? 'LOG IN' : 'CREATE ACCOUNT';
    }
}

// Toggle login/signup mode
window.setAuthMode = function(mode) {
    const submitBtn = document.getElementById('submit-btn');
    const nameSection = document.getElementById('name-section');
    const titleEl = document.getElementById('auth-mode-title');
    clearAllErrors();

    if (mode === 'signup') {
        if (submitBtn) { submitBtn.textContent = 'CREATE ACCOUNT'; submitBtn.dataset.mode = 'signup'; }
        if (nameSection) nameSection.classList.remove('hidden');
        if (titleEl) titleEl.textContent = 'Join the Club';
    } else {
        if (submitBtn) { submitBtn.textContent = 'LOG IN'; submitBtn.dataset.mode = 'login'; }
        if (nameSection) nameSection.classList.add('hidden');
        if (titleEl) titleEl.textContent = 'Welcome Back';
    }
};
