import express from 'express';
import session from 'express-session';
import compression from 'compression';
import sslRedirect from 'heroku-ssl-redirect';
import helmet from 'helmet';
import pg, { PGStore } from 'connect-pg-simple';
import { config } from 'dotenv';

import { api } from './api';
import auth from './auth';

config();

const app = express();
app.use(sslRedirect());
app.use(helmet()); //removed because avatar image urls point to a different website
app.use(compression());

const connection = pg(session);
const store: PGStore = new connection({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,
});

const sessionInstance = session({
  secret: 'eb50b761-1a75-4446-bd3e-feadf35e800e',
  resave: false,
  store,
  saveUninitialized: false,
  // automatically extends the session age on each request. useful if you want
  // the user's activity to extend their session. If you want an absolute session
  // expiration, set to false
  rolling: false,
  name: 'manreg', // don't use the default session cookie name
  // set your options for the session cookie
  cookie: {
    httpOnly: true,
    // the duration in milliseconds that the cookie is valid
    expires: undefined, // 20 minutes
    // recommended you use this setting in production if you have a well-known domain you want to restrict the cookies to.
    // domain: 'your.domain.com',
    // recommended you use this setting in production if your site is published using HTTPS
    // secure: true,
  },
});
app.use(sessionInstance);

auth(app);

app.get('/api/test', (_req, res) => res.send('ok'));
app.use(api);

app.use(express.static('dist'));

app.use('/*', async (_req, res) => {
  res.sendFile(process.cwd() + '/dist/index.html');
});

app.listen(process.env.PORT || 3002, () => console.log('BE Server started'));
app.listen(5173, () => console.log(' FE Server started'));
