import {
  Allow,
  Entity,
  EntityFilter,
  Field,
  Filter,
  remult,
  Fields,
  Validators,
  repo,
  Relations
} from 'remult'
import { AccountManager } from '../AccountManagers/AccountManager.entity'
import { Author } from '../Authors/Author.entity'
import { ManuscriptNote } from './ManuscriptNote.entity'
import { ManuscriptTag } from './ManuscriptTag.entity'
import { Gender } from './Gender'
import { Status } from './Status'
import { Tag } from './Tag.entity'

@Entity<Manuscript>('contacts', {
  allowApiCrud: Allow.authenticated,
  allowApiDelete: false,
  defaultOrderBy: {
    lastName: 'asc'
  }
})
export class Manuscript {
  @Fields.uuid()
  id?: string
  @Fields.string({
    validate: Validators.required
  })
  firstName = ''
  @Fields.string({
    validate: Validators.required
  })
  lastName = ''
  @Field(() => Gender)
  gender = Gender.male
  @Fields.string()
  title = ''
  @Relations.toOne(() => Author, { defaultIncluded: true })
  author?: Author
  @Fields.string()
  phoneNumber1 = ''
  @Fields.string()
  phoneNumber2 = ''
  @Fields.string()
  background = ''
  @Fields.string()
  email = ''
  @Fields.string()
  avatar? = ''
  @Fields.boolean()
  hasNewsletter: boolean = false
  @Relations.toMany(() => ManuscriptTag)
  tags?: ManuscriptTag[]
  @Fields.string({ dbName: 'accountManager' })
  accountManagerId = ''
  @Relations.toOne<Manuscript, AccountManager>(
    () => AccountManager,
    'accountManagerId'
  )
  accountManager?: AccountManager
  @Field(() => Status)
  status = Status.cold
  @Fields.date({
    allowApiUpdate: false
  })
  lastSeen = new Date()
  @Fields.date({
    allowApiUpdate: false
  })
  createdAt = new Date()

  @Fields.integer({
    serverExpression: async (contact) =>
      remult.repo(Manuscript).relations(contact).notes.count()
  })
  nbNotes = 0 //[ ] reconsider - maybe make server expression managed with include etc...

  @Relations.toMany(() => ManuscriptNote)
  notes?: ManuscriptNote[]

  static filterTag = Filter.createCustom<Manuscript, string>(async (tag) => {
    if (!tag) return {}
    const r: EntityFilter<Manuscript> = {
      id: await remult
        .repo(ManuscriptTag)
        .find({
          where: {
            tag: await remult.repo(Tag).findFirst({ tag })
          },
          load: (ct) => []
        })
        .then((ct) => ct.map((ct) => ct.contactId))
    }
    return r
  })
  static disableLastSeenUpdate = false
  static async updateLastSeen(contact: Manuscript) {
    if (Manuscript.disableLastSeenUpdate) return
    const last = await repo(Manuscript)
      .relations(contact)
      .notes.findFirst(
        {},
        {
          orderBy: {
            createdAt: 'desc'
          }
        }
      )

    contact.lastSeen = last?.createdAt
    await remult.repo(Manuscript).save(contact)
  }
}
