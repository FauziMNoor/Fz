import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { _tags } from 'src/_mock';
import {
  supabase,
  createPost,
  updatePost,
  getCategories,
  uploadPostImage,
} from 'src/lib/supabase-client';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

import { PostDetailsPreview } from './post-details-preview';

// ----------------------------------------------------------------------

export const NewPostSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  content: schemaHelper.editor().min(100, { message: 'Content must be at least 100 characters' }),
  coverUrl: schemaHelper.file({ message: 'Cover is required!' }),
  categories: zod.string().array().min(1, { message: 'Must select at least 1 category!' }),
  tags: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  metaKeywords: zod.string().array().min(1, { message: 'Meta keywords is required!' }),
  // Not required
  metaTitle: zod.string(),
  metaDescription: zod.string(),
  publish: zod.boolean().default(false),
  enableComments: zod.boolean().default(true),
});

// ----------------------------------------------------------------------

export function PostNewEditForm({ currentPost }) {
  const router = useRouter();
  const { user } = useAuthContext();

  const showPreview = useBoolean();
  const openDetails = useBoolean(true);
  const openProperties = useBoolean(true);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories from database
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const defaultValues = {
    title: currentPost?.title || '',
    description: currentPost?.description || '',
    content: currentPost?.content || '',
    coverUrl: currentPost?.cover_url || null,
    categories: currentPost?.categories || [],
    tags: currentPost?.tags || [],
    metaKeywords: currentPost?.meta_keywords || [],
    metaTitle: currentPost?.meta_title || '',
    metaDescription: currentPost?.meta_description || '',
    publish: currentPost?.status === 'published' || false,
    enableComments: currentPost?.enable_comments ?? true,
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Upload cover image if it's a file
      let coverUrl = data.coverUrl;
      if (data.coverUrl && typeof data.coverUrl !== 'string') {
        toast.info('Uploading cover image...');
        coverUrl = await uploadPostImage('covers', data.coverUrl);
      }

      // Prepare post data
      const postData = {
        title: data.title,
        description: data.description,
        content: data.content,
        cover_url: coverUrl,
        tags: data.tags,
        meta_title: data.metaTitle || data.title,
        meta_description: data.metaDescription || data.description,
        meta_keywords: data.metaKeywords,
        status: data.publish ? 'published' : 'draft',
        enable_comments: data.enableComments,
        author_id: user?.id,
      };

      let result;
      if (currentPost?.id) {
        // Update existing post
        result = await updatePost(currentPost.id, postData);
        toast.success('Artikel berhasil diupdate!');
      } else {
        // Create new post
        result = await createPost(postData);
        toast.success('Artikel berhasil dibuat!');
      }

      // Save categories to junction table
      if (data.categories && data.categories.length > 0) {
        try {
          // Get category IDs from names
          const categoryIds = categories
            .filter((cat) => data.categories.includes(cat.name))
            .map((cat) => cat.id);

          // Delete existing categories for this post
          await supabase.from('post_categories').delete().eq('post_id', result.id);

          // Insert new categories
          const categoryData = categoryIds.map((catId) => ({
            post_id: result.id,
            category_id: catId,
          }));

          await supabase.from('post_categories').insert(categoryData);
        } catch (catError) {
          // Don't fail the whole operation if categories fail
          toast.warn('Categories may not be saved properly');
        }
      }

      // Reset form and redirect
      reset();
      showPreview.onFalse();
      router.push(paths.dashboard.post.root);
    } catch (error) {
      toast.error(error.message || 'Gagal menyimpan artikel');
    }
  });

  const handleRemoveFile = useCallback(() => {
    setValue('coverUrl', null);
  }, [setValue]);

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Details"
        subheader="Title, short description, image..."
        action={renderCollapseButton(openDetails.value, openDetails.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openDetails.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text name="title" label="Post title" />

          <Field.Text name="description" label="Description" multiline rows={3} />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Content</Typography>
            <Field.Editor name="content" sx={{ maxHeight: 480 }} />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Cover</Typography>
            <Field.Upload name="coverUrl" maxSize={3145728} onDelete={handleRemoveFile} />
          </Stack>
        </Stack>
      </Collapse>
    </Card>
  );

  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Properties"
        subheader="Additional functions and attributes..."
        action={renderCollapseButton(openProperties.value, openProperties.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openProperties.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Autocomplete
            name="categories"
            label="Categories"
            placeholder="+ Categories"
            multiple
            disableCloseOnSelect
            loading={loadingCategories}
            options={categories.map((cat) => cat.name)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="primary"
                  variant="soft"
                />
              ))
            }
          />

          <Field.Autocomplete
            name="tags"
            label="Tags"
            placeholder="+ Tags"
            multiple
            freeSolo
            disableCloseOnSelect
            options={_tags.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />

          <Field.Text name="metaTitle" label="Meta title" />

          <Field.Text
            name="metaDescription"
            label="Meta description"
            fullWidth
            multiline
            rows={3}
          />

          <Field.Autocomplete
            name="metaKeywords"
            label="Meta keywords"
            placeholder="+ Keywords"
            multiple
            freeSolo
            disableCloseOnSelect
            options={_tags.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />

          <Field.Switch name="enableComments" label="Enable comments" />
        </Stack>
      </Collapse>
    </Card>
  );

  const renderActions = () => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Field.Switch name="publish" label="Publish" sx={{ pl: 3, flexGrow: 1 }} />

      <div>
        <Button color="inherit" variant="outlined" size="large" onClick={showPreview.onTrue}>
          Preview
        </Button>

        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentPost ? 'Create post' : 'Save changes'}
        </Button>
      </div>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        {renderProperties()}
        {renderActions()}
      </Stack>

      <PostDetailsPreview
        isValid={isValid}
        onSubmit={onSubmit}
        title={values.title}
        open={showPreview.value}
        content={values.content}
        onClose={showPreview.onFalse}
        coverUrl={values.coverUrl}
        isSubmitting={isSubmitting}
        description={values.description}
      />
    </Form>
  );
}
