# Favicon & Logo Change Guide

This guide will walk you through how to manually change the favicon and logo for your PulseAid website.

---

## 📋 Table of Contents
1. [Logo Replacement](#logo-replacement)
2. [Favicon Replacement](#favicon-replacement)
3. [File Formats & Requirements](#file-formats--requirements)
4. [Troubleshooting](#troubleshooting)

---

## 🎨 Logo Replacement

### Step 1: Prepare Your Logo File

1. **Recommended Format**: SVG (scalable, crisp at any size)
   - Alternative formats: PNG (with transparent background)
   - Recommended size: At least 200x200px for PNG

2. **File Naming**: Name your file `logo.svg` (or `logo.png`)

### Step 2: Replace the Logo File

1. Navigate to the `public` folder in your project
2. Locate the existing `logo.svg` file
3. **Replace** it with your new logo file
   - Keep the same filename: `logo.svg` (or update to match if using PNG)
   - Make sure the file is in the `public` folder

### Step 3: Update Code (If Using Different Format)

If you're using a PNG instead of SVG, you may need to update the image configuration:

1. Open `src/config/images.ts`
2. Find the logo path and update if needed:
   ```typescript
   logo: '/logo.svg',  // Change to '/logo.png' if using PNG
   ```

### Step 4: Clear Browser Cache

After replacing the logo:
- Hard refresh your browser: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Or clear your browser cache

---

## 🔖 Favicon Replacement

### Step 1: Prepare Your Favicon

1. **Recommended Format**: SVG (works best in modern browsers)
   - Alternative formats: ICO, PNG
   - Recommended sizes:
     - SVG: Any size (scalable)
     - PNG: 32x32px, 64x64px, or 512x512px
     - ICO: 16x16px, 32x32px, or multi-size

2. **File Naming**: Name your file `favicon.svg` (or `favicon.ico` / `favicon.png`)

### Step 2: Replace the Favicon File

1. Navigate to the `public` folder in your project
2. Locate the existing `favicon.svg` file
3. **Replace** it with your new favicon file
   - Keep the same filename: `favicon.svg`
   - Make sure the file is in the `public` folder

### Step 3: Update HTML (If Using Different Format)

If you're using a different format (ICO or PNG), update the HTML:

1. Open `index.html`
2. Find this line (around line 5):
   ```html
   <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
   ```
3. Update based on your format:
   - **For ICO**: 
     ```html
     <link rel="icon" type="image/x-icon" href="/favicon.ico" />
     ```
   - **For PNG**: 
     ```html
     <link rel="icon" type="image/png" href="/favicon.png" />
     ```

### Step 4: Add Multiple Sizes (Optional but Recommended)

For better browser support, you can add multiple favicon sizes:

```html
<!-- In index.html <head> section -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

### Step 5: Clear Browser Cache

After replacing the favicon:
- Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- **Note**: Favicons are heavily cached, so it may take a few minutes to update

---

## 📐 File Formats & Requirements

### Logo Requirements

| Format | Pros | Cons | Best For |
|--------|------|------|----------|
| **SVG** | Scalable, crisp at any size, small file size | Not supported in very old browsers | ✅ **Recommended** |
| **PNG** | Widely supported, transparent background | Fixed size, larger file | Fallback option |
| **JPG** | Small file size | No transparency, not ideal for logos | Not recommended |

### Favicon Requirements

| Format | Pros | Cons | Best For |
|--------|------|------|----------|
| **SVG** | Scalable, modern, works everywhere | Not supported in very old browsers | ✅ **Recommended** |
| **ICO** | Traditional, widely supported | Fixed sizes, larger file | Legacy support |
| **PNG** | Good quality, transparent | Fixed sizes | Good alternative |

### Size Recommendations

- **Logo**: 
  - SVG: Any size (scalable)
  - PNG: Minimum 200x200px, ideally 400x400px or larger
  
- **Favicon**:
  - SVG: Any size (scalable)
  - PNG: 32x32px, 64x64px, or 512x512px
  - ICO: 16x16px, 32x32px, or multi-size (16, 32, 48px)

---

## 🔍 Where Logo Appears

The logo appears in the following locations:

1. **Navigation Bar** (top left) - `src/App.tsx` line ~166
2. **Footer** (top left) - `src/App.tsx` line ~855
3. **Mobile Menu** (if applicable)

All locations automatically use the file from `public/logo.svg` via the image configuration.

---

## 🛠️ Troubleshooting

### Logo Not Showing

1. **Check file path**: Make sure the file is in the `public` folder
2. **Check filename**: Must match exactly (case-sensitive): `logo.svg`
3. **Clear cache**: Hard refresh your browser
4. **Check console**: Open browser DevTools (F12) and check for 404 errors
5. **Restart dev server**: Stop and restart your development server

### Favicon Not Updating

1. **Browser cache**: Favicons are heavily cached
   - Try incognito/private browsing mode
   - Clear browser cache completely
   - Wait a few minutes (can take up to 24 hours in some browsers)
2. **Check file path**: Must be in `public` folder
3. **Check HTML**: Verify the `<link>` tag in `index.html` points to correct file
4. **File format**: Ensure the format matches the `type` attribute in HTML

### Logo Looks Blurry

1. **Use SVG**: SVG format ensures crisp display at any size
2. **Check resolution**: If using PNG, ensure it's high resolution (at least 200x200px)
3. **Check CSS**: Make sure no CSS is forcing a specific size that's too large

### Logo Too Large/Small

1. **Check CSS classes**: The logo uses `w-10 h-10` classes (40x40px)
2. **Update size**: In `src/App.tsx`, find the logo `<img>` tags and adjust:
   ```tsx
   <img src={IMAGES.logo} alt="PulseAid Logo" className="w-12 h-12" />
   ```
   Change `w-10 h-10` to your desired size (e.g., `w-12 h-12` for 48px)

---

## 📝 Quick Reference

### Logo File Location
```
public/logo.svg
```

### Favicon File Location
```
public/favicon.svg
```

### Logo Usage in Code
```typescript
// src/config/images.ts
logo: '/logo.svg'

// Used in src/App.tsx
<img src={IMAGES.logo} alt="PulseAid Logo" className="w-10 h-10" />
```

### Favicon Usage in Code
```html
<!-- index.html -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

---

## ✅ Checklist

After replacing your logo/favicon:

- [ ] File placed in `public` folder
- [ ] Filename matches exactly (case-sensitive)
- [ ] File format is correct (SVG recommended)
- [ ] HTML updated if using different format
- [ ] Browser cache cleared
- [ ] Dev server restarted (if needed)
- [ ] Tested in browser
- [ ] Tested in incognito/private mode (for favicon)

---

## 💡 Pro Tips

1. **Always use SVG** when possible - it's scalable and looks perfect at any size
2. **Keep original files** - Save your source files in a separate folder
3. **Test in multiple browsers** - Chrome, Firefox, Safari, Edge
4. **Use transparent backgrounds** - PNG/SVG with transparency work best
5. **Optimize file size** - Use tools like SVGOMG for SVG optimization
6. **Create multiple favicon sizes** - For better cross-browser support

---

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. Check the browser console (F12) for error messages
2. Verify file permissions (file should be readable)
3. Ensure the file isn't corrupted
4. Try a different file format (e.g., PNG instead of SVG)
5. Check that your development server is running

---

**Last Updated**: 2025
**Maintained by**: PulseAid Team

