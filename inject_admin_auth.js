const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.startsWith('admin_') && f.endsWith('.html'));

const authScript = `
    <script>
        // Enforce Admin Auth
        async function checkAdminAuth() {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/auth.html';
                return;
            }
            try {
                const res = await fetch('/api/auth/me', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await res.json();
                if (!res.ok || data.role !== 'admin') {
                    window.location.href = '/auth.html';
                }
            } catch(e) {
                window.location.href = '/auth.html';
            }
        }
        checkAdminAuth();
    </script>
</body>`;

for (const file of htmlFiles) {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if script is already injected
    if (!content.includes('checkAdminAuth()')) {
        content = content.replace('</body>', authScript);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Injected Admin Auth check into ${file}`);
    }
}
console.log('Admin Auth Injection complete.');
