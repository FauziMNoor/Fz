'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { supabase } from 'src/lib/supabase-client';

import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Blog',
    children: [
      { name: 'Tentang Saya', href: paths.about },
      { name: 'Artikel', href: paths.post.root },
    ],
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and condition', href: '#' },
      { name: 'Privacy policy', href: '#' },
    ],
  },
  {
    headline: 'Contact',
    children: [
      { name: 'fauzinoor90@gmail.com', href: 'mailto:fauzinoor90@gmail.com' },
      { name: 'WhatsApp: 0896-2303-9600', href: 'https://wa.me/6289623039600' },
    ],
  },
];

// ----------------------------------------------------------------------

const FooterRoot = styled('footer')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.vars.palette.background.default,
}));

export function Footer({ sx, layoutQuery = 'md', ...other }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(
            'full_name, bio, social_facebook, social_instagram, social_threads, social_youtube'
          )
          .eq('role', 'admin')
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (data) {
          console.log('Footer profile loaded:', {
            name: data.full_name,
            hasFacebook: !!data.social_facebook,
            hasInstagram: !!data.social_instagram,
            hasThreads: !!data.social_threads,
            hasYouTube: !!data.social_youtube,
          });
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, []);

  const socials = [
    {
      name: 'Facebook',
      icon: '/assets/icons/socialmedia/fb.svg',
      url: profile?.social_facebook,
    },
    {
      name: 'Instagram',
      icon: '/assets/icons/socialmedia/ig.svg',
      url: profile?.social_instagram,
    },
    {
      name: 'Threads',
      icon: '/assets/icons/socialmedia/Threads.svg',
      url: profile?.social_threads,
    },
    {
      name: 'YouTube',
      icon: '/assets/icons/socialmedia/yt.svg',
      url: profile?.social_youtube,
    },
  ].filter((social) => social.url); // Only show if URL exists

  return (
    <FooterRoot sx={sx} {...other}>
      <Divider />

      <Container
        sx={(theme) => ({
          pb: 5,
          pt: 10,
          textAlign: 'center',
          [theme.breakpoints.up(layoutQuery)]: { textAlign: 'unset' },
        })}
      >
        <Logo />

        <Grid
          container
          sx={[
            (theme) => ({
              mt: 3,
              justifyContent: 'center',
              [theme.breakpoints.up(layoutQuery)]: { justifyContent: 'space-between' },
            }),
          ]}
        >
          <Grid size={{ xs: 12, [layoutQuery]: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {profile?.full_name || 'Fauzi M. Noor'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Educator • Agile Practitioner • Islamic Personal Development
            </Typography>
            <Typography
              variant="body2"
              sx={(theme) => ({
                mx: 'auto',
                maxWidth: 280,
                [theme.breakpoints.up(layoutQuery)]: { mx: 'unset' },
              })}
            >
              {profile?.bio ||
                'Saya membangun sistem pendidikan, mengembangkan karakter santri, dan menciptakan solusi digital untuk meningkatkan kualitas pembelajaran di pesantren dan sekolah Islam.'}
            </Typography>

            {socials.length > 0 && (
              <Box
                sx={(theme) => ({
                  mt: 3,
                  mb: 5,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  [theme.breakpoints.up(layoutQuery)]: { mb: 0, justifyContent: 'flex-start' },
                })}
              >
                {socials.map((social) => (
                  <IconButton
                    key={social.name}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      p: 0.5,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={social.icon}
                      alt={social.name}
                      sx={{
                        width: 28,
                        height: 28,
                        display: 'block',
                      }}
                    />
                  </IconButton>
                ))}
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, [layoutQuery]: 6 }}>
            <Box
              sx={(theme) => ({
                gap: 5,
                display: 'flex',
                flexDirection: 'column',
                [theme.breakpoints.up(layoutQuery)]: { flexDirection: 'row' },
              })}
            >
              {LINKS.map((list) => (
                <Box
                  key={list.headline}
                  sx={(theme) => ({
                    gap: 2,
                    width: 1,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    [theme.breakpoints.up(layoutQuery)]: { alignItems: 'flex-start' },
                  })}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={
                        link.href.startsWith('http') || link.href.startsWith('mailto')
                          ? 'a'
                          : RouterLink
                      }
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 10 }}>
          © 2025 Fauzi M. Noor — Agile Principal & Educator
        </Typography>
      </Container>
    </FooterRoot>
  );
}

// ----------------------------------------------------------------------

export function HomeFooter({ sx, ...other }) {
  return (
    <FooterRoot
      sx={[
        {
          py: 5,
          textAlign: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container>
        <Logo />
        <Box sx={{ mt: 1, typography: 'caption' }}>
          © 2025 Fauzi M. Noor — Agile Principal & Educator
        </Box>
      </Container>
    </FooterRoot>
  );
}
