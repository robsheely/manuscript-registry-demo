import { ValueListFieldType } from 'remult'
@ValueListFieldType({
  getValues: () => [
    Status.all,
    Status.unread,
    new Status('rejected', 'Rejected'),
    new Status('interested', 'Interested'),
    new Status('contacted', 'Contacted')
  ]
})
export class Status {
  static all = new Status('all', 'All')
  static unread = new Status('unread', 'Unread')
  constructor(public id: string, public caption?: string) {}
}
