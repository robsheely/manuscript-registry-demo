import { Allow, Entity, Fields, Relations } from 'remult'
import { Manuscript } from './Manuscript.entity'

@Entity<ManuscriptFeedback>('manuscriptFeedback', {
  allowApiCrud: Allow.authenticated,
  defaultOrderBy: {
    createdAt: 'desc'
  }
})
export class ManuscriptFeedback {
  @Fields.uuid()
  id?: string
  @Fields.string({ dbName: 'manuscript' })
  manuscriptId = ''
  @Relations.toOne<ManuscriptFeedback, Manuscript>(
    () => Manuscript,
    'manuscriptId'
  )
  manuscript?: Manuscript
  @Fields.string()
  text = ''
  @Fields.date()
  createdAt = new Date()
}
