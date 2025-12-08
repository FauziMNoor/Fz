import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import SpeedDial from '@mui/material/SpeedDial';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import { fDate } from 'src/utils/format-time';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PostDetailsHero({ sx, title, author, coverUrl, createdAt, ...other }) {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  const handleShare = (platform) => {
    const postUrl = window.location.href;
    const postText = title || 'Check out this post!';
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedText = encodeURIComponent(postText);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'threads':
        shareUrl = `https://threads.net/intent/post?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(postUrl);
        toast.success('Link copied to clipboard!');
        return;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const socialPlatforms = [
    { value: 'facebook', label: 'Facebook', icon: 'logos:facebook' },
    { value: 'twitter', label: 'X (Twitter)', icon: 'skill-icons:twitter' },
    { value: 'threads', label: 'Threads', icon: 'ri:threads-fill' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'skill-icons:linkedin' },
    { value: 'whatsapp', label: 'WhatsApp', icon: 'logos:whatsapp-icon' },
    { value: 'telegram', label: 'Telegram', icon: 'logos:telegram' },
    { value: 'copy', label: 'Copy Link', icon: 'solar:copy-bold' },
  ];

  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(0deg, ${varAlpha(
                theme.vars.palette.grey['900Channel'],
                0.64
              )}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.64)})`,
              `url(${coverUrl})`,
            ],
          }),
          height: 480,
          overflow: 'hidden',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container sx={{ height: 1, position: 'relative' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            zIndex: 9,
            maxWidth: 480,
            position: 'absolute',
            pt: { xs: 2, md: 8 },
            color: 'common.white',
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            left: 0,
            width: 1,
            bottom: 0,
            position: 'absolute',
          }}
        >
          {author && createdAt && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: { xs: 2, md: 3 },
                pb: { xs: 3, md: 8 },
              }}
            >
              <Avatar
                alt={author.name}
                src={author.avatarUrl}
                sx={{ width: 64, height: 64, mr: 2 }}
              />

              <ListItemText
                sx={{ color: 'common.white' }}
                primary={author.name}
                secondary={fDate(createdAt)}
                slotProps={{
                  primary: { sx: { typography: 'subtitle1' } },
                  secondary: {
                    sx: { mt: 0.5, opacity: 0.64, color: 'inherit' },
                  },
                }}
              />
            </Box>
          )}

          <SpeedDial
            direction={smUp ? 'left' : 'up'}
            ariaLabel="Share post"
            icon={<Iconify icon="solar:share-bold" />}
            FabProps={{ size: 'medium' }}
            sx={{
              position: 'absolute',
              bottom: { xs: 32, md: 64 },
              right: { xs: 16, md: 24 },
            }}
          >
            {socialPlatforms.map((social) => (
              <SpeedDialAction
                key={social.value}
                icon={<Iconify icon={social.icon} width={24} />}
                onClick={() => handleShare(social.value)}
                slotProps={{
                  fab: { color: 'default' },
                  tooltip: {
                    placement: 'top',
                    title: social.label,
                  },
                }}
              />
            ))}
          </SpeedDial>
        </Box>
      </Container>
    </Box>
  );
}
