const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:3000';

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  fs.mkdirSync(path.join(__dirname, 'screenshots'), { recursive: true });

  // Helper to collect console errors
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  // 1. HOME
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '1_home.png') });
  console.log('✅ 1. Home captured');

  // 2. CATALOG (with real products)
  await page.goto(`${BASE}/catalog`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000)); // wait for products to load
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '2_catalog.png') });
  const productCount = await page.evaluate(() => document.querySelectorAll('#product-grid > div').length);
  console.log(`✅ 2. Catalog captured — ${productCount} products visible`);

  // 3. PDP
  const products = await page.evaluate(async () => {
    const r = await fetch('/api/products');
    return r.json();
  });
  const pid = products[0]?._id;
  await page.goto(`${BASE}/pdp?id=${pid}`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '3_pdp.png') });
  const pdpTitle = await page.evaluate(() => document.getElementById('pdp-heading')?.textContent);
  const pdpPrice = await page.evaluate(() => document.getElementById('pdp-price')?.textContent);
  console.log(`✅ 3. PDP captured — Title: "${pdpTitle}" | Price: "${pdpPrice}"`);

  // 4. PDP — Add to cart
  await page.click('#pdp-add-btn');
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '4_pdp_added.png') });
  console.log('✅ 4. Added to cart');

  // 5. CART
  await page.goto(`${BASE}/cart`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '5_cart.png') });
  const cartItems = await page.evaluate(() => document.querySelectorAll('#cart-items-list > div').length);
  const emptyCartVisible = await page.evaluate(() => !document.getElementById('empty-cart')?.classList.contains('hidden'));
  console.log(`✅ 5. Cart captured — ${cartItems} item divs | Empty state visible: ${emptyCartVisible}`);

  // 6. AUTH
  await page.goto(`${BASE}/auth`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '6_auth.png') });
  const mascotVisible = await page.evaluate(() => !!document.getElementById('mascot-container'));
  console.log(`✅ 6. Auth captured — Mascot: ${mascotVisible}`);

  // 7. ADMIN (unauthenticated — should show ACCESS DENIED)
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '7_admin_locked.png') });
  const hasAccessDenied = await page.evaluate(() => 
    document.body.textContent.includes('ACCESS DENIED') || document.body.textContent.includes('AUTHENTICATE')
  );
  console.log(`✅ 7. Admin (locked) — Access Denied shown: ${hasAccessDenied}`);

  // 8. PROFILE (unauthenticated — should show auth required)
  await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '8_profile.png') });

  // 9. SETTINGS
  await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, 'screenshots', '9_settings.png') });
  console.log('✅ 9. Settings captured');

  // Summary
  console.log('\n═══════════════════════════════════════');
  console.log('Console errors collected:', consoleErrors.length);
  consoleErrors.forEach(e => console.log('  ⚠️', e.substring(0, 100)));
  console.log('All screenshots saved to ./screenshots/');

  await browser.close();
})();
