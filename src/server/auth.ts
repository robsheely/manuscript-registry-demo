import { Strategy } from 'passport-local';
import * as passport from 'passport';
import * as argon2 from 'argon2';
import express, { Router } from 'express';
/* Session management with Passport */
import { User } from '../Users/User.entity';
import { repo, SqlDatabase } from 'remult';
import { api } from './api';
import { createPostgresDataProvider } from 'remult/postgres';
import {
  getUserFromRequest,
  getUserInfoFromUser,
  setUserInRequest,
} from '../utils/userUtils';
import { Express } from 'express-serve-static-core';

type Callback = (err: any, id?: any) => void;

const passportModule = async (app: Express) => {
  passport.use(
    'local',
    new Strategy(
      {
        // Passport uses "username" and "password", so we override with the names that we want those fields to have
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },

      /**
       * This is the Auth handler. We check for a valid user phone and authenticate if found
       */
      async function (_req, email, password, onDone) {
        const dbProvider = await createPostgresDataProvider({
          connectionString: process.env.DATABASE_URL,
        });
        const sql = SqlDatabase.getDb(dbProvider);
        const SQL_STRING = `SELECT * FROM users WHERE email='${email}' LIMIT 1`;
        const result = await sql.execute(SQL_STRING);
        const user = result.rows[0];
        // Check for valid user
        if (!user) {
          return onDone('Invalid credentials', false);
        }
        // Check for valid auth
        const passwordMatch = validatePassword(user, password);
        if (!passwordMatch) {
          return onDone('Invalid credentials', false);
        }

        // All is well, return successful user
        return onDone(null, user);
      },
    ),
  );

  passport.serializeUser((user: any, onDone: Callback) => {
    onDone(null, getUserInfoFromUser(user));
  });

  passport.deserializeUser((user: any, onDone: Callback) => {
    onDone(null, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  const auth = Router();

  auth.use(express.json({ limit: '10mb' }));

  auth.post('/api/signIn', passport.authenticate('local'), (req, res) => {
    const user = req.user;
    //setUserInRequest(req, getUserInfoFromUser(user));
    res.json(user);
  });

  auth.post('/api/signOut', (req, res) => {
    req.session.destroy((err) => console.log('Session destroyed:', err));
    res.json('signed out');
  });

  auth.post('/api/signUp', api.withRemult, async (req, res) => {
    try {
      const user = await createUser(req.body);
      //setUserInRequest(req, user);
      res.json(user);
    } catch (e) {
      console.log('/api/signUp', e.message);
    }
  });

  app.use(auth);
  auth.get('/api/currentUser', (req, res) => {
    const user = getUserFromRequest(req);
    return user ? res.json(user) : undefined;
  });

  // Compare the password of an already fetched user (using `findUser`) and compare the
  // password for a potential match
  const validatePassword = async (user: User, inputPassword: string) => {
    try {
      const passwordsMatch = await argon2.verify(user.hash, inputPassword);
      return passwordsMatch;
    } catch (err) {
      // internal failure
    }
  };

  const createUser = async ({
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    // Here you should create the user and save the salt and hashed password (some dbs may have
    // authentication methods that will do it for you so you don't have to worry about it):
    const hash = await argon2.hash(password);
    const user = await repo(User).save({ email, hash, firstName, lastName });

    return user;
  };
};

export default passportModule;
