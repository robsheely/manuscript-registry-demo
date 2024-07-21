import { getValueList, remult, repo } from 'remult'
import { AccountManager } from '../AccountManagers/AccountManager.entity'
import {
  name as nameFaker,
  internet,
  random,
  address,
  company as authorFaker,
  datatype,
  phone,
  lorem,
  date
} from 'faker'
import { Author } from '../Authors/Author.entity'
import { Manuscript } from '../Manuscripts/Manuscript.entity'
import { Status } from '../Manuscripts/Status'
import { ManuscriptNote } from '../Manuscripts/ManuscriptNote.entity'
import { Tag } from '../Manuscripts/Tag.entity'

export async function seed() {
  try {
    {
      const repo = remult.repo(Tag)
      if ((await repo.count()) == 0)
        await repo.insert([
          { tag: 'football-fan', color: '#eddcd2' },
          { tag: 'holiday-card', color: '#fff1e6' },
          { tag: 'influencer', color: '#fde2e4' },
          { tag: 'manager', color: '#fad2e1' },
          { tag: 'musician', color: '#c5dedd' },
          { tag: 'vip', color: '#dbe7e4' }
        ])
    }
    {
      const repo = remult.repo(AccountManager)
      if ((await repo.count()) == 0) {
        for (let index = 0; index < 10; index++) {
          const firstName = nameFaker.firstName()
          const lastName = nameFaker.lastName()
          await repo.insert({
            firstName,
            lastName,
            email: internet.email(firstName, lastName),
            avatar: 'https://i.pravatar.cc/40?img=' + datatype.number(70)
          })
        }
      }
    }
    {
      const authorRepo = remult.repo(Author)
      const accountManagers = await remult.repo(AccountManager).find()
      if ((await authorRepo.count()) == 0) {
        console.log('Start seed author')
        Manuscript.disableLastSeenUpdate = true

        const tags = await remult.repo(Tag).find()
        // delete related data
        {
          for (const c of await repo(Manuscript).find()) {
            await repo(Manuscript).delete(c)
          }
          for (const c of await repo(ManuscriptNote).find()) {
            await repo(ManuscriptNote).delete(c)
          }

          for (const c of await repo(ManuscriptNote).find()) {
            await repo(ManuscriptNote).delete(c)
          }
        }
        // Start create Authors
        for (let index = 0; index < 100; index++) {
          const name = authorFaker.companyName()
          const author = await authorRepo.insert({
            address: address.streetAddress(),
            city: address.city(),
            linkedIn: `https://www.linkedin.com/author/${name
              .toLowerCase()
              .replace(/\W+/, '_')}`,
            logo: `https://picsum.photos/id/${datatype.number(1000)}/200/200`,
            name,
            phoneNumber: phone.phoneNumber(),
            stateAbbr: address.stateAbbr(),
            website: internet.url(),
            zipcode: address.zipCode(),
            createdAt: date.recent(500)
          })
          const compRel = authorRepo.relations(author)
          const manuscripts: Manuscript[] = []
          console.log(index + ': ' + author.name)
          // Create contact
          {
            let numOfManuscripts = datatype.number(author.size.id / 10)
            if (numOfManuscripts < 1) numOfManuscripts = 1
            for (let index = 0; index < numOfManuscripts; index++) {
              const firstName = nameFaker.firstName()
              const lastName = nameFaker.lastName()
              const title = authorFaker.bsAdjective()
              const contact = await compRel.manuscripts.insert({
                firstName,
                lastName,
                title,
                email: internet.email(firstName, lastName),
                phoneNumber1: phone.phoneNumber(),
                phoneNumber2: phone.phoneNumber(),
                background: lorem.sentence(),
                avatar: 'https://i.pravatar.cc/40?img=' + datatype.number(70),
                hasNewsletter: datatype.boolean(),
                status: random.arrayElement(getValueList(Status)),
                accountManager: random.arrayElement(accountManagers)
              })
              manuscripts.push(contact)
              const contactRel = compRel.manuscripts.relations(contact)
              // Create Manuscript Notes
              for (let index = 0; index < datatype.number(20) + 1; index++) {
                const note = await contactRel.notes.insert({
                  text: lorem.paragraphs(3),
                  accountManager: random.arrayElement(accountManagers),
                  createdAt: date.between(author.createdAt, new Date()),
                  status: random.arrayElement(getValueList(Status))
                })
                if (index == 0 || note.createdAt > contact.lastSeen) {
                  contact.lastSeen = note.createdAt
                }
                if (index == 0 || note.createdAt < contact.createdAt) {
                  contact.createdAt = note.createdAt
                }
              }
              // Create Manuscript Tags
              await contactRel.tags.insert(
                random
                  .arrayElements(tags, datatype.number(3))
                  .map((tag) => ({ tag }))
              )
              await compRel.manuscripts.save(contact)
            }
          }
        }
        console.log('End seed author')
      }
    }
  } catch (err) {
    console.log({ err })
  }
}
