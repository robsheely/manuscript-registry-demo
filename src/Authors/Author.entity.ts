import { Allow, Entity, Fields, Relations } from 'remult'
import { Manuscript } from '../Manuscripts/Manuscript.entity'

@Entity('authors', {
  allowApiCrud: Allow.authenticated,
  allowApiDelete: false
})
export class Author {
  @Fields.uuid()
  id?: string
  @Fields.string()
  firstName = ''
  @Fields.string()
  lastName = ''
  @Fields.string()
  email = ''
  @Fields.string()
  phoneNumber = ''
  @Fields.string()
  website = ''
  @Fields.string()
  blog = ''
  @Fields.string()
  twitter = ''
  @Fields.string()
  address = ''
  @Fields.string()
  zipcode = ''
  @Fields.string()
  city = ''
  @Fields.string()
  stateAbbr = ''
  @Fields.boolean()
  published = false
  @Fields.boolean()
  agented = false
  @Fields.string()
  formerAgent = ''
  @Fields.string()
  pronouns = ''
  @Fields.string()
  bio = ''
  @Fields.date({ allowApiUpdate: false })
  createdAt = new Date()
  @Relations.toMany(() => Manuscript)
  manuscripts?: Manuscript[]
}
