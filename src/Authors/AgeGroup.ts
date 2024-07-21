import { ValueListFieldType } from 'remult'

@ValueListFieldType({
  getValues: () => [
    AgeGroup.adult,
    new AgeGroup('NA', 'New adult'),
    new AgeGroup('YA', 'Young adult'),
    new AgeGroup('Kid', 'Children')
  ]
})
export class AgeGroup {
  constructor(public id: string, public caption: string) {}
  static adult = new AgeGroup('adult', 'Adult')
}
