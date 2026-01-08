# Image Upload Guide for PulseAid

This guide explains how to upload and customize all images on the PulseAid website.

## Quick Start

All customizable images are managed through the `src/config/images.ts` file.

---

## Image Locations

### 1. Hero Background Image

**Current**: Unsplash helping hands image
**Location**: Hero section background

**To Replace:**
1. Place your image in `public/` folder (e.g., `public/hero-bg.jpg`)
2. Open `src/config/images.ts`
3. Change:
```typescript
hero: {
  background: '/hero-bg.jpg',  // Your custom image
}
```

**Recommended Size**: 1920x1080px or larger
**Format**: JPG or PNG
**File Size**: Under 500KB for best performance

---

### 2. Team Member Photos

**Current**: Placeholder profile images
**Location**: Meet Our Team section

**To Replace:**

1. Place images in `public/team/` folder:
   - `public/team/richard.jpg`
   - `public/team/vanessa.jpg`
   - `public/team/kelvin.jpg`

2. Open `src/config/images.ts`
3. Update:
```typescript
team: {
  richard: '/team/richard.jpg',
  vanessa: '/team/andy.jpg',
  kelvin: '/team/random.jpg',
}
```

**Recommended Size**: 400x400px (square)
**Format**: JPG or PNG
**File Size**: Under 200KB each

---

### 3. How It Works Images

**Current**: Placeholder illustrations
**Location**: How PulseAid Works section

**To Replace:**

1. Place images in `public/how-it-works/` folder:
   - `public/how-it-works/step-1.jpg` (Institutions Register)
   - `public/how-it-works/step-2.jpg` (Post Real Needs)
   - `public/how-it-works/step-3.jpg` (Helpers Make Impact)

2. Open `src/config/images.ts`
3. Update:
```typescript
howItWorks: {
  step1: '/how-it-works/step-1.jpg',
  step2: '/how-it-works/step-2.jpg',
  step3: '/how-it-works/step-3.jpg',
}
```

**Recommended Size**: 600x400px (3:2 ratio)
**Format**: JPG or PNG
**File Size**: Under 300KB each

---

## Complete Image Structure

```
public/
├── logo.svg                    # PulseAid logo (already customized)
├── favicon.svg                 # Browser icon (already customized)
├── hero-bg.jpg                 # Hero background (REPLACE THIS)
├── team/
│   ├── richard.jpg            # Richard's photo (REPLACE THIS)
│   ├── vanessa.jpg            # Vanessa's photo (REPLACE THIS)
│   └── kelvin.jpg             # Kelvin's photo (REPLACE THIS)
└── how-it-works/
    ├── step-1.jpg             # Step 1 illustration (REPLACE THIS)
    ├── step-2.jpg             # Step 2 illustration (REPLACE THIS)
    └── step-3.jpg             # Step 3 illustration (REPLACE THIS)
```

---

## Image Optimization Tips

### Before Uploading:

1. **Resize Images**
   - Use tools like:
     - TinyPNG (https://tinypng.com)
     - Squoosh (https://squoosh.app)
     - ImageOptim (Mac)
     - GIMP (Free)

2. **Compress Images**
   - Aim for 70-85% quality
   - JPG for photos
   - PNG for graphics with transparency

3. **Use WebP Format** (Advanced)
   - Better compression than JPG/PNG
   - Supported by all modern browsers
   - Change file extensions to `.webp`

---

## Step-by-Step: Replacing Hero Background

### Step 1: Prepare Your Image

1. Open your image in an image editor
2. Crop to 16:9 aspect ratio (e.g., 1920x1080)
3. Export as JPG, quality 80%
4. Name it `hero-bg.jpg`

### Step 2: Upload to Project

1. Copy `hero-bg.jpg` to `public/` folder
2. Your structure should look like:
```
public/
├── hero-bg.jpg  ← Your new image
├── logo.svg
└── favicon.svg
```

### Step 3: Update Configuration

1. Open `src/config/images.ts`
2. Find the `hero` section:
```typescript
hero: {
  background: 'https://images.unsplash.com/...',  // OLD
}
```
3. Replace with:
```typescript
hero: {
  background: '/hero-bg.jpg',  // NEW
}
```

### Step 4: View Changes

1. Save the file
2. The page will automatically reload
3. Your new hero image should appear

---

## Step-by-Step: Replacing Team Photos

### Step 1: Prepare Photos

1. Get square photos (400x400px ideal)
2. Crop to show face clearly
3. Export as JPG, quality 80%
4. Name them:
   - `richard.jpg`
   - `vanessa.jpg`
   - `kelvin.jpg`

### Step 2: Upload Photos

1. Create folder: `public/team/`
2. Copy all three photos into `public/team/`
3. Your structure:
```
public/
└── team/
    ├── richard.jpg
    ├── vanessa.jpg
    └── kelvin.jpg
```

### Step 3: Update Configuration

Open `src/config/images.ts`:

```typescript
team: {
  richard: '/team/richard.jpg',
  vanessa: '/team/vanessa.jpg',
  kelvin: '/team/kelvin.jpg',
}
```

### Step 4: Test

Scroll to "Meet Our Team" section to see your team photos!

---

## Step-by-Step: Replacing How It Works Images

### Step 1: Create/Find Images

You need 3 images representing:
1. **Step 1**: Institutions registering (forms, verification)
2. **Step 2**: Posting needs (communication, transparency)
3. **Step 3**: Helpers making impact (volunteers, donations)

### Step 2: Prepare Images

1. Size: 600x400px (or similar 3:2 ratio)
2. Format: JPG or PNG
3. Optimize for web
4. Name:
   - `step-1.jpg`
   - `step-2.jpg`
   - `step-3.jpg`

### Step 3: Upload Images

1. Create folder: `public/how-it-works/`
2. Copy all three images
3. Structure:
```
public/
└── how-it-works/
    ├── step-1.jpg
    ├── step-2.jpg
    └── step-3.jpg
```

### Step 4: Update Configuration

Open `src/config/images.ts`:

```typescript
howItWorks: {
  step1: '/how-it-works/step-1.jpg',
  step2: '/how-it-works/step-2.jpg',
  step3: '/how-it-works/step-3.jpg',
}
```

---

## Using External URLs

If you prefer to host images elsewhere (CDN, cloud storage):

```typescript
export const IMAGES = {
  hero: {
    background: 'https://your-cdn.com/hero-bg.jpg',
  },
  team: {
    richard: 'https://your-cdn.com/richard.jpg',
    vanessa: 'https://your-cdn.com/vanessa.jpg',
    kelvin: 'https://your-cdn.com/kelvin.jpg',
  },
  // ... etc
};
```

**Benefits of External Hosting:**
- Faster loading with CDN
- No impact on build size
- Easy to update without rebuilding

**Popular CDN Options:**
- Cloudinary
- imgix
- Amazon S3 + CloudFront
- Vercel Blob Storage

---

## Troubleshooting

### Image Not Showing?

1. **Check file path**:
   - Make sure image is in `public/` folder
   - Path should start with `/` (e.g., `/hero-bg.jpg`)

2. **Check file name**:
   - Exact match required (case-sensitive)
   - No spaces in filename

3. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Check browser console**:
   - F12 → Console tab
   - Look for 404 errors

### Image Too Large?

Compress using:
```bash
# Install Sharp (image optimizer)
npm install -g sharp-cli

# Optimize image
sharp input.jpg -o output.jpg --quality 80
```

### Image Wrong Size?

The site automatically scales images, but for best results:
- Hero: 1920x1080px minimum
- Team: 400x400px square
- How It Works: 600x400px (3:2 ratio)

---

## Best Practices

1. **Use Descriptive Names**: `hero-helping-hands.jpg` instead of `img1.jpg`
2. **Keep Organized**: Use folders (`team/`, `how-it-works/`)
3. **Optimize First**: Always compress before uploading
4. **Consistent Sizing**: Keep similar images the same size
5. **Test on Mobile**: Check how images look on small screens

---

## Advanced: Lazy Loading

For better performance, images automatically lazy-load. No configuration needed!

---

## Need Help?

- Image optimization: https://tinypng.com
- Free stock photos: https://unsplash.com
- Image editing: https://www.photopea.com (free online Photoshop)

For PulseAid help: richard@pulseaid.org

