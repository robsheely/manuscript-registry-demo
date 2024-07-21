import { Allow, Entity, Field, Fields, Validators, Relations } from 'remult'
import { Author } from '../Authors/Author.entity'
import { Genre } from '../Authors/Genre'
import { AgeGroup } from '../Authors/AgeGroup'

@Entity<Manuscript>('manuscripts', {
  allowApiCrud: Allow.authenticated,
  allowApiDelete: false,
  defaultOrderBy: {
    title: 'asc'
  }
})
export class Manuscript {
  @Fields.uuid()
  id?: string
  @Fields.string({ validate: Validators.required })
  title = ''
  @Fields.string({ dbName: 'author' })
  authorId = ''
  @Relations.toOne<Manuscript, Author>(() => Author, 'authorId')
  author!: Author
  @Field(() => Genre)
  genre = Genre.F1
  @Field(() => AgeGroup)
  ageGroup = AgeGroup.adult
  @Fields.number({ validate: Validators.required })
  wordCount: number | null = null
  @Fields.string({ validate: Validators.required })
  target = ''
  @Fields.string({ validate: Validators.required })
  blurb = ''
  @Fields.string({ validate: Validators.required })
  pitch = ''
  @Fields.string()
  synopsis? = ''
  @Fields.boolean({ validate: Validators.required })
  published: boolean = false
  @Fields.object<{ name: string; image: string }>()
  script = { name: '', image: '' }
  @Fields.date({
    allowApiUpdate: false
  })
  createdAt = new Date()
}
