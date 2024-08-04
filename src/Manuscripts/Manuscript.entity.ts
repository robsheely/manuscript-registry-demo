import { Allow, Entity, Field, Fields, Validators, Relations } from 'remult';
import { Author } from '../Authors/Author.entity';
import { Genre } from '../Authors/Genre';
import { AgeGroup } from '../Authors/AgeGroup';
import { Status } from './Status';
import { ManuscriptNote } from './ManuscriptNote.entity';
import { ManuscriptFeedback } from './ManuscriptFeedback.entity';

@Entity<Manuscript>('manuscripts', {
  allowApiCrud: Allow.authenticated,
  allowApiDelete: false,
  defaultOrderBy: {
    title: 'asc',
  },
})
export class Manuscript {
  @Fields.uuid()
  id?: string;
  @Fields.string({ validate: Validators.required })
  title = '';
  @Fields.string({ dbName: 'author' })
  authorId = '';
  @Relations.toOne<Manuscript, Author>(() => Author, 'authorId')
  author!: Author;
  @Field(() => Genre)
  genre = Genre.F1;
  @Field(() => AgeGroup)
  ageGroup = AgeGroup.adult;
  @Field(() => Status)
  status = Status.unread;
  @Fields.number({ validate: Validators.required })
  wordCount: number = 0;
  @Fields.string({ validate: Validators.required })
  target = '';
  @Fields.string({ validate: Validators.required })
  blurb = '';
  @Fields.string({ validate: Validators.required })
  pitch = '';
  @Fields.string()
  comps = '';
  @Fields.string()
  synopsis? = '';
  @Fields.boolean({ validate: Validators.required })
  published: boolean = false;
  @Fields.object<{ name: string; image: string }>()
  script = { name: '', image: '' };
  @Relations.toMany(() => ManuscriptNote)
  notes?: ManuscriptNote[];
  @Relations.toMany(() => ManuscriptFeedback)
  feedback?: ManuscriptFeedback[];
  @Fields.date({
    allowApiUpdate: false,
  })
  createdAt = new Date();
}
