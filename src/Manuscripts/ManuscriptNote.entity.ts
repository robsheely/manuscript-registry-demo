import { Allow, Entity, Fields, Relations } from 'remult'
import { Manuscript } from './Manuscript.entity'

@Entity<ManuscriptNote>('manuscriptNote', {
  allowApiCrud: Allow.authenticated,
  defaultOrderBy: {
    createdAt: 'desc'
  }
})
export class ManuscriptNote {
  @Fields.uuid()
  id?: string
  @Fields.string({ dbName: 'manuscript' })
  manuscriptId = ''
  @Relations.toOne<ManuscriptNote, Manuscript>(() => Manuscript, 'manuscriptId')
  manuscript?: Manuscript
  @Fields.string()
  text = ''
  @Fields.date()
  createdAt = new Date()
}
