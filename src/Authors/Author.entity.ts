import {
  Allow,
  BackendMethod,
  Entity,
  Fields,
  Relations,
  repo,
  Validators
} from 'remult'
import { AuthorManuscript } from './AuthorManuscript.entity'
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
  @Relations.toMany(() => AuthorManuscript)
  manuscripts: AuthorManuscript[] = []

  @BackendMethod({ allowed: Allow.authenticated })
  async saveWithManuscripts?(manuscriptIds: string[]) {
    const isNew = !this.id
    const authorManuscriptsRepo = repo(Author).relations(this).manuscripts
    const existingAuthorManuscripts = isNew
      ? []
      : await authorManuscriptsRepo.find({
        include: {
          manuscript: true
        }
      })

    const manuscriptsToDelete = existingAuthorManuscripts.filter(
      (existing) => !manuscriptIds.includes(existing.manuscriptId!)
    )

    const manuscriptsIdsToAdd = manuscriptIds.filter((id) => {
      return !existingAuthorManuscripts.find((existing) => {
        return existing.manuscriptId == id
      })
    })

    // console.log('#### 2', {
    //   existingAuthorManuscripts,
    //   manuscriptsToDelete,
    //   manuscriptsToAdd
    // })
    await Promise.all(
      manuscriptsToDelete.map((authorManuscript) => authorManuscriptsRepo.delete(authorManuscript))
    )

    await authorManuscriptsRepo.insert(
      manuscriptsIdsToAdd.map((manuscript) => ({
        authorId: this.id,
        manuscriptId: manuscript
      }))
    )
    //const author = await repo(Author).save(this)
  }
}
