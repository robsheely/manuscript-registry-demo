import { remultExpress } from 'remult/remult-express'
import { createPostgresConnection } from 'remult/postgres'
import { seed } from './seed'
import { config } from 'dotenv'
import { AuthorManuscript } from '../Authors/AuthorManuscript.entity'
import { Author } from '../Authors/Author.entity'
import { Manuscript } from '../Manuscripts/Manuscript.entity'

config()
export const entities = [Author, Manuscript, AuthorManuscript]

export const api = remultExpress({
  getUser: (req) => req.session!['user'],
  dataProvider: async () => {
    if (process.env.NODE_ENV === 'production')
      return createPostgresConnection({
        configuration: 'heroku',
        caseInsensitiveIdentifiers: true
      })
    return undefined
  },
  initApi: seed,
  entities,
  admin: false
})
