import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { usePopover } from 'minimal-shared/hooks';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function ProfilePortfolio({ portfolios = [], onEdit, onDelete, isOwner = false }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'project', label: 'Projects' },
    { value: 'presentation', label: 'Presentations' },
    { value: 'achievement', label: 'Achievements' },
    { value: 'publication', label: 'Publications' },
  ];

  const filteredPortfolios =
    selectedCategory === 'all'
      ? portfolios
      : portfolios.filter((item) => item.category === selectedCategory);

  const featuredPortfolios = filteredPortfolios.filter((item) => item.featured);
  const regularPortfolios = filteredPortfolios.filter((item) => !item.featured);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header with Category Filter and New Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Category Filter */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Button
              key={category.value}
              size="small"
              variant={selectedCategory === category.value ? 'contained' : 'outlined'}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </Box>

        {/* New Portfolio Button (Owner Only) */}
        {isOwner && (
          <Button
            component={RouterLink}
            href={paths.dashboard.portfolio.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            size="small"
          >
            New Portfolio
          </Button>
        )}
      </Box>

      {/* Featured Section */}
      {featuredPortfolios.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Featured
          </Typography>
          <Box
            sx={{
              gap: 3,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
            }}
          >
            {featuredPortfolios.map((portfolio) => (
              <PortfolioItem
                key={portfolio.id}
                portfolio={portfolio}
                onEdit={onEdit}
                onDelete={onDelete}
                isOwner={isOwner}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Regular Portfolios */}
      {regularPortfolios.length > 0 && (
        <Box>
          {featuredPortfolios.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                All{' '}
                {selectedCategory !== 'all'
                  ? categories.find((c) => c.value === selectedCategory)?.label
                  : 'Portfolio'}
              </Typography>
            </>
          )}
          <Box
            sx={{
              gap: 3,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
            }}
          >
            {regularPortfolios.map((portfolio) => (
              <PortfolioItem
                key={portfolio.id}
                portfolio={portfolio}
                onEdit={onEdit}
                onDelete={onDelete}
                isOwner={isOwner}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Empty State */}
      {filteredPortfolios.length === 0 && (
        <Card>
          <CardContent
            sx={{
              py: 10,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Avatar
              sx={{
                mb: 2,
                width: 96,
                height: 96,
                color: 'text.disabled',
                bgcolor: 'background.neutral',
              }}
            >
              <Iconify icon="solar:gallery-wide-bold" width={48} />
            </Avatar>
            <Typography variant="h6" color="text.secondary">
              No portfolio items yet
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              {selectedCategory === 'all'
                ? 'Start adding your projects, presentations, and achievements'
                : `No ${categories.find((c) => c.value === selectedCategory)?.label.toLowerCase()} found`}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

function PortfolioItem({ portfolio, onEdit, onDelete, isOwner }) {
  const popover = usePopover();

  const handleEdit = useCallback(() => {
    popover.onClose();
    onEdit?.(portfolio);
  }, [portfolio, onEdit, popover]);

  const handleDelete = useCallback(() => {
    popover.onClose();
    onDelete?.(portfolio);
  }, [portfolio, onDelete, popover]);

  const getCategoryColor = (category) => {
    const colors = {
      project: 'primary',
      presentation: 'secondary',
      achievement: 'success',
      publication: 'info',
    };
    return colors[category] || 'default';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      project: 'solar:code-square-bold',
      presentation: 'solar:presentation-graph-bold',
      achievement: 'solar:cup-star-bold',
      publication: 'solar:document-text-bold',
    };
    return icons[category] || 'solar:folder-bold';
  };

  return (
    <Card>
      {/* Cover Image */}
      {portfolio.cover_image && (
        <Box
          sx={{
            pt: '75%',
            position: 'relative',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url(${portfolio.cover_image})`,
          }}
        >
          {/* Category Badge */}
          <Box
            sx={{
              top: 16,
              left: 16,
              zIndex: 9,
              position: 'absolute',
            }}
          >
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'background.paper',
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            >
              <Iconify
                icon={getCategoryIcon(portfolio.category)}
                width={16}
                sx={{ color: `${getCategoryColor(portfolio.category)}.main` }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {portfolio.category}
              </Typography>
            </Box>
          </Box>

          {/* Featured Badge */}
          {portfolio.featured && (
            <Box
              sx={{
                top: 16,
                right: 16,
                zIndex: 9,
                position: 'absolute',
              }}
            >
              <Iconify icon="solar:star-bold" width={24} sx={{ color: 'warning.main' }} />
            </Box>
          )}

          {/* Actions Menu (Owner Only) */}
          {isOwner && (
            <Box
              sx={{
                top: 16,
                right: portfolio.featured ? 48 : 16,
                zIndex: 9,
                position: 'absolute',
              }}
            >
              <IconButton
                color="default"
                onClick={popover.onOpen}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.neutral' },
                }}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      <CardContent>
        {/* Title */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          {portfolio.title}
        </Typography>

        {/* Description */}
        {portfolio.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {portfolio.description}
          </Typography>
        )}

        {/* Tags */}
        {portfolio.tags && portfolio.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {portfolio.tags.slice(0, 3).map((tag, index) => (
              <Box
                key={index}
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.5,
                  bgcolor: 'background.neutral',
                  typography: 'caption',
                  color: 'text.secondary',
                }}
              >
                #{tag}
              </Box>
            ))}
            {portfolio.tags.length > 3 && (
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.5,
                  bgcolor: 'background.neutral',
                  typography: 'caption',
                  color: 'text.secondary',
                }}
              >
                +{portfolio.tags.length - 3}
              </Box>
            )}
          </Box>
        )}

        {/* Link */}
        {portfolio.link_url && (
          <Button
            fullWidth
            variant="outlined"
            size="small"
            href={portfolio.link_url}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Iconify icon="solar:link-bold" />}
          >
            View Project
          </Button>
        )}
      </CardContent>

      {/* Popover Menu */}
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </Card>
  );
}
