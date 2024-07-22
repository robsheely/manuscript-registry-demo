import { Allow, Entity, Fields, Relations } from 'remult'
import { Author } from './Author.entity'
import { Manuscript } from '../Manuscripts/Manuscript.entity'

@Entity<AuthorManuscript>('authorManuscript', {
  allowApiCrud: Allow.authenticated,
  id: { authorId: true, manuscript: true }
})
export class AuthorManuscript {
  @Fields.string({ dbName: 'author' })
  authorId = ''
  @Relations.toOne<AuthorManuscript, Author>(() => Author, 'authorId')
  author!: Author
  @Relations.toOne(() => Manuscript, {
    defaultIncluded: true
  })
  manuscript!: Manuscript
}
