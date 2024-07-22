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

@Entity('authors', {
  allowApiCrud: Allow.authenticated,
  allowApiDelete: false
})
export class Author {
  @Fields.uuid()
  id?: string
  @Fields.string({ validate: Validators.required })
  firstName = ''
  @Fields.string({ validate: Validators.required })
  lastName = ''
  @Fields.string({ validate: Validators.required })
  email = ''
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
  @Fields.date({ allowApiUpdate: false })
  createdAt = new Date()
  @Relations.toMany(() => AuthorManuscript)
  manuscripts: AuthorManuscript[] = []

  @BackendMethod({ allowed: Allow.authenticated })
  async saveWithManuscripts?(manuscriptIds: string[]) {
    const isNew = !this.id
    console.log('#### 0')
    console.log('#### 1', this)
    const authorManuscriptsRepo = repo(Author).relations(this).manuscripts
    const existingAuthorManuscripts = isNew
      ? []
      : await authorManuscriptsRepo.find({
          include: {
            manuscript: true
          }
        })

    console.log('manuscripts:', manuscriptIds, existingAuthorManuscripts)

    const manuscriptsToDelete = existingAuthorManuscripts.filter(
      (existing) => !manuscriptIds.includes(existing.manuscriptId!)
    )

    const manuscriptsToAdd = manuscriptIds.filter((id) => {
      return !existingAuthorManuscripts.find((existing) => {
        console.log('foooooo-id:', id, existing)
        return existing.manuscriptId == id
      })
    })

    console.log('#### 2', {
      existingAuthorManuscripts,
      manuscriptsToDelete,
      manuscriptsToAdd
    })
    await Promise.all(
      manuscriptsToDelete.map((dc) => authorManuscriptsRepo.delete(dc))
    )
    await authorManuscriptsRepo.insert(
      manuscriptsToAdd.map((manuscript) => ({
        authorId: this.id,
        manuscriptId: manuscript
      }))
    )
    const author = await repo(Author).save(this)

    console.log('#### 3', author)
  }
}
