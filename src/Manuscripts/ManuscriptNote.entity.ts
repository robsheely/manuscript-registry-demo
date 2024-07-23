import { Allow, Entity, Fields, Relations } from 'remult'
import { Manuscript } from './Manuscript.entity'

@Entity<ManuscriptNote>('contactNote', {
  allowApiCrud: Allow.authenticated,
  defaultOrderBy: {
    createdAt: 'desc'
  }
})
export class ManuscriptNote {
  @Fields.uuid()
  id?: string
  @Fields.string({ dbName: 'contact' })
  manuscriptId = ''
  @Relations.toOne<ManuscriptNote, Manuscript>(() => Manuscript, 'manuscriptId')
  contact?: Manuscript
  @Fields.string()
  text = ''
  @Fields.date()
  createdAt = new Date()
}
