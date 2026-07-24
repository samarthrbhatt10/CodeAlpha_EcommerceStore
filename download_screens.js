const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const data = JSON.parse(fs.readFileSync('C:/Users/samarth10/.gemini/antigravity-ide/brain/4e1f3850-337c-402a-a8f8-35bbec33b1d1/.system_generated/steps/168/output.txt', 'utf8'));

const nameMap = {
  '3cd9cab492eb4263b1c30552de0b991d': 'settings.html',
  '2a93f04aae8148b696a5cd41b427c55f': 'profile.html',
  '3d5df089e1e940498ac4f4453bbd8934': 'cart.html',
  'b4dd2d72fdf2424c836b5dbb2bef25b8': 'catalog.html',
  '4086cdc7a12f4120a2f51480a1781c86': 'home.html',
  '2404f56a7690483baca7cb1fb97eb8b6': 'auth.html',
  'ee6dabac89624b6c95a3f7d9c8b2bbca': 'admin.html',
  'aef430933d4f484fa844523810f46633': 'pdp.html'
};

data.screens.forEach(screen => {
  const idMatch = screen.name.match(/screens\/([a-z0-9]+)$/);
  if (idMatch && idMatch[1]) {
    const id = idMatch[1];
    const filename = nameMap[id];
    if (filename && screen.htmlCode && screen.htmlCode.downloadUrl) {
      const url = screen.htmlCode.downloadUrl;
      const dest = path.join(__dirname, 'public', filename);
      console.log(`Downloading ${filename} from ${url}`);
      execSync(`curl -L "${url}" -o "${dest}"`, { stdio: 'inherit' });
    }
  }
});

console.log('Finished downloading screens.');
