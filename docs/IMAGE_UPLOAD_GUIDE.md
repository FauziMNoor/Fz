# 📸 Image Upload Guide - Portfolio

**Status:** ✅ COMPLETE
**Date:** 2025-12-05
**Version:** 1.5.2

---

## 🎯 What's Been Implemented

### Image Upload Feature

✅ **Drag & Drop Upload** - Drop image directly to upload area
✅ **Click to Browse** - Click to select image from file system
✅ **Live Preview** - See image preview before submit
✅ **Supabase Storage** - Images stored in `portfolio-images` bucket
✅ **Auto URL Generation** - Public URL generated automatically
✅ **Delete/Replace** - Remove or replace uploaded image

---

## 🗄️ Storage Structure

### Supabase Storage Bucket

**Bucket:** `portfolio-images`
**Access:** Public (read), Authenticated (write)

**File Structure:**

```
portfolio-images/
└── {user_id}/
    ├── {portfolio_id}_cover_{timestamp}.jpg
    ├── {portfolio_id}_cover_{timestamp}.png
    └── ...
```

**Example:**

```
portfolio-images/
└── bb2e61da-8f0c-4f12-9fef-59f82db50d69/
    ├── temp_1733456789_cover_1733456790.jpg
    ├── abc123_cover_1733456800.png
    └── def456_cover_1733456810.jpg
```

---

## 🚀 How to Use

### Upload Cover Image

**Method 1: Drag & Drop**

```
1. Open create/edit portfolio form
2. Drag image file to upload area
3. Drop image
4. Preview appears
5. Fill other fields
6. Click "Create Portfolio"
```

**Method 2: Click to Browse**

```
1. Open create/edit portfolio form
2. Click on upload area
3. Select image from file browser
4. Preview appears
5. Fill other fields
6. Click "Create Portfolio"
```

### Remove/Replace Image

**Remove:**

```
1. Click X button on preview
2. Image removed
3. Upload area appears again
```

**Replace:**

```
1. Click X button to remove current image
2. Upload new image
```

---

## 📋 Upload Specifications

### Accepted Formats

- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF
- ✅ WebP
- ✅ SVG

### File Size

- **Max:** 5MB (recommended)
- **Optimal:** 500KB - 2MB

### Image Dimensions

- **Recommended:** 800x600px (4:3 ratio)
- **Min:** 400x300px
- **Max:** 2000x1500px

### File Naming

- Auto-generated: `{portfolio_id}_cover_{timestamp}.{ext}`
- Example: `temp_1733456789_cover_1733456790.jpg`

---

## 🔄 Upload Flow

### Create New Portfolio

```
User selects image
    ↓
File stored in state (coverImageFile)
    ↓
Preview generated (URL.createObjectURL)
    ↓
User fills form
    ↓
Click "Create Portfolio"
    ↓
Upload image to Supabase Storage
    ↓
Get public URL
    ↓
Create portfolio with image URL
    ↓
Success!
```

### Edit Existing Portfolio

```
Load existing portfolio
    ↓
Show current cover image (if exists)
    ↓
User can:
  - Keep current image
  - Upload new image (replaces old)
  - Remove image
    ↓
Click "Update Portfolio"
    ↓
If new image: Upload to Storage
    ↓
Update portfolio with new URL
    ↓
Success!
```

---

## 💻 Code Implementation

### Helper Functions

**Upload Cover Image:**

```javascript
import { uploadPortfolioCoverImage } from 'src/lib/supabase-client';

const coverImageUrl = await uploadPortfolioCoverImage(userId, portfolioId, file);
```

**Delete Portfolio Images:**

```javascript
import { deletePortfolioImages } from 'src/lib/supabase-client';

await deletePortfolioImages(userId, portfolioId);
```

### Form Usage

```javascript
const [coverImageFile, setCoverImageFile] = useState(null);
const [coverImagePreview, setCoverImagePreview] = useState(null);

const handleDropCoverImage = useCallback((acceptedFiles) => {
  const file = acceptedFiles[0];
  if (file) {
    setCoverImageFile(file);
    const preview = URL.createObjectURL(file);
    setCoverImagePreview(preview);
  }
}, []);

const handleRemoveCoverImage = useCallback(() => {
  setCoverImageFile(null);
  setCoverImagePreview(null);
}, []);

// In form
<Upload
  file={coverImagePreview || values.cover_image}
  onDrop={handleDropCoverImage}
  onDelete={handleRemoveCoverImage}
  accept={{ 'image/*': [] }}
/>;
```

---

## 🎨 UI Components

### Upload Area (Empty State)

```
┌─────────────────────────────────────┐
│                                     │
│         📁 Upload Icon              │
│                                     │
│    Drop image here or click         │
│         to browse                   │
│                                     │
│    (Max 5MB)                        │
│                                     │
└─────────────────────────────────────┘
```

### Upload Area (With Preview)

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │      [Image Preview]        │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                 [X] │  ← Delete button
└─────────────────────────────────────┘
```

---

## 🔐 Security

### Storage Policies (Already Set)

**Read (SELECT):**

- ✅ Public can view images
- Policy: `bucket_id = 'portfolio-images'`

**Write (INSERT):**

- ✅ Authenticated users can upload
- Policy: `bucket_id = 'portfolio-images' AND auth.role() = 'authenticated'`

**Update:**

- ✅ Users can update own images
- Policy: `bucket_id = 'portfolio-images' AND auth.uid()::text = (storage.foldername(name))[1]`

**Delete:**

- ✅ Users can delete own images
- Policy: Same as update

---

## 🧪 Testing

### Test Upload

1. **Navigate to:** http://localhost:3032/dashboard/portfolio/new
2. **Drag image** to upload area
3. **Verify:**
   - [ ] Preview appears
   - [ ] No errors in console
4. **Fill form** and submit
5. **Verify:**
   - [ ] Success toast
   - [ ] Portfolio created
   - [ ] Image displays in list
   - [ ] Image displays in public view

### Test Replace

1. **Edit existing portfolio**
2. **Click X** to remove current image
3. **Upload new image**
4. **Submit**
5. **Verify:**
   - [ ] New image saved
   - [ ] Old image replaced

### Test Remove

1. **Edit existing portfolio**
2. **Click X** to remove image
3. **Submit without uploading new**
4. **Verify:**
   - [ ] Portfolio saved without image
   - [ ] No broken image links

---

## 🐛 Troubleshooting

### Issue: Upload fails

**Check:**

- File size < 5MB?
- File format supported?
- User authenticated?
- Storage bucket exists?

**Solution:**

```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'portfolio-images';

-- Check policies
SELECT * FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%Portfolio%';
```

### Issue: Image not displaying

**Check:**

- Public URL correct?
- Image uploaded successfully?
- Storage policies allow read?

**Solution:**

- Check browser console for errors
- Verify URL in database
- Test URL directly in browser

### Issue: "Permission denied"

**Solution:**

- Verify user is authenticated
- Check storage policies
- Re-run storage policies from migration

---

## 📊 Storage Management

### View Uploaded Images

**Supabase Dashboard:**

```
1. Go to: Storage > portfolio-images
2. Browse folders by user_id
3. View/Download images
```

### Delete Old Images

**Manual:**

```
1. Go to Storage > portfolio-images
2. Select images
3. Click Delete
```

**Programmatic:**

```javascript
await deletePortfolioImages(userId, portfolioId);
```

---

## 💡 Best Practices

### Image Optimization

**Before Upload:**

- Resize to 800x600px
- Compress to < 500KB
- Use JPG for photos
- Use PNG for graphics

**Tools:**

- TinyPNG (https://tinypng.com/)
- Squoosh (https://squoosh.app/)
- ImageOptim (Mac)

### File Naming

**Auto-generated format:**

```
{portfolio_id}_cover_{timestamp}.{ext}

Examples:
- temp_1733456789_cover_1733456790.jpg
- abc123_cover_1733456800.png
```

**Benefits:**

- Unique filenames
- Easy to identify
- Prevents conflicts
- Sortable by timestamp

---

## 🎯 Future Enhancements

### Phase 4 (Optional)

- [ ] Multiple images upload
- [ ] Image cropping/editing
- [ ] Image compression on upload
- [ ] Progress indicator
- [ ] Drag & drop reordering
- [ ] Image gallery view
- [ ] Bulk upload
- [ ] CDN integration

---

## 📚 Related Documentation

- **Phase 3:** `PHASE_3_PORTFOLIO_MANAGEMENT.md`
- **Quick Start:** `QUICK_START_PORTFOLIO.md`
- **Storage Setup:** `SUPABASE_STORAGE_SETUP.md`

---

## ✅ Completion Checklist

- [x] Storage bucket created
- [x] Storage policies configured
- [x] Upload helper functions created
- [x] Form updated with Upload component
- [x] Drag & drop implemented
- [x] Preview implemented
- [x] Delete/Replace implemented
- [x] Error handling implemented
- [x] Documentation created

---

**Version:** 1.5.2
**Last Updated:** 2025-12-05
**Status:** ✅ Image Upload Complete!
