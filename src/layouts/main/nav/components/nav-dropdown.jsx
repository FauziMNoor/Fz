import Fade from '@mui/material/Fade';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const NavDropdownPaper = styled('div')(({ theme }) => ({
  ...theme.mixins.paperStyles(theme, { dropdown: true }),
  padding: theme.spacing(2.5, 2.5, 2, 2.5),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.customShadows.dropdown,
  border: `1px solid ${theme.palette.divider}`,
  ...(theme.direction === 'rtl' && {
    padding: theme.spacing(2.5, 2.5, 2, 2.5),
  }),
}));

// ----------------------------------------------------------------------

export const NavDropdown = styled(({ open, children, ...other }) => (
  <Fade in={open}>
    <div {...other}>
      <NavDropdownPaper>{children}</NavDropdownPaper>
    </div>
  </Fade>
))(({ theme }) => ({
  left: '50%',
  transform: 'translateX(-50%)',
  marginTop: 12,
  width: 'auto',
  minWidth: 280,
  maxWidth: 480,
  position: 'fixed',
  padding: theme.spacing(1.5),
  zIndex: theme.zIndex.drawer * 2,
  top: 'calc(var(--layout-header-desktop-height) / 2)',
}));
