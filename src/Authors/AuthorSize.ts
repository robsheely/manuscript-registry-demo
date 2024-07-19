import { ValueListFieldType } from 'remult'

@ValueListFieldType({
  getValues: () => [
    AuthorSize.s1,
    new AuthorSize(10, '2-9 employees'),
    new AuthorSize(50, '10-49 employees'),
    new AuthorSize(250, '50-249 employees'),
    new AuthorSize(500, '250 or more employees')
  ]
})
export class AuthorSize {
  constructor(public id: number, public caption: string) {}
  static s1 = new AuthorSize(1, '1 employee')
}
