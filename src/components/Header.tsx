import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Stack,
  Avatar,
} from '@mui/material';
import { UserData } from '../utils/userUtils';
import { blue } from '@mui/material/colors';

type Props = {
  currentUser: UserData;
  logout: () => void;
};

const Header = ({ currentUser, logout }: Props) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const routes = useMemo(
    () => [
      { path: '/', caption: 'Manuscripts' },
      { path: `/authors`, caption: 'Authors' },
    ],
    [],
  );

  return (
    <AppBar position="static" sx={{ mb: 1, width: '100%' }}>
      <Toolbar>
        <Box>
          <img
            src="/MSWLAcademylogofinal.webp"
            style={{
              filter: 'drop-shadow(3px 3px 4px #333333)',
              marginRight: 10,
            }}
          />
        </Box>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, filter: 'drop-shadow(3px 3px 4px #333333)' }}
        >
          <strong>MANUSCRIPT REGISTRY</strong>
        </Typography>

        <Stack
          direction="row"
          sx={{
            flexGrow: 1,
            marginLeft: 1,
            filter: 'drop-shadow(3px 3px 4px #333333)',
          }}
        >
          {routes.map((route) => (
            <Button
              color="inherit"
              key={route.path}
              component={Link}
              to={route.path}
            >
              {route.caption}
            </Button>
          ))}
        </Stack>
        <Box
          sx={{
            flexGrow: 0,
            marginLeft: 1,
            filter: 'drop-shadow(3px 3px 4px #333333)',
          }}
        >
          <Button
            color="inherit"
            onClick={(e) => setAnchorElUser(e.currentTarget)}
          >
            <Avatar
              variant="rounded"
              sx={{ width: 100, height: 40, bgcolor: blue[200] }}
            >
              {currentUser!.firstName!}
            </Avatar>
          </Button>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
          >
            <MenuItem
              onClick={async () => {
                setAnchorElUser(null);
                logout();
              }}
            >
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
