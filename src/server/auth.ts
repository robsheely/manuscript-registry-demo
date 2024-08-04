import { repo } from 'remult';

import express, { Router } from 'express';
import { Express } from 'express-serve-static-core';
import passport from 'passport';
import { Strategy } from 'passport-local';
import * as argon2 from 'argon2';

import { User } from '../Users/User.entity';
import { api } from './api';
import {
  getUserFromRequest,
  getUserInfoFromUser,
  UserData,
} from '../utils/userUtils';

type Callback = (err: any, id?: any) => void;

const passportModule = async (app: Express) => {
  passport.use(
    'local',
    new Strategy(
      {
        // Passport uses "username" and "password", so we override with the names that we want those fields to have
        usernameField: 'email',
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },

      /**
       * This is the Auth handler. We check for a valid user phone and authenticate if found
       */
      async function (req, email, password, onDone) {
        const user = await api.withRemultAsync(
          req,
          async () => await repo(User).findFirst({ email }),
        );

        if (!user) {
          return onDone('Invalid credentials', false);
        }

        if (!validatePassword(user, password)) {
          return onDone('Invalid credentials', false);
        }

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
    res.json(user);
  });

  auth.post('/api/signOut', (req, res) => {
    req.session.destroy((err) => console.log('Session destroyed:', err));
    res.json('signed out');
  });

  auth.post('/api/signUp', api.withRemult, async (req, res) => {
    try {
      const user = await createUser(req.body);
      res.json(user);
    } catch (e: any) {
      console.log('/api/signUp error:', e.message);
    }
  });

  app.use(auth);
  auth.get('/api/currentUser', (req, res) => {
    const user = getUserFromRequest(req);
    return user ? res.json(user) : undefined;
  });

  const validatePassword = async (user: User, inputPassword: string) => {
    try {
      const passwordsMatch = await argon2.verify(user.hash, inputPassword);
      return passwordsMatch;
    } catch (e: any) {
      console.log('validatePassword error:', e.message);
    }
  };

  const createUser = async ({
    email,
    password,
    firstName,
    lastName,
  }: UserData & { password: string }) => {
    const hash = await argon2.hash(password);
    const user = await repo(User).save({ email, hash, firstName, lastName });

    return user;
  };
};

export default passportModule;
