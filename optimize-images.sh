#!/bin/bash

# Image Optimization Script for README Images
# This script helps optimize images for better README performance

echo "🖼️  Editora Image Optimization Script"
echo "====================================="

# Check if images directory exists
if [ ! -d "images" ]; then
    echo "❌ Images directory not found. Creating it..."
    mkdir -p images
fi

# Check for image files
IMAGE_COUNT=$(find images -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.gif" -o -iname "*.svg" \) 2>/dev/null | wc -l)

if [ "$IMAGE_COUNT" -eq 0 ]; then
    echo "ℹ️  No images found in images/ directory."
    echo ""
    echo "📋 To optimize your images:"
    echo "1. Place your images in the images/ directory"
    echo "2. Run: chmod +x optimize-images.sh"
    echo "3. Run: ./optimize-images.sh"
    echo ""
    echo "🛠️  Recommended tools for optimization:"
    echo "- ImageOptim (macOS): https://imageoptim.com/mac"
    echo "- TinyPNG: https://tinypng.com/"
    echo "- Squoosh: https://squoosh.app/"
    exit 0
fi

echo "📊 Found $IMAGE_COUNT image(s) in images/ directory"
echo ""

# Check file sizes
echo "📏 Current image sizes:"
echo "------------------------"
find images -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.gif" -o -iname "*.svg" \) -exec ls -lh {} \; | awk '{print $5 "\t" $9}'
echo ""

# Recommendations
echo "💡 Recommendations:"
echo "-------------------"
echo "• Keep images under 1MB for better loading"
echo "• Use PNG for screenshots, SVG for logos/icons"
echo "• Compress images with TinyPNG or ImageOptim"
echo "• Use descriptive filenames (e.g., features-overview.png)"
echo ""

# Check for common issues
echo "🔍 Checking for common issues:"
echo "-------------------------------"

# Check for large files
LARGE_FILES=$(find images -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.gif" \) -size +1M 2>/dev/null)
if [ -n "$LARGE_FILES" ]; then
    echo "⚠️  Large files found (>1MB):"
    echo "$LARGE_FILES" | while read -r file; do
        echo "   - $(basename "$file")"
    done
    echo "   Consider compressing these files"
else
    echo "✅ No large files detected"
fi

# Check for non-standard filenames
echo ""
echo "📝 Image filename check:"
find images -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.gif" -o -iname "*.svg" \) | while read -r file; do
    basename_file=$(basename "$file")
    if [[ $basename_file =~ [A-Z] ]]; then
        echo "ℹ️  Consider lowercase filename: $basename_file"
    fi
done

echo ""
echo "🎯 Next steps:"
echo "1. Replace placeholder images in README_TEMPLATE.md with your actual images"
echo "2. Test your README on GitHub by pushing to a repository"
echo "3. Verify images load correctly on both GitHub and NPM"

echo ""
echo "✨ Done! Your images are ready for README integration."