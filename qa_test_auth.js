const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Catch console logs
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    
    // Catch network requests
    page.on('request', req => {
        if (req.url().includes('/api/auth')) {
            console.log('NETWORK REQ:', req.method(), req.url(), req.postData());
        }
    });
    
    page.on('response', async res => {
        if (res.url().includes('/api/auth')) {
            console.log('NETWORK RES:', res.status(), await res.text());
        }
    });

    const delay = ms => new Promise(res => setTimeout(res, ms));

    console.log('Navigating to /auth...');
    await page.goto('http://localhost:3000/auth');
    
    console.log('Clicking SIGN UP toggle...');
    await page.click('#btn-signup');
    await delay(500);
    
    const uiState = await page.evaluate(() => {
        return {
            authMode: window.authMode,
            buttonText: document.getElementById('submit-btn').textContent,
            titleHTML: document.getElementById('auth-title').innerHTML
        };
    });
    console.log('UI STATE AFTER TOGGLE:', uiState);
    
    console.log('Filling form...');
    await page.type('#signup-name', 'Test QA Specialist');
    // using a unique email so it doesn't fail with 'User already exists'
    await page.type('#auth-email', 'qa' + Date.now() + '@test.com');
    await page.type('#auth-password', 'password123');
    
    console.log('Clicking submit...');
    await page.click('#submit-btn');
    
    await delay(1000);
    
    const html = await page.content();
    if (html.includes('toast-container')) {
        const toasts = await page.$$eval('#toast-container > div', els => els.map(el => el.textContent));
        console.log('TOASTS:', toasts);
    }
    
    await browser.close();
})();
