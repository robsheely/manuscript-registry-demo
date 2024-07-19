import {
  Allow,
  Entity,
  Field,
  Fields,
  Relations,
  isBackend,
  remult
} from 'remult'
import { AccountManager } from '../AccountManagers/AccountManager.entity'
import { Manuscript } from './Manuscript.entity'
import { Status } from './Status'

@Entity<ManuscriptNote>('contactNote', {
  allowApiCrud: Allow.authenticated,
  defaultOrderBy: {
    createdAt: 'desc'
  },
  saving: async (contactNote) => {
    if (isBackend()) {
      contactNote.accountManager = await remult
        .repo(AccountManager)
        .findId(remult.user!.id)
    }
  },
  saved: async (_, { relations }) =>
    Manuscript.updateLastSeen((await relations.contact.findOne())!),
  deleted: async (_, { relations }) =>
    Manuscript.updateLastSeen((await relations.contact.findOne())!)
})
export class ManuscriptNote {
  @Fields.uuid()
  id?: string
  @Fields.string({ dbName: 'contact' })
  contactId = ''
  @Relations.toOne<ManuscriptNote, Manuscript>(() => Manuscript, 'contactId')
  contact?: Manuscript
  @Fields.string()
  text = ''
  @Field(() => AccountManager, { allowApiUpdate: false })
  accountManager!: AccountManager
  @Fields.date()
  createdAt = new Date()
  @Field(() => Status)
  status = Status.cold
}
