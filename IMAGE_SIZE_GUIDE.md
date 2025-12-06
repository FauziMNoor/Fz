# 📐 Image Size Guide - Portfolio Cover Images

**Optimal image specifications for portfolio cover images**

---

## 🎯 Recommended Sizes

### Primary Recommendation (Best Quality)

**Dimensions:** `1200 x 900 pixels`
**Aspect Ratio:** 4:3
**File Size:** 200-500 KB
**Format:** JPG (for photos) or PNG (for graphics)

**Why this size?**

- Perfect for 4:3 aspect ratio display
- High quality on all devices
- Good balance between quality and file size
- Retina display ready

---

### Alternative Sizes

| Size            | Dimensions     | Use Case                   | File Size     |
| --------------- | -------------- | -------------------------- | ------------- |
| **Small**       | 800 x 600 px   | Fast loading, mobile-first | 100-200 KB    |
| **Medium**      | 1200 x 900 px  | ⭐ **Recommended**         | 200-500 KB    |
| **Large**       | 1600 x 1200 px | High-res displays          | 400-800 KB    |
| **Extra Large** | 2000 x 1500 px | Print quality (overkill)   | 800 KB - 1 MB |

---

## 📊 Aspect Ratio

### Portfolio Card Display

The portfolio card uses **4:3 aspect ratio** (`pt: '75%'`):

```
┌─────────────────────┐
│                     │
│                     │  ← Height = 75% of width
│     4:3 Ratio       │
│                     │
│                     │
└─────────────────────┘
```

**Supported Aspect Ratios:**

- ✅ **4:3** (1200x900, 800x600) - Perfect fit
- ✅ **16:9** (1920x1080, 1280x720) - Will crop top/bottom
- ✅ **1:1** (1000x1000) - Will crop sides
- ⚠️ **Portrait** (900x1200) - Not recommended

---

## 💾 File Size Limits

### Current Settings

**Max Upload:** 5 MB
**Recommended:** 200-500 KB
**Minimum:** 50 KB

### Why Keep Files Small?

- ✅ Faster page load
- ✅ Better mobile experience
- ✅ Lower bandwidth usage
- ✅ Better SEO scores

---

## 🎨 Image Formats

### Recommended Formats

**1. JPG/JPEG** (Best for photos)

- ✅ Smaller file size
- ✅ Good for photos with many colors
- ✅ Widely supported
- ❌ No transparency

**2. PNG** (Best for graphics)

- ✅ Lossless quality
- ✅ Supports transparency
- ✅ Good for logos, illustrations
- ❌ Larger file size

**3. WebP** (Modern format)

- ✅ Best compression
- ✅ Smaller than JPG
- ✅ Supports transparency
- ⚠️ Not supported in old browsers

**4. SVG** (Vector graphics)

- ✅ Scalable to any size
- ✅ Very small file size
- ✅ Perfect for logos
- ❌ Not suitable for photos

---

## 📱 Responsive Display

### Desktop (1920px)

```
Grid: 3 columns
Card width: ~400px
Image display: 400 x 300px (4:3)
Recommended: 1200 x 900px (3x scale)
```

### Tablet (768px)

```
Grid: 2 columns
Card width: ~350px
Image display: 350 x 262px (4:3)
Recommended: 1050 x 787px (3x scale)
```

### Mobile (375px)

```
Grid: 1 column
Card width: ~343px
Image display: 343 x 257px (4:3)
Recommended: 1029 x 771px (3x scale)
```

**Conclusion:** `1200 x 900px` covers all screen sizes perfectly!

---

## 🛠️ Image Optimization Tools

### Online Tools (Free)

**1. TinyPNG** (Recommended)

- URL: https://tinypng.com/
- Reduces file size by 50-70%
- Maintains quality
- Supports JPG & PNG

**2. Squoosh** (Google)

- URL: https://squoosh.app/
- Advanced compression options
- Compare before/after
- Multiple formats

**3. Compressor.io**

- URL: https://compressor.io/
- Simple interface
- Fast compression
- No registration needed

### Desktop Tools

**Mac:**

- ImageOptim (Free)
- Pixelmator Pro (Paid)

**Windows:**

- RIOT (Free)
- Adobe Photoshop (Paid)

**Cross-platform:**

- GIMP (Free)
- Photopea (Web-based, free)

---

## 📐 How to Resize Images

### Using Photopea (Free, Web-based)

1. Go to: https://www.photopea.com/
2. Open your image
3. Click: Image → Image Size
4. Set dimensions: 1200 x 900 px
5. Keep "Constrain Proportions" checked
6. Click OK
7. File → Export As → JPG
8. Quality: 80-90%
9. Download

### Using GIMP (Free, Desktop)

1. Open image in GIMP
2. Image → Scale Image
3. Width: 1200 px
4. Height: 900 px
5. Interpolation: Cubic
6. Scale
7. File → Export As
8. Choose JPG
9. Quality: 85%
10. Export

---

## 🎯 Quick Reference

### Perfect Portfolio Image

```
Dimensions: 1200 x 900 pixels
Aspect Ratio: 4:3
Format: JPG
Quality: 85%
File Size: 200-500 KB
Color Space: sRGB
```

### Checklist

- [ ] Dimensions: 1200 x 900 px (or 800 x 600 px minimum)
- [ ] Aspect ratio: 4:3
- [ ] File size: < 500 KB
- [ ] Format: JPG or PNG
- [ ] Optimized/compressed
- [ ] Good lighting and composition
- [ ] Relevant to portfolio content

---

## 📊 Size Comparison

### File Size Examples (1200 x 900 px)

| Quality      | JPG Size | PNG Size | WebP Size |
| ------------ | -------- | -------- | --------- |
| Low (60%)    | 100 KB   | 800 KB   | 80 KB     |
| Medium (80%) | 250 KB   | 1.2 MB   | 200 KB    |
| High (90%)   | 400 KB   | 1.5 MB   | 320 KB    |
| Max (100%)   | 800 KB   | 2 MB     | 640 KB    |

**Recommendation:** JPG at 85% quality = ~300 KB

---

## 🎨 Image Best Practices

### Composition

- ✅ Clear subject/focus
- ✅ Good lighting
- ✅ High contrast
- ✅ Relevant to content
- ❌ Blurry or pixelated
- ❌ Too dark or too bright
- ❌ Watermarks (unless necessary)

### Content

**For Projects:**

- Screenshots of interface
- Product photos
- Team working photos
- Results/outcomes

**For Presentations:**

- Slide preview
- Speaking photos
- Audience photos
- Event photos

**For Achievements:**

- Award photos
- Certificate images
- Trophy/medal photos
- Recognition moments

**For Publications:**

- Book/article cover
- Publication screenshot
- Author photo
- Research images

---

## 🔍 Testing Your Images

### Before Upload

1. **Check dimensions:**

   - Right-click image → Properties → Details
   - Should be 1200 x 900 px (or similar 4:3 ratio)

2. **Check file size:**

   - Should be < 500 KB
   - Ideally 200-400 KB

3. **Check quality:**
   - Zoom to 100%
   - Should be sharp and clear
   - No visible compression artifacts

### After Upload

1. **Check display:**

   - View portfolio card
   - Image should fill card perfectly
   - No stretching or distortion

2. **Check loading:**

   - Refresh page
   - Image should load quickly (< 2 seconds)

3. **Check mobile:**
   - View on mobile device
   - Image should look good
   - Fast loading

---

## 💡 Pro Tips

### 1. Use High-Quality Source

- Start with highest quality image
- Resize down (never up)
- Better to have too large than too small

### 2. Optimize for Web

- Use sRGB color space
- Remove EXIF data
- Compress before upload

### 3. Consistent Style

- Use similar lighting across all images
- Consistent color grading
- Similar composition style

### 4. Test on Multiple Devices

- Desktop
- Tablet
- Mobile
- Different browsers

---

## 📚 Resources

### Free Stock Photos (If Needed)

- **Unsplash:** https://unsplash.com/
- **Pexels:** https://www.pexels.com/
- **Pixabay:** https://pixabay.com/

### Image Optimization

- **TinyPNG:** https://tinypng.com/
- **Squoosh:** https://squoosh.app/
- **Compressor.io:** https://compressor.io/

### Image Editing

- **Photopea:** https://www.photopea.com/ (Free, web-based)
- **GIMP:** https://www.gimp.org/ (Free, desktop)
- **Canva:** https://www.canva.com/ (Free, web-based)

---

## ✅ Summary

**Perfect Portfolio Image:**

- **Size:** 1200 x 900 pixels
- **Ratio:** 4:3
- **Format:** JPG (85% quality)
- **File Size:** 200-500 KB
- **Optimized:** Yes (use TinyPNG)

**Quick Formula:**

```
Width ÷ Height = 1.33 (4:3 ratio)
Example: 1200 ÷ 900 = 1.33 ✅
```

---

**Version:** 1.5.3
**Last Updated:** 2025-12-05
