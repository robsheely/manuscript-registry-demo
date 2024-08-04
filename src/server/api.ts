import { remultExpress } from 'remult/remult-express';
import { createPostgresDataProvider } from 'remult/postgres';
import { config } from 'dotenv';

import { AuthorManuscript } from '../Authors/AuthorManuscript.entity';
import { Author } from '../Authors/Author.entity';
import { Manuscript } from '../Manuscripts/Manuscript.entity';
import { ManuscriptNote } from '../Manuscripts/ManuscriptNote.entity';
import { ManuscriptFeedback } from '../Manuscripts/ManuscriptFeedback.entity';
import { User } from '../Users/User.entity';
import { getUserFromRequest } from '../utils/userUtils';

config();

const entities = [
  Author,
  Manuscript,
  AuthorManuscript,
  ManuscriptNote,
  ManuscriptFeedback,
  User,
];

export const api = remultExpress({
  getUser: (req) => {
    if (req.isAuthenticated()) {
      const user = getUserFromRequest(req);
      return user;
    }
    return null;
  },
  dataProvider: async () => {
    const dp = await createPostgresDataProvider({
      connectionString: process.env.DATABASE_URL,
    });
    return dp;
  },
  entities,
  admin: false,
  error: async (e: any) => {
    console.log(e.message);
  },
});
