import {
    Allow,
    Entity,
    Fields,
    Validators
} from 'remult'

@Entity('users', {
    allowApiCrud: Allow.authenticated,
    allowApiDelete: false
})
export class User {
    @Fields.uuid()
    id?: string
    @Fields.string({ validate: [Validators.email, Validators.required] })
    email = ''
    @Fields.string({ validate: Validators.required })
    hash = ''
}
