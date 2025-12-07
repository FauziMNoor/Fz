# 📚 E-Book System Implementation Guide

## 🎯 Overview

Sistem e-book library untuk menampilkan dan mengelola koleksi e-book dengan integrasi Google Drive. Mendukung e-book karya sendiri dan koleksi dari penulis lain.

**Status:** ✅ Database Migration Complete | 🔄 UI Implementation In Progress

---

## 📋 Features

### Public Features

- ✅ Browse e-books dengan card layout yang rapi
- ✅ Filter by kategori (Tauhid, Fiqh, Sirah, Pendidikan, dll)
- ✅ Filter "Karya Fauzi M. Noor" (is_own_work)
- ✅ Search by title/author
- ✅ Featured e-books section
- ✅ E-book detail page dengan download button
- ✅ Download tracking & statistics
- ✅ View counter

### Dashboard Features

- ✅ CRUD e-book management
- ✅ Upload cover image
- ✅ Google Drive URL integration
- ✅ Category & tags management
- ✅ Featured & published toggle
- ✅ Statistics dashboard

---

## 🗄️ Database Schema

### Tables Created

#### 1. `ebooks` - Main e-book table

```sql
- id (UUID, PK)
- title (TEXT, required)
- slug (TEXT, unique, required)
- description (TEXT)
- cover_image_url (TEXT)
- google_drive_url (TEXT, required)  -- Link to Google Drive
- file_size (TEXT)                   -- "2.5 MB"
- file_format (TEXT)                 -- "PDF", "EPUB", "MOBI"
- author_name (TEXT, required)
- is_own_work (BOOLEAN)              -- TRUE for Fauzi's work
- category (TEXT)
- tags (TEXT[])
- download_count (INTEGER)
- view_count (INTEGER)
- is_featured (BOOLEAN)
- display_order (INTEGER)
- status (TEXT)                      -- "published", "draft", "archived"
- published_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

#### 2. `ebook_categories` - Predefined categories

```sql
- id (UUID, PK)
- name (TEXT, unique)
- slug (TEXT, unique)
- description (TEXT)
- icon (TEXT)
- color (TEXT)
- display_order (INTEGER)
- created_at (TIMESTAMPTZ)
```

**Default Categories:**

1. Tauhid & Aqidah
2. Fiqh
3. Sirah Nabawiyah
4. Pendidikan
5. Kepemimpinan
6. Pengembangan Diri

#### 3. `ebook_downloads` - Download tracking

```sql
- id (UUID, PK)
- ebook_id (UUID, FK)
- user_id (UUID, FK, nullable)  -- NULL for guest downloads
- ip_address (TEXT)
- user_agent (TEXT)
- downloaded_at (TIMESTAMPTZ)
```

### Indexes

- `idx_ebooks_slug` - Fast slug lookup
- `idx_ebooks_category` - Filter by category
- `idx_ebooks_is_own_work` - Filter own work
- `idx_ebooks_status` - Filter by status
- `idx_ebooks_published_at` - Sort by date
- `idx_ebooks_featured` - Featured e-books

### Triggers

- `trigger_ebooks_updated_at` - Auto-update updated_at
- `trigger_increment_download_count` - Auto-increment download count

### RLS Policies

- Public can view published e-books
- Authenticated users can view all e-books
- Authenticated users can manage e-books
- Anyone can track downloads

---

## 🔧 Helper Functions

File: `src/lib/supabase-client.js`

### Public Functions

```javascript
// Get published e-books
const ebooks = await getPublishedEbooks();

// Get e-book by slug
const ebook = await getEbookBySlug('tauhid-dalam-kehidupan');

// Get e-books by category
const ebooks = await getEbooksByCategory('tauhid-aqidah');

// Get own work e-books (Fauzi's work)
const ebooks = await getOwnWorkEbooks();

// Get featured e-books
const ebooks = await getFeaturedEbooks();

// Get e-book categories
const categories = await getEbookCategories();

// Track download
await trackEbookDownload(ebookId, userId, ipAddress, userAgent);

// Increment view count
await incrementEbookViewCount(ebookId);
```

### Dashboard Functions

```javascript
// Get all e-books (including drafts)
const ebooks = await getAllEbooks();

// Create e-book
const newEbook = await createEbook({
  title: 'Tauhid dalam Kehidupan',
  description: 'Panduan praktis...',
  google_drive_url: 'https://drive.google.com/file/d/xxxxx/view',
  file_size: '2.5 MB',
  file_format: 'PDF',
  author_name: 'Fauzi M. Noor',
  is_own_work: true,
  category: 'tauhid-aqidah',
  tags: ['tauhid', 'aqidah'],
  status: 'published',
  is_featured: true,
});

// Update e-book
const updated = await updateEbook(id, { title: 'New Title' });

// Delete e-book
await deleteEbook(id);

// Upload cover image
const coverUrl = await uploadEbookCover(ebookId, file);

// Delete cover image
await deleteEbookCover(coverUrl);

// Get statistics
const stats = await getEbookStats();
// Returns: { totalEbooks, totalDownloads, ownWorkCount }
```

---

## 🎨 UI Components Structure

### Public Pages

#### 1. E-Book List Page (`/ebook`)

```
src/app/ebook/
├── page.jsx                    # Main e-book list page
└── [slug]/
    └── page.jsx                # E-book detail page

src/sections/ebook/
├── ebook-list-view.jsx         # List view with filters
├── ebook-card.jsx              # E-book card component
├── ebook-filters.jsx           # Category & search filters
├── ebook-detail-view.jsx       # Detail page view
└── ebook-skeleton.jsx          # Loading skeleton
```

**Features:**

- Grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
- Filter by category
- Filter "Karya Saya" (is_own_work)
- Search by title/author
- Sort by (Latest, Popular, A-Z)
- Featured section at top

#### 2. E-Book Detail Page (`/ebook/[slug]`)

```
- Large cover image
- Title, author, category
- Full description
- File info (format, size)
- Download button (opens Google Drive)
- Download & view counter
- Related e-books section
```

### Dashboard Pages

#### 1. E-Book Management (`/dashboard/ebook`)

```
src/app/dashboard/ebook/
├── page.jsx                    # List all e-books
├── new/
│   └── page.jsx                # Create new e-book
└── [id]/
    └── edit/
        └── page.jsx            # Edit e-book

src/sections/ebook/
├── ebook-list-dashboard.jsx    # Dashboard list view
├── ebook-new-edit-form.jsx     # Create/Edit form
└── view/
    ├── ebook-list-view.jsx
    ├── ebook-create-view.jsx
    └── ebook-edit-view.jsx
```

**Form Fields:**

- Title (required)
- Slug (auto-generated)
- Description (rich text)
- Cover image (upload)
- Google Drive URL (required)
- File size (e.g., "2.5 MB")
- File format (PDF, EPUB, MOBI)
- Author name (required)
- Is own work (checkbox)
- Category (dropdown)
- Tags (chip input)
- Featured (toggle)
- Status (published/draft)
- Display order

---

## 🚀 Implementation Steps

### Step 1: Run Database Migration ✅

1. Open Supabase SQL Editor
2. Copy content from `supabase_migrations/create_ebooks_table.sql`
3. Run the migration
4. Verify tables are created:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'ebook%';
```

5. Check default categories:

```sql
SELECT * FROM ebook_categories ORDER BY display_order;
```

### Step 2: Create Storage Bucket

1. Go to Supabase Storage
2. Create new bucket: `ebook-covers`
3. Make it public
4. Set policies:

```sql
-- Allow public read
CREATE POLICY "Public can view ebook covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'ebook-covers');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload ebook covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ebook-covers');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update ebook covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'ebook-covers');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete ebook covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'ebook-covers');
```

### Step 3: Update Navigation Menu 🔄

File: `src/layouts/nav-config-main.jsx`

```javascript
export const navData = [
  { title: 'Home', path: '/' },
  {
    title: 'Blog',
    path: '/post',
    children: [
      { title: 'Semua Artikel', path: '/post' },
      { title: 'Tauhid & Aqidah', path: '/post?category=tauhid' },
      { title: 'Fiqh', path: '/post?category=fiqh' },
      // ... more categories
    ],
  },
  { title: 'E-Book', path: '/ebook' },
  { title: 'Tentang Saya', path: '/tentang-saya' },
];
```

File: `src/layouts/nav-config-dashboard.jsx`

```javascript
{
  title: 'E-Books',
  path: paths.dashboard.ebook.root,
  icon: ICONS.book,
  children: [
    { title: 'All E-Books', path: paths.dashboard.ebook.root },
    { title: 'Create New', path: paths.dashboard.ebook.new },
  ],
}
```

### Step 4: Create UI Components 🔄

#### A. E-Book Card Component

```jsx
// src/sections/ebook/ebook-card.jsx
export function EbookCard({ ebook }) {
  return (
    <Card>
      <Image src={ebook.cover_image_url} ratio="3/4" />
      <CardContent>
        <Typography variant="h6">{ebook.title}</Typography>
        <Typography variant="body2">by {ebook.author_name}</Typography>
        {ebook.is_own_work && <Chip label="Karya Fauzi M. Noor" />}
        <Chip label={ebook.category} />
        <Typography variant="caption">
          {ebook.file_format} • {ebook.file_size}
        </Typography>
        <Typography variant="caption">
          👁 {ebook.view_count} • ⬇ {ebook.download_count}
        </Typography>
        <Button href={paths.ebook.details(ebook.slug)}>View Details</Button>
      </CardContent>
    </Card>
  );
}
```

#### B. E-Book List View

```jsx
// src/sections/ebook/ebook-list-view.jsx
export function EbookListView() {
  const [ebooks, setEbooks] = useState([]);
  const [category, setCategory] = useState('all');
  const [ownWorkOnly, setOwnWorkOnly] = useState(false);

  // Fetch e-books
  // Apply filters
  // Render grid

  return (
    <>
      <EbookFilters />
      <Grid container spacing={3}>
        {ebooks.map((ebook) => (
          <Grid item xs={12} sm={6} md={4} key={ebook.id}>
            <EbookCard ebook={ebook} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
```

#### C. E-Book Form

```jsx
// src/sections/ebook/ebook-new-edit-form.jsx
export function EbookNewEditForm({ currentEbook }) {
  const methods = useForm({
    defaultValues: {
      title: currentEbook?.title || '',
      description: currentEbook?.description || '',
      google_drive_url: currentEbook?.google_drive_url || '',
      // ... more fields
    },
  });

  const onSubmit = async (data) => {
    if (currentEbook) {
      await updateEbook(currentEbook.id, data);
    } else {
      await createEbook(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{/* Form fields */}</form>
    </FormProvider>
  );
}
```

### Step 5: Create Pages 🔄

#### Public Pages

```jsx
// src/app/ebook/page.jsx
export default function EbookPage() {
  return <EbookListView />;
}

// src/app/ebook/[slug]/page.jsx
export default async function EbookDetailPage({ params }) {
  const ebook = await getEbookBySlug(params.slug);
  return <EbookDetailView ebook={ebook} />;
}
```

#### Dashboard Pages

```jsx
// src/app/dashboard/ebook/page.jsx
export default function DashboardEbookPage() {
  return <EbookListDashboard />;
}

// src/app/dashboard/ebook/new/page.jsx
export default function NewEbookPage() {
  return <EbookCreateView />;
}

// src/app/dashboard/ebook/[id]/edit/page.jsx
export default function EditEbookPage({ params }) {
  return <EbookEditView id={params.id} />;
}
```

---

## 📊 Google Drive Integration

### How to Get Google Drive URL

1. Upload e-book to Google Drive
2. Right-click → Get link
3. Set to "Anyone with the link can view"
4. Copy the link (format: `https://drive.google.com/file/d/FILE_ID/view`)
5. Paste to `google_drive_url` field

### Download Button Behavior

```jsx
<Button href={ebook.google_drive_url} target="_blank" onClick={() => trackEbookDownload(ebook.id)}>
  Download E-Book
</Button>
```

When clicked:

1. Track download in database
2. Increment download_count
3. Open Google Drive in new tab
4. User can download from Google Drive

---

## 🎯 Next Steps

### Immediate (Priority 1)

- [ ] Create e-book card component
- [ ] Create e-book list view (public)
- [ ] Create e-book detail page
- [ ] Create e-book form (dashboard)
- [ ] Create dashboard list view
- [ ] Update navigation menu

### Short Term (Priority 2)

- [ ] Add search functionality
- [ ] Add filter by category
- [ ] Add "Karya Saya" filter
- [ ] Add featured section
- [ ] Add related e-books
- [ ] Add statistics dashboard widget

### Long Term (Priority 3)

- [ ] Add e-book reviews/ratings
- [ ] Add reading list feature
- [ ] Add email notification for new e-books
- [ ] Add RSS feed for e-books
- [ ] Add social sharing buttons
- [ ] Add print-friendly detail page

---

## 📝 Sample Data

### Insert Sample E-Books

```sql
INSERT INTO ebooks (
  title, slug, description, cover_image_url,
  google_drive_url, file_size, file_format,
  author_name, is_own_work, category, tags,
  status, is_featured, published_at
) VALUES
  (
    'Tauhid dalam Kehidupan Sehari-hari',
    'tauhid-dalam-kehidupan-sehari-hari',
    'Panduan praktis mengamalkan tauhid dalam kehidupan sehari-hari.',
    'https://example.com/cover1.jpg',
    'https://drive.google.com/file/d/xxxxx/view',
    '2.5 MB', 'PDF',
    'Fauzi M. Noor', true,
    'tauhid-aqidah',
    ARRAY['tauhid', 'aqidah', 'islam'],
    'published', true, NOW()
  );
```

---

## 🐛 Troubleshooting

### Issue: RLS blocking queries

**Solution:** Check if user is authenticated or use service role key for server-side queries

### Issue: Cover image not uploading

**Solution:** Check storage bucket policies and file size limits

### Issue: Download count not incrementing

**Solution:** Check trigger `trigger_increment_download_count` is active

### Issue: Slug conflicts

**Solution:** Slug is auto-generated from title, ensure unique titles

---

## 📚 Resources

- **Migration File:** `supabase_migrations/create_ebooks_table.sql`
- **Helper Functions:** `src/lib/supabase-client.js`
- **Routes:** `src/routes/paths.js`
- **Supabase Docs:** https://supabase.com/docs

---

**Last Updated:** 2025-12-07
**Version:** 1.0.0
**Status:** Database Complete | UI In Progress
