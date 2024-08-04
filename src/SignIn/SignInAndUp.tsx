import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CssBaseline,
  GlobalStyles,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { UserData } from '../utils/userUtils';

type Props = {
  currentUser: UserData | undefined;
  setCurrentUser: (user: UserData) => void;
};

const SignInAndUp = ({ currentUser, setCurrentUser }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string>();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const signIn = async () => {
    setError(undefined);
    const result = await fetch('/api/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (result.ok) {
      setCurrentUser(await result.json());
      setEmail('');
      setPassword('');
    } else setError(await result.json());
  };

  const signUp = async () => {
    setError(undefined);
    const result = await fetch('/api/signUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    if (result.ok) {
      setCurrentUser(await result.json());
      setEmail('');
      setPassword('');
    } else setError(await result.json());
  };

  useEffect(() => {
    let tryCounter = 0;
    function getCurrentUser() {
      fetch('/api/currentUser').then(async (r) => {
        if (r.ok) {
          try {
            setCurrentUser(await r.json());
          } catch {}
        } else {
          if (tryCounter++ < 10)
            // retry if dev server is not yet ready
            setTimeout(() => {
              getCurrentUser();
            }, 500);
        }
      });
    }
    getCurrentUser();
  }, []);

  if (!currentUser)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100vh' }}
      >
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: { background: '#fff' },
          }}
        />
        <Card
          sx={{
            width: 300,
            filter: 'drop-shadow(10px 10px 6px #999)',
            m: 2,
            flexGrow: 0,
            height: 'fix-content',
            padding: 2,
          }}
        >
          <Box component="form" sx={{ p: 1 }} noValidate autoComplete="off">
            <Stack spacing={2}>
              <Box display="flex" justifyContent="center">
                <LockIcon sx={{ width: 50, height: 50, color: 'darkGray' }} />
              </Box>
              {isSigningUp && (
                <Stack spacing={4}>
                  <TextField
                    autoFocus
                    variant="standard"
                    label="First Name"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextField
                    autoFocus
                    variant="standard"
                    label="Last name"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Stack>
              )}
              <TextField
                autoFocus
                variant="standard"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                type="password"
                variant="standard"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Typography color="error" variant="body1">
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={!isSigningUp ? signIn : signUp}
              >
                {`SIGN ${isSigningUp ? 'UP' : 'IN'}`}
              </Button>
            </Stack>
            <Stack
              sx={{
                width: '100%',
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '10px 2px',
              }}
              direction="row"
            >
              <Typography variant="body2">{`${
                !isSigningUp ? "Don't h" : 'H'
              }ave an account?`}</Typography>
              <Link
                href="#"
                variant="body2"
                onClick={() => setIsSigningUp(!isSigningUp)}
              >
                {`Sign ${isSigningUp ? 'in' : 'up'}`}
              </Link>
            </Stack>
          </Box>
        </Card>
      </Box>
    );

  return null;
};
export default SignInAndUp;
