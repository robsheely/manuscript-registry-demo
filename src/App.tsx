import React, { useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { AuthorsList } from './Authors/AuthorsList'
import { ManuscriptsPage } from './Manuscripts/ManuscriptsPage'
import { AuthorShow } from './Authors/AuthorShow'
import {
  AppBar,
  Box,
  Button,
  createTheme,
  CssBaseline,
  Drawer,
  GlobalStyles,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import { ManuscriptShow } from './Manuscripts/ManuscriptShow'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { remult } from 'remult'

const theme = createTheme()

function App({ signOut }: { signOut: VoidFunction }) {
  const [openDrawer, setOpenDrawer] = useState(false)

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )
  const routes = useMemo(
    () => [
      { path: '/', caption: 'Manuscripts' },
      { path: `/authors`, caption: 'Authors' }
    ],
    []
  )
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: { backgroundColor: '#fafafa' }
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Drawer
            anchor="left"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
          >
            <List>
              {routes.map((route) => (
                <ListItem key={route.path} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={route.path}
                    onClick={() => setOpenDrawer(false)}
                  >
                    <ListItemText primary={route.caption} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <AppBar position="static" sx={{ mb: 1 }}>
            <Toolbar>
              <Box>
                <img
                  src="/MSWLAcademylogofinal.webp"
                  style={{
                    filter: 'drop-shadow(3px 3px 4px #333333)',
                    marginRight: 10
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

              <Box sx={{ flexGrow: 0, marginLeft: 1 }}>
                <Tooltip title={remult.user!.name!}>
                  <IconButton
                    onClick={(e) => setAnchorElUser(e.currentTarget)}
                    sx={{ p: 0, filter: 'drop-shadow(3px 3px 4px #333333)' }}
                  ></IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={() => setAnchorElUser(null)}
                >
                  <MenuItem
                    onClick={() => {
                      setAnchorElUser(null)
                      signOut()
                    }}
                  >
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </AppBar>
          <Box sx={{ p: 1 }}>
            <Routes>
              <Route path="/" element={<ManuscriptsPage />} />
              <Route path="/authors" element={<AuthorsList />} />
              <Route path="/authors/:id" element={<AuthorShow />} />
              <Route path="/manuscripts/:id" element={<ManuscriptShow />} />
            </Routes>
          </Box>
        </LocalizationProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default App
