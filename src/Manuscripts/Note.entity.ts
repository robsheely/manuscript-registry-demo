import { Allow, Entity, Fields, Relations } from 'remult'

@Entity<Note>('note', {
  allowApiCrud: Allow.authenticated,
  id: { authorId: true, manuscriptId: true }
})
export class Note {
  @Fields.uuid()
  id?: string
  @Fields.string()
  author = ''
  @Fields.string()
  test = ''
  @Fields.date({ allowApiUpdate: false })
  createdAt = new Date()
}
