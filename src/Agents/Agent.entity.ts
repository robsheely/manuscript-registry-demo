import {
  Allow,
  Entity,
  Fields,
  Validators
} from 'remult'
import { User } from '../Users/User.entity'

@Entity('authors', {
  allowApiCrud: Allow.authenticated,
  allowApiDelete: false
})
export class Author extends User {
  @Fields.string({ validate: Validators.required })
  phoneNumber = ''
  @Fields.string()
  website = ''
  @Fields.string()
  blog = ''
  @Fields.string()
  twitter = ''
  @Fields.string({ validate: Validators.required })
  address = ''
  @Fields.string({ validate: Validators.required })
  zipcode = ''
  @Fields.string({ validate: Validators.required })
  city = ''
  @Fields.string({ validate: Validators.required })
  stateAbbr = ''
  @Fields.boolean()
  published = false
  @Fields.boolean()
  agented = false
  @Fields.string()
  formerAgent = ''
  @Fields.string()
  pronouns = ''
  @Fields.string({ validate: Validators.required })
  bio = ''

}
