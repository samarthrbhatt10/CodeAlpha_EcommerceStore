const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to /auth...');
    await page.goto('http://localhost:3000/auth');
    
    console.log('Logging in...');
    await page.type('#auth-email', 'qa1785108975580@test.com');
    await page.type('#auth-password', 'password123');
    await page.click('#submit-btn');
    
    // Wait for redirect to /admin
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    console.log('Current URL:', page.url());
    
    // Wait for the admin content to load
    await delay(2000);
    
    const screenshotPath = path.join('C:\\Users\\samarth10\\.gemini\\antigravity-ide\\brain\\4e1f3850-337c-402a-a8f8-35bbec33b1d1', 'admin_dashboard.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log('Screenshot saved to', screenshotPath);
    
    await browser.close();
})();
