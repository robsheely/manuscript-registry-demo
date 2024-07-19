import { remultExpress } from 'remult/remult-express'
import { createPostgresConnection } from 'remult/postgres'
import { seed } from './seed'
import { config } from 'dotenv'
import { Deal, DealManuscript } from '../Deals/Deal.entity'
import { AccountManager } from '../AccountManagers/AccountManager.entity'
import { Author } from '../Authors/Author.entity'
import { Manuscript } from '../Manuscripts/Manuscript.entity'
import { ManuscriptTag } from '../Manuscripts/ManuscriptTag.entity'
import { ManuscriptNote } from '../Manuscripts/ManuscriptNote.entity'
import { Tag } from '../Manuscripts/Tag.entity'

config()
export const entities = [
  Author,
  Manuscript,
  ManuscriptNote,
  Tag,
  ManuscriptTag,
  DealManuscript,
  AccountManager,
  Deal
]

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
  admin: true
})
