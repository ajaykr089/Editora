# How to Add Images to GitHub README Files

## 📁 Image Directory Structure

```
your-project/
├── images/
│   ├── logo.png
│   ├── screenshot.png
│   ├── demo.gif
│   └── features.png
├── .github/
│   └── images/
│       └── workflow-screenshots/
└── README.md
```

## 🖼️ Image Formats Supported

- **PNG**: Best for screenshots, logos, diagrams
- **JPG/JPEG**: Good for photos, complex images
- **GIF**: Perfect for animations and demos
- **SVG**: Ideal for logos and simple graphics

## 📝 Markdown Syntax for Images

### Basic Image
```markdown
![Alt Text](images/filename.png)
```

### Image with Link
```markdown
[![Alt Text](images/logo.png)](https://your-website.com)
```

### Image with Size (GitHub doesn't support this directly)
```markdown
<img src="images/logo.png" alt="Logo" width="200" height="100">
```

### Centered Image
```markdown
<p align="center">
  <img src="images/logo.png" alt="Logo" width="300">
</p>
```

### Side by Side Images
```markdown
<table>
  <tr>
    <td><img src="images/image1.png" alt="Image 1" width="300"></td>
    <td><img src="images/image2.png" alt="Image 2" width="300"></td>
  </tr>
</table>
```

## 🎯 Best Practices

### 1. File Naming
```bash
# ✅ Good
editora-logo.png
features-overview.png
installation-guide.png

# ❌ Avoid
img1.png
screenshot_final_v2.jpg
```

### 2. Alt Text
```markdown
# ✅ Descriptive
![Editora Rich Text Editor Logo](images/logo.png)

# ❌ Generic
![Image](images/logo.png)
```

### 3. Image Optimization
- Keep file sizes under 1MB
- Use appropriate compression
- Consider WebP format for better compression

### 4. Organization
```markdown
# Group related images
images/
├── logos/
├── screenshots/
├── demos/
└── diagrams/
```

## 🚀 GitHub-Specific Tips

### Badges and Shields
```markdown
[![npm version](https://badge.fury.io/js/%40editora%2Fcore.svg)](https://badge.fury.io/js/%40editora%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

### Demo GIFs
```markdown
![Editor Demo](images/editor-demo.gif)
```

### Responsive Images
```markdown
<img src="images/responsive-demo.png" alt="Responsive Design" width="100%">
```

## 📦 NPM Package README

NPM displays your GitHub README.md, so use the same image paths:

```markdown
# My Package

![Package Logo](images/logo.png)

## Installation

```bash
npm install my-package
```

## Usage

![Usage Example](images/usage-demo.png)
```

## 🛠️ Tools for Image Management

### Online Tools
- **TinyPNG**: Compress PNG/JPG images
- **Squoosh**: Google's image optimizer
- **SVGOMG**: Optimize SVG files

### GitHub Features
- **GitHub Issues**: Drag & drop images
- **GitHub Wiki**: Automatic image hosting
- **GitHub Pages**: Host images for your site

## 📋 Image Checklist

- [ ] Images are in `images/` directory
- [ ] File names are descriptive
- [ ] Alt text is meaningful
- [ ] Images are optimized (< 1MB)
- [ ] Paths are relative (not absolute)
- [ ] Images display correctly on GitHub
- [ ] Images display correctly on NPM

## 🔍 Troubleshooting

### Images Not Showing
1. Check file path: `images/filename.png`
2. Verify file exists in repository
3. Ensure correct case sensitivity
4. Check if file is committed to git

### Large File Sizes
```bash
# Compress images
npm install -g imagemin-cli
imagemin images/* --out-dir=images/optimized
```

### Git LFS for Large Files
```bash
# For files > 100MB
git lfs install
git lfs track "*.png"
git lfs track "*.gif"
```

## 📖 Examples

### Project Logo
```markdown
<p align="center">
  <img src="images/editora-logo.png" alt="Editora Logo" width="200">
</p>
```

### Feature Screenshots
```markdown
### Light Theme
![Light Theme](images/theme-light.png)

### Dark Theme
![Dark Theme](images/theme-dark.png)
```

### Demo Animation
```markdown
### Live Demo
![Editor Demo](images/demo-animation.gif)
```

## 🎨 Creating Effective Images

### Screenshots
- Use consistent resolution (1920x1080 recommended)
- Capture clean, uncluttered interfaces
- Highlight important features with annotations

### Diagrams
- Use tools like Figma, Draw.io, or Lucidchart
- Keep simple and clear
- Use consistent colors and fonts

### Logos
- Provide multiple sizes (32x32, 64x64, 128x128, 256x256)
- Include transparent background (PNG)
- Consider SVG for scalability

Remember: A picture is worth a thousand words - use images to make your README more engaging and easier to understand!