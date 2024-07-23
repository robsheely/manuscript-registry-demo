import { ValueListFieldType } from 'remult'
@ValueListFieldType({
  getValues: () => [
    StatusFilter.all,
    new StatusFilter('unread', 'Unread'),
    new StatusFilter('rejected', 'Rejected'),
    new StatusFilter('interested', 'Interested'),
    new StatusFilter('contacted', 'Contacted')
  ]
})
export class StatusFilter {
  static all = new StatusFilter('all', 'All')
  constructor(public id: string, public caption?: string) {}
}
