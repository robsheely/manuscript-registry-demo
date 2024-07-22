import { Allow, Entity, Fields, Relations } from 'remult'
import { Author } from './Author.entity'
import { Manuscript } from '../Manuscripts/Manuscript.entity'

@Entity<AuthorManuscript>('authorManuscript', {
  allowApiCrud: Allow.authenticated,
  id: { authorId: true, manuscriptId: true }
})
export class AuthorManuscript {
  @Fields.uuid()
  id?: string
  @Fields.string({ dbName: 'author' })
  authorId = ''
  @Relations.toOne<AuthorManuscript, Author>(() => Author, 'authorId')
  author!: Author
  @Fields.string({ dbName: 'manuscript' })
  manuscriptId = ''
  @Relations.toOne<AuthorManuscript, Manuscript>(
    () => Manuscript,
    'manuscriptId'
  )
  manuscript!: Manuscript
  @Fields.date({ allowApiUpdate: false })
  createdAt = new Date()
}
