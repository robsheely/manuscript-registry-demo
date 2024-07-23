import { ValueListFieldType } from 'remult'
@ValueListFieldType({
  getValues: () => [
    Status.all,
    new Status('unread', '#7dbde8', 'Unread'),
    new Status('rejected', '#e8cb7d', 'Rejected'),
    new Status('interested', '#e88b7d', 'Interested'),
    new Status('contacted', '#a4e87d', 'Contacted')
  ]
})
export class Status {
  static all = new Status('all', 'All')
  constructor(
    public id: string,
    public color: string,
    public caption?: string
  ) {}
}
