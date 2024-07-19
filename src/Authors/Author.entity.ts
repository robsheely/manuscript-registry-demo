import { Allow, Entity, Field, Fields, Relations } from 'remult'
import { AccountManager } from '../AccountManagers/AccountManager.entity'
import { AuthorSize } from './AuthorSize'
import { Manuscript } from '../Manuscripts/Manuscript.entity'
import { Deal } from '../Deals/Deal.entity'

@Entity('companies', {
  allowApiCrud: Allow.authenticated,
  allowApiDelete: false
})
export class Author {
  @Fields.uuid()
  id?: string
  @Fields.string()
  name = ''
  @Fields.string()
  logo = ''
  @Fields.string()
  sector = ''
  @Field(() => AuthorSize)
  size = AuthorSize.s1
  @Fields.string()
  linkedIn = ''
  @Fields.string()
  website = ''
  @Fields.string()
  phoneNumber = ''
  @Fields.string()
  address = ''
  @Fields.string()
  zipcode = ''
  @Fields.string()
  city = ''
  @Fields.string()
  stateAbbr = ''
  @Relations.toOne(() => AccountManager)
  accountManager?: AccountManager
  @Fields.date({ allowApiUpdate: false })
  createdAt = new Date()
  @Relations.toMany(() => Manuscript)
  contacts?: Manuscript[]
  @Relations.toMany(() => Deal)
  deals?: Deal[]
}
