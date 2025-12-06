# 📁 Portfolio Implementation Guide

## ✅ Phase 1 & 2: COMPLETED

**Date:** 2025-12-05
**Status:** Database setup & UI components ready

---

## 📋 What's Been Implemented

### 1. Database Schema (Supabase)

#### **Portfolios Table**

```sql
CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- 'project', 'presentation', 'achievement', 'publication'
  cover_image TEXT,
  images TEXT[], -- Multiple images support
  link_url TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**Features:**

- ✅ Row Level Security (RLS) policies
- ✅ Auto-update timestamps with triggers
- ✅ Indexes for performance
- ✅ Storage bucket `portfolio-images` with policies

#### **Additional Tables Created**

- `user_posts` - Social media style feeds
- `post_likes` - Like system for posts
- `post_comments` - Comment system for posts
- `achievements` - User achievements
- `certifications` - Professional certifications
- `teaching_experiences` - Teaching history
- `career_timeline` - Career milestones

---

### 2. Helper Functions (`src/lib/supabase-client.js`)

#### Portfolio Functions

```javascript
// Get user's portfolios
getUserPortfolios(userId);

// Create portfolio
createPortfolio(userId, portfolioData);

// Update portfolio
updatePortfolio(portfolioId, portfolioData);

// Delete portfolio
deletePortfolio(portfolioId);
```

#### User Posts Functions (Social Feed)

```javascript
getUserPosts(userId);
createUserPost(userId, postData);
updateUserPost(postId, postData);
deleteUserPost(postId);
togglePostLike(postId, userId);
addPostComment(postId, userId, message);
```

#### Other Profile Extensions

```javascript
// Achievements
getUserAchievements(userId);
createAchievement(userId, achievementData);
updateAchievement(achievementId, achievementData);
deleteAchievement(achievementId);

// Certifications
getUserCertifications(userId);
createCertification(userId, certificationData);
updateCertification(certificationId, certificationData);
deleteCertification(certificationId);

// Teaching Experiences
getUserTeachingExperiences(userId);
createTeachingExperience(userId, experienceData);
updateTeachingExperience(experienceId, experienceData);
deleteTeachingExperience(experienceId);

// Career Timeline
getUserCareerTimeline(userId);
createCareerTimelineEvent(userId, eventData);
updateCareerTimelineEvent(eventId, eventData);
deleteCareerTimelineEvent(eventId);
```

---

### 3. UI Components

#### **ProfilePortfolio Component** (`src/sections/user/profile-portfolio.jsx`)

**Features:**

- ✅ Category filter (All, Projects, Presentations, Achievements, Publications)
- ✅ Featured section for highlighted items
- ✅ Grid layout (responsive: 1/2/3 columns)
- ✅ Portfolio cards with:
  - Cover image
  - Category badge with icon
  - Featured star badge
  - Title & description
  - Tags (max 3 visible)
  - External link button
  - Edit/Delete menu (owner only)
- ✅ Empty state with icon & message
- ✅ Category-specific icons & colors

**Props:**

```javascript
<ProfilePortfolio
  portfolios={[]} // Array of portfolio items
  onEdit={(portfolio) => {}} // Edit handler
  onDelete={(portfolio) => {}} // Delete handler
  isOwner={false} // Show edit/delete options
/>
```

---

### 4. Page Updates

#### **About Page** (`src/app/tentang-saya/page.jsx`)

- ✅ Tab "Gallery" renamed to "Portfolio"
- ✅ Icon changed to `solar:case-round-bold`
- ✅ Integrated `ProfilePortfolio` component

**Tab Structure:**

1. Profile - User info & social feed
2. Followers - Follower list
3. Friends - Friend list
4. **Portfolio** - Projects, presentations, achievements ⭐ NEW

---

## 🗂️ Files Created/Modified

### New Files

```
supabase_migrations/
├── create_portfolios_table.sql              ✅ Portfolio table & storage
└── create_profile_extensions_complete.sql   ✅ User posts, achievements, etc.

src/sections/user/
└── profile-portfolio.jsx                    ✅ Portfolio component
```

### Modified Files

```
src/lib/
└── supabase-client.js                       ✅ Added portfolio & profile functions

src/sections/about/view/
└── about-view.jsx                           ✅ Gallery → Portfolio
```

---

## 🚀 How to Deploy

### Step 1: Run Database Migrations

**Option A: Supabase Dashboard (Recommended)**

1. Go to https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/sql/new
2. Copy content from `supabase_migrations/create_portfolios_table.sql`
3. Click "Run"
4. Copy content from `supabase_migrations/create_profile_extensions_complete.sql`
5. Click "Run"

**Option B: Supabase CLI**

```bash
supabase db push
```

### Step 2: Verify Database

Check if tables created successfully:

```sql
-- Check portfolios table
SELECT * FROM public.portfolios;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'portfolios';

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'portfolio-images';
```

### Step 3: Test the UI

1. Start development server:

```bash
yarn dev
```

2. Navigate to: http://localhost:3032/tentang-saya?tab=portfolio

3. You should see:
   - Category filter buttons
   - Empty state message (no portfolios yet)

---

## 📝 Next Steps (Phase 3)

### 1. Create Portfolio Management Dashboard

**Routes to create:**

```
/dashboard/portfolio          → List all portfolios
/dashboard/portfolio/new      → Create new portfolio
/dashboard/portfolio/[id]/edit → Edit portfolio
```

**Components needed:**

- `PortfolioListView` - Dashboard list view
- `PortfolioNewEditForm` - Create/Edit form with:
  - Title, description, category
  - Cover image upload
  - Multiple images upload
  - Tags input
  - Link URL
  - Featured toggle
  - Display order
  - Publish/Draft toggle

### 2. Integrate with User Profile

**Update `src/app/dashboard/user/page.jsx`:**

- Fetch portfolios from database
- Pass to ProfilePortfolio component
- Enable edit/delete handlers

**Update `src/app/tentang-saya/page.jsx`:**

- Fetch public portfolios
- Show only published items

### 3. Image Upload Integration

**Storage functions needed:**

```javascript
// Upload portfolio cover image
uploadPortfolioCoverImage(portfolioId, file);

// Upload multiple portfolio images
uploadPortfolioImages(portfolioId, files);

// Delete portfolio images
deletePortfolioImages(portfolioId);
```

---

## 🎨 Portfolio Categories

| Category         | Icon                            | Color     | Description                       |
| ---------------- | ------------------------------- | --------- | --------------------------------- |
| **project**      | `solar:code-square-bold`        | Primary   | Software projects, websites, apps |
| **presentation** | `solar:presentation-graph-bold` | Secondary | Slides, talks, workshops          |
| **achievement**  | `solar:cup-star-bold`           | Success   | Awards, recognitions, milestones  |
| **publication**  | `solar:document-text-bold`      | Info      | Articles, papers, books           |

---

## 💡 Usage Examples

### Example 1: Display User's Portfolios

```javascript
'use client';

import { useEffect, useState } from 'react';
import { getUserPortfolios } from 'src/lib/supabase-client';
import { ProfilePortfolio } from 'src/sections/user/profile-portfolio';

export function MyPortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const userId = 'your-user-id';

  useEffect(() => {
    async function fetchPortfolios() {
      const data = await getUserPortfolios(userId);
      setPortfolios(data);
    }
    fetchPortfolios();
  }, [userId]);

  return (
    <ProfilePortfolio
      portfolios={portfolios}
      isOwner={true}
      onEdit={(portfolio) => console.log('Edit:', portfolio)}
      onDelete={(portfolio) => console.log('Delete:', portfolio)}
    />
  );
}
```

### Example 2: Create New Portfolio

```javascript
import { createPortfolio } from 'src/lib/supabase-client';

async function handleCreatePortfolio() {
  const newPortfolio = await createPortfolio(userId, {
    title: 'Implementasi Agile di Pesantren',
    description: 'Proyek transformasi digital...',
    category: 'project',
    cover_image: 'https://...',
    tags: ['agile', 'education', 'digital transformation'],
    featured: true,
    is_published: true,
  });

  console.log('Created:', newPortfolio);
}
```

---

## 🔍 Testing Checklist

- [ ] Database tables created successfully
- [ ] RLS policies working (users can only edit own portfolios)
- [ ] Storage bucket `portfolio-images` accessible
- [ ] Portfolio tab visible on About page
- [ ] Category filter buttons working
- [ ] Empty state displays correctly
- [ ] Portfolio cards render properly (when data exists)
- [ ] Featured badge shows for featured items
- [ ] Edit/Delete menu shows for owner only
- [ ] External link button opens in new tab

---

## 📚 Resources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc
- **Database Editor:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor
- **Storage:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/storage/buckets

---

**Last Updated:** 2025-12-05
**Version:** 1.0.0
**Author:** Fauzi M. Noor
