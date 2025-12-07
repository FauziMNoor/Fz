import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function SocialIcon({ name, sx, ...other }) {
  const iconMap = {
    facebook: 'fb.svg',
    instagram: 'ig.svg',
    threads: 'Threads.svg',
    youtube: 'yt.svg',
    twitter: 'x.svg',
    telegram: 'telegram.svg',
    whatsapp: 'wa.svg',
  };

  const iconFile = iconMap[name] || 'fb.svg';
  const iconPath = `${CONFIG.assetsDir}/assets/icons/socialmedia/${iconFile}`;

  return (
    <Box
      component="img"
      src={iconPath}
      alt={name}
      sx={[
        {
          width: 24,
          height: 24,
          objectFit: 'contain',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    />
  );
}
