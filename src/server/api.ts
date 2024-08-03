import { remultExpress } from 'remult/remult-express'
import { createPostgresDataProvider } from 'remult/postgres'
import { config } from 'dotenv'
import { AuthorManuscript } from '../Authors/AuthorManuscript.entity'
import { Author } from '../Authors/Author.entity'
import { Manuscript } from '../Manuscripts/Manuscript.entity'
import { ManuscriptNote } from '../Manuscripts/ManuscriptNote.entity'
import { ManuscriptFeedback } from '../Manuscripts/ManuscriptFeedback.entity'
import { User } from '../Users/User.entity'

config()

export const entities = [
  Author,
  Manuscript,
  AuthorManuscript,
  ManuscriptNote,
  ManuscriptFeedback,
  User
]

export const api = remultExpress({
  getUser: (req) => {
    if (req.isAuthenticated()) {
      return req.session!['user'];
    }
    return null
  },
  dataProvider: createPostgresDataProvider({
    connectionString: process.env.DATABASE_URL
  }),
  entities,
  admin: false,
  error: async (e) => {
    console.log(e)
  }
})
