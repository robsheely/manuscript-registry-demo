import { ValueListFieldType } from 'remult'
@ValueListFieldType({
  getValues: () => [
    Status.unread,
    new Status('rejected', '#e8cb7d', 'Rejected'),
    new Status('interested', '#e88b7d', 'Interested'),
    new Status('contacted', '#a4e87d', 'Contacted')
  ]
})
export class Status {
  static unread = new Status('unread', '#7dbde8')
  constructor(
    public id: string,
    public color: string,
    public caption?: string
  ) {}
}
