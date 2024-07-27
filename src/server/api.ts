import { remultExpress } from 'remult/remult-express'
import { createPostgresDataProvider } from 'remult/postgres'
import { config } from 'dotenv'
import { AuthorManuscript } from '../Authors/AuthorManuscript.entity'
import { Author } from '../Authors/Author.entity'
import { Manuscript } from '../Manuscripts/Manuscript.entity'
import { ManuscriptNote } from '../Manuscripts/ManuscriptNote.entity'
import { ManuscriptFeedback } from '../Manuscripts/ManuscriptFeedback.entity'

config()
export const entities = [
  Author,
  Manuscript,
  AuthorManuscript,
  ManuscriptNote,
  ManuscriptFeedback
]

export const api = remultExpress({
  getUser: (req) => req.session!['user'],
  dataProvider: createPostgresDataProvider({
    connectionString: process.env.DATABASE_URL
  }),
  entities,
  admin: false
})
