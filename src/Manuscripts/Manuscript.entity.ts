import {
  Allow,
  Entity,
  EntityFilter,
  Field,
  Filter,
  remult,
  Fields,
  Validators,
  Relations
} from 'remult'
import { Author } from '../Authors/Author.entity'
import { ManuscriptTag } from './ManuscriptTag.entity'
import { Tag } from './Tag.entity'
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
  @Relations.toMany(() => ManuscriptTag)
  tags?: ManuscriptTag[]
  @Fields.object<{ name: string; image: string }>()
  script = ''
  @Fields.date({
    allowApiUpdate: false
  })
  createdAt = new Date()

  static filterTag = Filter.createCustom<Manuscript, string>(async (tag) => {
    if (!tag) return {}
    const r: EntityFilter<Manuscript> = {
      id: await remult
        .repo(ManuscriptTag)
        .find({
          where: {
            tag: await remult.repo(Tag).findFirst({ tag })
          },
          load: () => []
        })
        .then((ct) => ct.map((ct) => ct.contactId))
    }
    return r
  })
}
