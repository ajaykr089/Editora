#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packages = [
  'core',
  'react', 
  'themes',
  'performance',
  'plugins/bold',
  'plugins/italic',
  'plugins/heading',
  'plugins/paragraph',
  'plugins/history',
  'plugins/list',
  'plugins/blockquote',
  'plugins/table',
  'plugins/image',
  'plugins/link',
  'plugins/codeblock'
];

console.log('🚀 Building Rich Text Editor packages...\n');

// Clean all packages
console.log('🧹 Cleaning previous builds...');
packages.forEach(pkg => {
  const distPath = path.join(__dirname, 'packages', pkg, 'dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
  }
  fs.mkdirSync(distPath, { recursive: true });
});

// Build all packages
console.log('📦 Building packages...');
try {
  execSync('rollup -c', { stdio: 'inherit' });
  console.log('\n✅ Build completed successfully!');
  
  // Show build summary
  console.log('\n📊 Build Summary:');
  packages.forEach(pkg => {
    const distPath = path.join(__dirname, 'packages', pkg, 'dist');
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath);
      console.log(`  ✅ ${pkg}: ${files.length} files`);
    }
  });
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}