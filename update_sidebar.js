const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

const mappings = [
    { name: 'Dashboard', link: '/admin_dashboard' },
    { name: 'Inventory', link: '/admin_inventory' },
    { name: 'Orders', link: '/admin_orders' },
    { name: 'Analytics', link: '/admin_analytics' },
    { name: 'Settings', link: '/settings' },
    { name: 'Profile', link: '/profile' },
    { name: 'Tactical View', link: '/admin_dashboard' },
    { name: 'Mission Log', link: '/admin_orders' },
    { name: 'System Override', link: '/settings' },
    { name: 'Operator Stats', link: '/profile' }
];

for (const file of htmlFiles) {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // Simple replacement logic for any anchor tag containing these names 
    // This looks for `<a ... href="#"> ... <span>Name</span> ... </a>`
    // Since regex for HTML is fragile, we'll do something a bit more robust:
    
    // We will split the file by `<a `, process each anchor tag, and then join back.
    const parts = content.split('<a ');
    for (let i = 1; i < parts.length; i++) {
        const closeIdx = parts[i].indexOf('</a>');
        if (closeIdx !== -1) {
            const aTagContent = parts[i].substring(0, closeIdx);
            
            for (const map of mappings) {
                // If the anchor text or spans contain the name (case insensitive)
                if (new RegExp(`>\\s*${map.name}\\s*<`, 'i').test(aTagContent)) {
                    // Replace href="..." or href='...' with the new link
                    const newContent = aTagContent.replace(/href=["'][^"']*["']/, `href="${map.link}"`);
                    if (newContent !== aTagContent) {
                        parts[i] = newContent + parts[i].substring(closeIdx);
                        modified = true;
                    }
                    break;
                }
            }
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, parts.join('<a '), 'utf-8');
        console.log(`Updated sidebar/links in ${file}`);
    }
}
console.log('Sidebar update complete.');
