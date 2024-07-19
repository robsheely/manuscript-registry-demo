import { Allow, Entity, Field, Fields, Relations } from 'remult'
import { Manuscript } from './Manuscript.entity'
import { Tag } from './Tag.entity'

@Entity<ManuscriptTag>('contactTag', {
  allowApiCrud: Allow.authenticated,
  id: { contactId: true, tag: true }
})
export class ManuscriptTag {
  @Fields.string({ dbName: 'contact' })
  contactId = ''
  @Relations.toOne<ManuscriptTag, Manuscript>(() => Manuscript, 'contactId')
  contact!: Manuscript

  @Relations.toOne(() => Tag, {
    defaultIncluded: true
  })
  tag!: Tag
}
