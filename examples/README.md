# Editora Examples

This directory contains example projects demonstrating different use cases of the Editora Rich Text Editor (v1.0.1).

## 📁 Examples

### 1. Basic React Example (`basic/`)
Simple React editor setup with essential plugins. Great for getting started with Editora in React applications.

```bash
cd examples/basic
npm install
npm run dev
```

Features:
- Bold, italic, underline, strikethrough formatting
- Headings (H1-H6)
- Lists (bullet and numbered)
- Links and basic text formatting
- Undo/redo functionality

### 2. Vanilla HTML Example (`vanilla-html/`)
Pure HTML/CSS/JavaScript implementation without any framework dependencies.

```bash
# Simply open the file in your browser
open examples/vanilla-html/index.html
```

Features:
- Framework-agnostic implementation
- Custom toolbar with JavaScript event handlers
- Real-time content updates

### 3. Web Component Examples
Standalone HTML files demonstrating web component usage:

#### Basic Web Component (`webcomponent-basic.html`)
```bash
open examples/webcomponent-basic.html
```

#### Advanced Web Component (`webcomponent-advanced.html`)
```bash
open examples/webcomponent-advanced.html
```

#### All Plugins Web Component (`webcomponent-all-plugins.html`)
```bash
open examples/webcomponent-all-plugins.html
```

#### Toolbar Test (`webcomponent-toolbar-test.html`)
```bash
open examples/webcomponent-toolbar-test.html
```

Features:
- Zero framework dependencies
- Declarative plugin configuration
- Customizable toolbar layouts
- All 37+ native plugins available

### 4. Documentation Website (`web/`)
Complete documentation website with examples, API reference, and guides.

```bash
cd examples/web
# Open index.html in browser or serve with a local server
python3 -m http.server 8000
# Visit http://localhost:8000
```

Includes:
- Installation guides (NPM, CDN, Source)
- Feature documentation
- API reference
- Code examples
- Plugin documentation
- Keyboard shortcuts guide

### 5. Hospital Management Admin (`hospital-management/`)
Frontend-first SaaS-grade hospital admin dashboard built with the Editora UI ecosystem.

```bash
cd examples/hospital-management
npm install
npm run dev
```

Includes:
- App shell (sidebar/topbar/breadcrumb/command palette/quick actions)
- Auth UX (login, forgot password, role-guarded routing, forbidden/not-found)
- Dashboard, Patients, Appointments, Staff/RBAC, Wards, Pharmacy, Lab, Billing, Reports, Settings
- In-memory API + TanStack Query + RHF/Zod forms
- Toasts, confirmations, loading/empty/error states

### 6. Collaborative Editor (`collaborative/`)
Editor with comments, mentions, and real-time collaboration features.

```bash
cd examples/collaborative
npm install
npm run dev
```

## 🚀 Quick Start

Each example is a standalone project with its own dependencies. To run any example:

1. Navigate to the example directory
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open browser at `http://localhost:3000` (or specified port)

## 📚 Learn More

- [Main Documentation](../README.md)
- [@editora/react Documentation](../packages/react/README.md)
- [@editora/plugins Documentation](../packages/plugins/README.md)
- [@editora/themes Documentation](../packages/themes/README.md)
