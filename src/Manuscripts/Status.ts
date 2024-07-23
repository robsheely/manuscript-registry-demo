import { ValueListFieldType } from 'remult'
@ValueListFieldType({
  getValues: () => [
    Status.unread,
    new Status('rejected', 'Rejected'),
    new Status('interested', 'Interested'),
    new Status('contacted', 'Contacted')
  ]
})
export class Status {
  static unread = new Status('unread', 'Unread')
  constructor(public id: string, public caption?: string) {}
}
