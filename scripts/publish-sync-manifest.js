const path = require('path');
const { publishManifest } = require('../src/main/sync-manifest');
if (!process.argv[2]) throw new Error('Usage: node scripts/publish-sync-manifest.js DISTRIBUTION_DIRECTORY');
publishManifest(path.resolve(process.argv[2])).then(m => console.log(`Manifest ready: ${m.files.length} files`)).catch(error => { console.error(error.message); process.exitCode = 1; });
