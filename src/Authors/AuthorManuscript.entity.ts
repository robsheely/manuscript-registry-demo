import { Allow, Entity, Fields, Relations } from 'remult'
import { Author } from './Author.entity'
import { Manuscript } from '../Manuscripts/Manuscript.entity'

@Entity<AuthorManuscript>('authorManuscript', {
  allowApiCrud: Allow.authenticated,
  id: { manuscriptId: true, author: true }
})
export class AuthorManuscript {
  @Fields.string({ dbName: 'manuscript' })
  manuscriptId = ''
  @Relations.toOne<AuthorManuscript, Manuscript>(
    () => Manuscript,
    'manuscriptId'
  )
  manuscript!: Manuscript

  @Relations.toOne(() => Author, {
    defaultIncluded: true
  })
  author!: Author
}
