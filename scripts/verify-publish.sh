#!/bin/bash

# Pre-publish verification script
# Run this before publishing to npm

echo "🔍 Editora Pre-Publish Verification"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to print success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print error
error() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "1. Checking npm login status..."
if npm whoami > /dev/null 2>&1; then
    success "Logged in to npm as $(npm whoami)"
else
    error "Not logged in to npm. Run 'npm login' first."
fi
echo ""

echo "2. Checking package.json files..."
for pkg in packages/core packages/react packages/plugins packages/themes; do
    if [ -f "$pkg/package.json" ]; then
        success "Found $pkg/package.json"
    else
        error "Missing $pkg/package.json"
    fi
done
echo ""

echo "3. Checking required files..."
REQUIRED_FILES=(
    "LICENSE"
    "README.md"
    "CHANGELOG.md"
    "packages/core/README.md"
    "packages/react/README.md"
    "packages/plugins/README.md"
    "packages/themes/README.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        success "Found $file"
    else
        error "Missing $file"
    fi
done
echo ""

echo "4. Running build..."
if npm run build > /dev/null 2>&1; then
    success "Build successful"
else
    error "Build failed. Run 'npm run build' to see errors."
fi
echo ""

echo "5. Checking build outputs..."
BUILD_DIRS=(
    "packages/core/dist"
    "packages/react/dist"
    "packages/plugins/dist"
    "packages/themes/dist"
)

for dir in "${BUILD_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        success "Found $dir"
    else
        error "Missing $dir - build may have failed"
    fi
done
echo ""

echo "6. Checking TypeScript definitions..."
for pkg in packages/core packages/react packages/plugins packages/themes; do
    if [ -f "$pkg/dist/index.d.ts" ]; then
        success "Found $pkg/dist/index.d.ts"
    else
        warning "Missing $pkg/dist/index.d.ts"
    fi
done
echo ""

echo "7. Checking package access..."
for pkg in packages/core packages/react packages/plugins packages/themes; do
    ACCESS=$(node -p "require('./$pkg/package.json').publishConfig?.access || 'undefined'")
    if [ "$ACCESS" = "public" ]; then
        success "$pkg has access: public"
    else
        error "$pkg missing publishConfig.access: public"
    fi
done
echo ""

echo "8. Verifying no uncommitted changes..."
if [ -z "$(git status --porcelain)" ]; then
    success "Working directory clean"
else
    warning "You have uncommitted changes. Commit or stash them before publishing."
    git status --short
fi
echo ""

# Summary
echo "===================================="
echo "Summary:"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready to publish.${NC}"
    echo ""
    echo "To publish, run:"
    echo "  npm run publish:all"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ ${WARNINGS} warning(s) found${NC}"
    echo "You can still publish, but review warnings first."
    exit 0
else
    echo -e "${RED}✗ ${ERRORS} error(s) found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ ${WARNINGS} warning(s) found${NC}"
    fi
    echo "Fix errors before publishing."
    exit 1
fi
