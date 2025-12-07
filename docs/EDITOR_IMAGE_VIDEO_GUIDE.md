# 📝 Editor Enhancement - Image Upload & Video Embed

## 🎯 Overview

Menambahkan fitur **upload gambar langsung** dan **embed video** ke dalam TipTap editor untuk artikel blog.

**Status:** ✅ **COMPLETE**

---

## ✨ Fitur Baru

### 1. 🖼️ Image Upload (Dual Mode)

**Sebelumnya:** ❌ Hanya bisa insert gambar dengan URL

**Sekarang:** ✅ Dua cara insert gambar:

#### Mode 1: Upload File

- Drag & drop atau click to browse
- Upload langsung ke Supabase Storage
- Preview sebelum upload
- Validasi:
  - File type: image/\* only
  - Max size: 5MB
- Auto-insert ke editor setelah upload
- Loading state saat upload

#### Mode 2: URL

- Paste image URL dari internet
- Langsung insert ke editor
- Untuk gambar yang sudah hosted

### 2. 🎬 Video Embed

**Platform Support:**

- ✅ YouTube (youtube.com, youtu.be)
- ✅ Vimeo (vimeo.com)
- ✅ Dailymotion (dailymotion.com)

**Input Format:**

- Full URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Short URL: `https://youtu.be/dQw4w9WgXcQ`
- Embed URL: `https://www.youtube.com/embed/dQw4w9WgXcQ`
- Video ID: `dQw4w9WgXcQ`

**Output:**

- Responsive iframe (16:9 aspect ratio)
- Full width dengan max-width
- Auto-detect platform dan convert ke embed URL

---

## 🏗️ Implementasi

### Files Created

```
src/components/editor/components/
├── image-upload-block.jsx  ✅ NEW - Upload & URL tabs
└── video-block.jsx          ✅ NEW - Video embed
```

### Files Modified

```
src/components/editor/
├── toolbar.jsx              ✅ Import & use new components
└── classes.js               ✅ Add video class
```

---

## 🎨 UI Components

### Image Upload Block

**Popover dengan 2 Tabs:**

**Tab 1: Upload**

```
┌─────────────────────────────┐
│ Upload  │  URL              │
├─────────────────────────────┤
│ Upload Image                │
│                             │
│ ┌─────────────────────────┐ │
│ │  [Cloud Icon]           │ │
│ │  Click to browse or     │ │
│ │  drag and drop          │ │
│ │  Max size: 5MB          │ │
│ └─────────────────────────┘ │
│                             │
│ [Upload & Insert Button]    │
└─────────────────────────────┘
```

**Tab 2: URL**

```
┌─────────────────────────────┐
│ Upload  │  URL              │
├─────────────────────────────┤
│ Image URL                   │
│                             │
│ [https://example.com/...]   │
│                             │
│ [Insert Image Button]       │
└─────────────────────────────┘
```

### Video Block

**Popover:**

```
┌─────────────────────────────┐
│ Embed Video                 │
│ Supported: YouTube, Vimeo,  │
│ Dailymotion                 │
│                             │
│ [https://youtube.com/...]   │
│ Paste video URL or video ID │
│                             │
│ [Insert Video Button]       │
└─────────────────────────────┘
```

---

## 🔧 Technical Details

### Image Upload Flow

```javascript
1. User selects file
   ↓
2. Validate file type & size
   ↓
3. Show preview
   ↓
4. User clicks "Upload & Insert"
   ↓
5. Upload to Supabase Storage (bucket: post-images)
   ↓
6. Get public URL
   ↓
7. Insert image to editor
   ↓
8. Show success toast
```

### Video Embed Flow

```javascript
1. User pastes video URL
   ↓
2. Extract video ID/platform
   ↓
3. Convert to embed URL
   ↓
4. Generate responsive iframe HTML
   ↓
5. Insert to editor
   ↓
6. Show success toast
```

### Video URL Parsing

**YouTube:**

```javascript
// Input formats
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
VIDEO_ID

// Output
https://www.youtube.com/embed/VIDEO_ID
```

**Vimeo:**

```javascript
// Input
https://vimeo.com/123456789

// Output
https://player.vimeo.com/video/123456789
```

**Dailymotion:**

```javascript
// Input
https://www.dailymotion.com/video/x8abcde

// Output
https://www.dailymotion.com/embed/video/x8abcde
```

### Responsive Video Iframe

```html
<div
  style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 1rem 0;"
>
  <iframe
    src="EMBED_URL"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>
```

**Aspect Ratio:** 16:9 (padding-bottom: 56.25%)

---

## 📦 Dependencies

**Existing (No new dependencies needed):**

- `@tiptap/react` - Editor framework
- `@tiptap/extension-image` - Image support
- `@mui/material` - UI components
- `src/lib/supabase-client.js` - Upload function

**Supabase Function Used:**

```javascript
uploadPostImage(postId, file);
```

---

## 🎯 Usage

### For Users

**Insert Image:**

1. Click image icon in toolbar
2. Choose tab:
   - **Upload:** Drag & drop or browse file
   - **URL:** Paste image URL
3. Click insert button

**Insert Video:**

1. Click video icon in toolbar
2. Paste YouTube/Vimeo/Dailymotion URL
3. Click "Insert Video"

### For Developers

**Image Upload Block:**

```jsx
import { ImageUploadBlock } from './components/image-upload-block';

<ImageUploadBlock editor={editor} />;
```

**Video Block:**

```jsx
import { VideoBlock } from './components/video-block';

<VideoBlock editor={editor} />;
```

---

## ✅ Validation & Error Handling

### Image Upload

**Validations:**

- ✅ File type must be image/\*
- ✅ File size max 5MB
- ✅ File must be selected

**Error Messages:**

- "Please select an image file"
- "Image size must be less than 5MB"
- "Please select an image"
- "Failed to upload image"

**Success:**

- "Image uploaded successfully"

### Video Embed

**Validations:**

- ✅ URL must not be empty
- ✅ URL must be from supported platform

**Error Messages:**

- "Please enter video URL"
- "Invalid video URL. Supported: YouTube, Vimeo, Dailymotion"

**Success:**

- "Video inserted successfully"

---

## 🎨 Styling

### Image in Editor

```css
.editor__content__image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}
```

### Video in Editor

```css
/* Responsive 16:9 container */
position: relative;
padding-bottom: 56.25%;
height: 0;
overflow: hidden;
max-width: 100%;
margin: 1rem 0;

/* Iframe fills container */
iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

---

## 🧪 Testing

### Test Image Upload

1. ✅ Upload valid image (JPG, PNG, GIF)
2. ✅ Try upload non-image file (should fail)
3. ✅ Try upload >5MB file (should fail)
4. ✅ Preview shows correctly
5. ✅ Delete preview works
6. ✅ Upload progress shows
7. ✅ Image appears in editor
8. ✅ Image URL is from Supabase Storage

### Test Image URL

1. ✅ Paste valid image URL
2. ✅ Image appears in editor
3. ✅ Empty URL shows error

### Test Video Embed

**YouTube:**

1. ✅ Full URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
2. ✅ Short URL: `https://youtu.be/dQw4w9WgXcQ`
3. ✅ Embed URL: `https://www.youtube.com/embed/dQw4w9WgXcQ`
4. ✅ Video ID: `dQw4w9WgXcQ`

**Vimeo:**

1. ✅ Full URL: `https://vimeo.com/123456789`

**Dailymotion:**

1. ✅ Full URL: `https://www.dailymotion.com/video/x8abcde`

**Invalid:**

1. ✅ Empty URL (should fail)
2. ✅ Invalid URL (should fail)
3. ✅ Unsupported platform (should fail)

---

## 🚀 Next Steps (Optional)

### Potential Enhancements

1. **Image Editing:**

   - Crop/resize before upload
   - Add alt text
   - Add caption

2. **More Video Platforms:**

   - TikTok
   - Instagram Reels
   - Twitter/X videos
   - Facebook videos

3. **Gallery:**

   - Browse previously uploaded images
   - Reuse images from media library

4. **Drag & Drop:**

   - Drag image directly into editor
   - Auto-upload on drop

5. **Video Thumbnail:**
   - Show video thumbnail in editor
   - Play button overlay

---

## 📝 Notes

- Image upload menggunakan bucket `post-images` yang sudah ada
- Video tidak di-upload, hanya embed iframe
- Video responsive dengan aspect ratio 16:9
- Semua validasi ada di client-side
- Toast notifications untuk feedback

---

**Created:** 2025-12-06
**Version:** 1.0.0
**Author:** Kiro AI Assistant
