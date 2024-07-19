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
import { sectors } from '../Authors/Sectors'
import { AuthorSize } from '../Authors/AuthorSize'
import { Manuscript } from '../Manuscripts/Manuscript.entity'
import { Gender } from '../Manuscripts/Gender'
import { Status } from '../Manuscripts/Status'
import { ManuscriptNote } from '../Manuscripts/ManuscriptNote.entity'
import { Tag } from '../Manuscripts/Tag.entity'
import { Deal, DealManuscript } from '../Deals/Deal.entity'
import { DealStages } from '../Deals/DealStage'
import { DealTypes } from '../Deals/DealType'

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
        const dealRepo = remult.repo(Deal)
        const dealManuscriptRepo = remult.repo(DealManuscript)

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
          for (const c of await dealRepo.find()) {
            await dealRepo.delete(c)
          }
          for (const c of await dealManuscriptRepo.find()) {
            await dealManuscriptRepo.delete(c)
          }
        }
        // Start create Authors
        for (let index = 0; index < 100; index++) {
          const name = authorFaker.companyName()
          const author = await authorRepo.insert({
            accountManager: random.arrayElement(accountManagers),
            address: address.streetAddress(),
            city: address.city(),
            linkedIn: `https://www.linkedin.com/author/${name
              .toLowerCase()
              .replace(/\W+/, '_')}`,
            logo: `https://picsum.photos/id/${datatype.number(1000)}/200/200`,
            name,
            phoneNumber: phone.phoneNumber(),
            sector: random.arrayElement(sectors),
            size: random.arrayElement(getValueList(AuthorSize)),
            stateAbbr: address.stateAbbr(),
            website: internet.url(),
            zipcode: address.zipCode(),
            createdAt: date.recent(500)
          })
          const compRel = authorRepo.relations(author)
          const contacts: Manuscript[] = []
          console.log(index + ': ' + author.name)
          // Create contact
          {
            let numOfManuscripts = datatype.number(author.size.id / 10)
            if (numOfManuscripts < 1) numOfManuscripts = 1
            for (let index = 0; index < numOfManuscripts; index++) {
              const firstName = nameFaker.firstName()
              const lastName = nameFaker.lastName()
              const title = authorFaker.bsAdjective()
              const contact = await compRel.contacts.insert({
                firstName,
                lastName,
                gender: random.arrayElement(getValueList(Gender)),
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
              contacts.push(contact)
              const contactRel = compRel.contacts.relations(contact)
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
              await compRel.contacts.save(contact)
            }
          }
          {
            for (let index = 0; index < datatype.number(5) + 1; index++) {
              let name = lorem.words()
              name = name[0].toUpperCase() + name.slice(1)
              const created_at = date.between(author.createdAt, new Date())
              const deal = await dealRepo.insert({
                accountManager: random.arrayElement(accountManagers),
                amount: datatype.number(1000) * 100,
                author,
                name,
                description: lorem.paragraph(datatype.number(4) + 1),
                createdAt: created_at,
                stage: random.arrayElement(DealStages),
                type: random.arrayElement(DealTypes),
                updatedAt: date.between(created_at, new Date())
              })

              dealRepo.relations(deal).contacts.insert(
                random
                  .arrayElements(contacts, datatype.number(4) + 1)
                  .map((contact) => ({
                    contact
                  }))
              )
            }
          }
        }
        console.log('End seed author')
      }
    }
  } catch (err) {
    console.log({ err })
  } finally {
    Manuscript.disableLastSeenUpdate = false
  }
}
