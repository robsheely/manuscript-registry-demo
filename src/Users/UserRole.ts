import { ValueListFieldType } from 'remult';

@ValueListFieldType({
  getValues: () => [
    UserRole.none,
    UserRole.agent,
    UserRole.author,
    UserRole.admin,
  ],
})
export class UserRole {
  static none = new UserRole('none', 'None');
  static agent = new UserRole('agent', 'Agent');
  static author = new UserRole('author', 'Author');
  static admin = new UserRole('admin', 'Admin');
  constructor(public id: string, public caption?: string) {}
}
