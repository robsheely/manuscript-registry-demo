import { Allow, BackendMethod, Entity, Fields, Relations, repo } from 'remult'
import { AuthorManuscript } from './AuthorManuscript.entity'

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
  @Relations.toMany(() => AuthorManuscript)
  manuscripts: AuthorManuscript[] = []

  @BackendMethod({ allowed: Allow.authenticated })
  async saveWithManuscripts?(manuscripts: string[]) {
    const isNew = !this.id
    console.log('#### 0')
    const author = await repo(Author).save(this)
    console.log('#### 1')
    const authorManuscriptsRepo = repo(Author).relations(author).manuscripts
    const existingManuscripts = isNew
      ? []
      : await authorManuscriptsRepo.find({
          include: {
            manuscript: true
          }
        })

    console.log('existingManuscripts:', existingManuscripts)

    const manuscriptsToDelete = existingManuscripts.filter(
      (c) => !manuscripts.includes(c.manuscriptId)
    )
    const manuscriptsToAdd = manuscripts.filter(
      (c) => !existingManuscripts.find((e) => e.manuscriptId == c)
    )
    console.log('#### 2', {
      existingManuscripts,
      manuscriptsToDelete,
      manuscriptsToAdd
    })
    await Promise.all(
      manuscriptsToDelete.map((dc) => authorManuscriptsRepo.delete(dc))
    )
    await authorManuscriptsRepo.insert(
      manuscriptsToAdd.map((manuscriptId) => ({ manuscriptId }))
    )
  }
}
