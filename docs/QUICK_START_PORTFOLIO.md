# 🚀 Quick Start - Portfolio Management

**Ready to create your first portfolio!**

---

## ⚡ 3-Step Quick Start

### Step 1: Run Migration (If Not Done)

```bash
# Open Supabase SQL Editor
https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/sql/new

# Copy & Run: supabase_migrations/simple_portfolio_setup.sql
```

### Step 2: Start Development Server

```bash
yarn dev
```

### Step 3: Create Portfolio

Navigate to: http://localhost:3032/dashboard/portfolio/new

---

## 📝 Create Your First Portfolio

### Fill the Form:

**Required:**

- **Title:** "Implementasi Agile di Pesantren"
- **Category:** Project

**Optional (Recommended):**

- **Description:** "Proyek transformasi digital dan metodologi Agile di lingkungan pesantren modern"
- **Cover Image:** `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800`
- **Link:** Your project URL
- **Tags:** agile, education, digital transformation
- **Featured:** ON
- **Published:** ON

### Click "Create Portfolio"

✅ Success toast will appear
✅ Redirect to list page
✅ Your portfolio is now visible!

---

## 🎯 Access Points

### Dashboard Routes

| Page       | URL                              | Purpose              |
| ---------- | -------------------------------- | -------------------- |
| **List**   | `/dashboard/portfolio`           | View all portfolios  |
| **Create** | `/dashboard/portfolio/new`       | Create new portfolio |
| **Edit**   | `/dashboard/portfolio/[id]/edit` | Edit portfolio       |

### Public Routes

| Page               | URL                             | Purpose                |
| ------------------ | ------------------------------- | ---------------------- |
| **Dashboard User** | `/dashboard/user?tab=portfolio` | Owner view (with edit) |
| **Public About**   | `/tentang-saya?tab=portfolio`   | Public view (no edit)  |

---

## 🎨 Form Fields Guide

### Title (Required)

```
Example: "Implementasi Agile di Pesantren"
Max: 255 characters
```

### Description (Optional)

```
Example: "Proyek transformasi digital dan metodologi Agile
di lingkungan pesantren modern. Menerapkan Scrum framework
untuk meningkatkan efisiensi pembelajaran."
```

### Category (Required)

```
Options:
- 💻 Project      → Software, websites, apps
- 📊 Presentation → Slides, talks, workshops
- 🏆 Achievement  → Awards, recognitions
- 📄 Publication  → Articles, papers, books
```

### Cover Image URL (Optional)

```
Example: https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800

Tips:
- Use Unsplash for free images
- Recommended size: 800x600px
- Format: JPG, PNG
- Live preview below input
```

### External Link (Optional)

```
Example: https://github.com/username/project

Use for:
- Project repository
- Presentation slides
- Publication link
- Award certificate
```

### Tags (Optional)

```
Example: agile, education, digital transformation

How to add:
1. Type tag name
2. Press Enter
3. Repeat for more tags
4. Click X to remove
```

### Featured (Toggle)

```
ON  → Shows in featured section (top)
OFF → Shows in regular section
```

### Published (Toggle)

```
ON  → Visible to public
OFF → Draft (only you can see)
```

### Display Order (Optional)

```
Example: 0

Lower numbers appear first:
0 = Highest priority
1 = Second
2 = Third
...
```

---

## 🎬 Quick Actions

### Create Portfolio

```
1. Click "New Portfolio" button
2. Fill form
3. Click "Create Portfolio"
```

### Edit Portfolio

```
1. Go to list page
2. Click ⋮ menu on portfolio card
3. Click "Edit"
4. Update form
5. Click "Update Portfolio"
```

### Delete Portfolio

```
1. Go to list page
2. Click ⋮ menu on portfolio card
3. Click "Delete"
4. Confirm deletion
```

---

## 🎨 Sample Portfolios

### Sample 1: Project

```
Title: Implementasi Agile di Pesantren
Description: Proyek transformasi digital...
Category: Project
Cover: https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800
Link: https://github.com/username/project
Tags: agile, education, digital transformation
Featured: ON
Published: ON
```

### Sample 2: Presentation

```
Title: Presentasi: Kepemimpinan Adaptif
Description: Materi presentasi tentang...
Category: Presentation
Cover: https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800
Link: https://slides.com/username/presentation
Tags: leadership, presentation, agile
Featured: ON
Published: ON
```

### Sample 3: Achievement

```
Title: Penghargaan Inovasi Pendidikan 2024
Description: Menerima penghargaan dari...
Category: Achievement
Cover: https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800
Link: https://example.com/award
Tags: award, innovation, education
Featured: OFF
Published: ON
```

---

## 🐛 Troubleshooting

### Issue: "Title is required"

**Solution:** Fill in the title field

### Issue: "Invalid URL"

**Solution:** Check URL format (must start with http:// or https://)

### Issue: Image not showing

**Solution:**

- Check URL is valid
- Try different image URL
- Use Unsplash images

### Issue: Can't save portfolio

**Solution:**

- Check console for errors
- Verify migration ran successfully
- Check user is logged in

---

## 📚 Free Image Resources

### Unsplash (Recommended)

```
https://unsplash.com/

Search for:
- "education" → School, learning images
- "technology" → Tech, digital images
- "presentation" → Meeting, slides images
- "award" → Trophy, certificate images
```

### How to Get Unsplash URL:

```
1. Go to unsplash.com
2. Search for image
3. Click image
4. Click "Download" button (right side)
5. Right-click downloaded image
6. Copy image URL
7. Add "?w=800" at the end
```

---

## ✅ Success Checklist

- [ ] Migration ran successfully
- [ ] Development server running
- [ ] Navigated to create page
- [ ] Filled required fields
- [ ] Added cover image
- [ ] Added tags
- [ ] Clicked "Create Portfolio"
- [ ] Success toast appeared
- [ ] Portfolio appears in list
- [ ] Portfolio visible on public page

---

## 🎯 Next Steps

After creating portfolios:

1. **Test Edit:** Edit a portfolio
2. **Test Delete:** Delete a test portfolio
3. **Test Filters:** Try category filters
4. **Test Public View:** Check `/tentang-saya?tab=portfolio`
5. **Add More:** Create 3-5 portfolios for variety

---

**Version:** 1.5.0
**Last Updated:** 2025-12-05
**Status:** ✅ Ready to Use!
