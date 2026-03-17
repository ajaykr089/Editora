import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Only include components we've created entry files for
const refactoredComponents = [
  "AppHeader",
  "Breadcrumb",
  "Card",
  "Collapsible",
  "Combobox",
  "Command",
  "CommandPalette",
  "Drawer",
  "FloatingToolbar",
  "Form",
  "HoverCard",
  "Input",
  "Label",
  "Layout",
  "Menu",
  "Menubar",
  "Popover",
  "QuickActions",
  "Rating",
  "Select",
  "SelectionPopup",
  "Sidebar",
  "Switch",
  "Tabs",
  "Textarea",
  "ToggleGroup",
  "Tree",
  "Wizard",
];

// Build entry points for refactored components
const input: Record<string, string> = {
  index: path.resolve(__dirname, 'src/index.tsx'),
};

refactoredComponents.forEach(component => {
  input[component] = path.resolve(__dirname, `src/${component}.tsx`);
});

// Build entry points for components directory (wildcard exports)
const componentsInput: Record<string, string> = {};
refactoredComponents.forEach(component => {
  componentsInput[`components/${component}`] = path.resolve(__dirname, `src/${component}.tsx`);
});

export default defineConfig({
  build: {
    lib: {
      entry: { ...input, ...componentsInput },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (entryName === 'index') {
          return `index.${format === 'es' ? 'esm' : 'cjs'}.js`;
        }
        if (entryName.startsWith('components/')) {
          return `${entryName}.${format === 'es' ? 'esm' : 'cjs'}.js`;
        }
        return `${entryName}.${format === 'es' ? 'esm' : 'cjs'}.js`;
      }
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@editora/ui-core', '@editora/toast'],
      output: {
        exports: 'named',
        interop: 'auto',
        esModule: true,
      },
    }
  }
});
