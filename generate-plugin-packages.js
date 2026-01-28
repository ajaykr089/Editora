const fs = require('fs');
const path = require('path');

const plugins = ['bold', 'italic', 'heading', 'paragraph', 'history', 'list', 'blockquote', 'table', 'image', 'link', 'codeblock'];

plugins.forEach(plugin => {
  const packagePath = path.join(__dirname, 'packages', 'plugins', plugin, 'package.json');
  
  const packageJson = {
    name: `@editora/plugin-${plugin}`,
    version: '1.0.0',
    description: `${plugin.charAt(0).toUpperCase() + plugin.slice(1)} plugin for Rich Text Editor`,
    main: 'dist/index.cjs.js',
    module: 'dist/index.esm.js',
    types: 'dist/index.d.ts',
    files: ['dist'],
    scripts: {
      build: 'rollup -c ../../../rollup.config.js',
      dev: 'rollup -c ../../../rollup.config.js -w',
      clean: 'rm -rf dist'
    },
    peerDependencies: {
      '@editora/core': '^1.0.0'
    },
    devDependencies: {
      typescript: '^5.0.0'
    }
  };
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Created package.json for ${plugin} plugin`);
});

console.log('🎉 All plugin package.json files created!');