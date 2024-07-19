import {
  Allow,
  BackendMethod,
  Entity,
  Field,
  Fields,
  Relations,
  remult,
  repo
} from 'remult'
import { AccountManager } from '../AccountManagers/AccountManager.entity'
import { Author } from '../Authors/Author.entity'
import { Manuscript } from '../Manuscripts/Manuscript.entity'

@Entity('deals', {
  allowApiCrud: Allow.authenticated
})
export class Deal {
  @Fields.uuid()
  id?: string
  @Fields.string()
  name = ''
  @Relations.toOne(() => Author, { defaultIncluded: true })
  author!: Author
  @Fields.string()
  type = ''
  @Fields.string()
  stage = ''
  @Fields.string()
  description = ''
  @Fields.integer()
  amount = 0
  @Fields.date()
  createdAt = new Date()
  @Fields.date()
  updatedAt = new Date()
  @Relations.toOne(() => AccountManager)
  accountManager?: AccountManager
  @Fields.integer()
  index = 0
  @Relations.toMany(() => DealManuscript)
  manuscripts?: DealManuscript[]

  @BackendMethod({ allowed: Allow.authenticated })
  static async DealDroppedOnKanban(
    dealId: string,
    stage: string,
    onDealId: string | undefined
  ) {
    const dealRepo = remult!.repo(Deal)
    const deal = await dealRepo.findId(dealId)
    const origList = await dealRepo.find({
      where: { stage: deal.stage },
      orderBy: { index: 'asc' }
    })
    let targetList = origList
    if (deal.stage !== stage) {
      targetList = await (
        await dealRepo.find({ where: { stage }, orderBy: { index: 'asc' } })
      ).filter((d) => d.id !== deal.id)
      deal.stage = stage
    }
    Deal.organizeLists({ dealId, stage, onDealId, origList, targetList })
    let i = 0
    for (const deal of targetList) {
      deal.index = i++
      await dealRepo.save(deal)
    }
    if (targetList !== origList) {
      i = 0
      for (const deal of origList) {
        deal.index = i++
        await dealRepo.save(deal)
      }
    }
  }
  static organizeLists({
    dealId,
    onDealId,
    stage,
    origList,
    targetList
  }: {
    dealId: string
    stage: string
    onDealId: string | undefined
    origList: Deal[]
    targetList: Deal[]
  }) {
    if (dealId === onDealId) return
    const deal = origList.find((d) => d.id === dealId)!
    deal.stage = stage
    const origIndex = origList.findIndex((d) => d.id === deal.id)
    origList.splice(origIndex, 1)
    if (!onDealId) {
      targetList.push(deal)
    } else {
      let insertAt = targetList.findIndex((d) => d.id === onDealId)
      if (insertAt >= origIndex && origList === targetList) insertAt++
      targetList.splice(insertAt, 0, deal)
    }
  }
  @BackendMethod({ allowed: Allow.authenticated })
  async saveWithManuscripts?(manuscripts: string[]) {
    const isNew = !this.id
    console.log('#### 0')
    const deal = await repo(Deal).save(this)
    console.log('#### 1')
    const dealManuscriptRepo = repo(Deal).relations(deal).manuscripts
    const existingManuscripts = isNew
      ? []
      : await dealManuscriptRepo.find({
          include: {
            contact: false
          }
        })
    const manuscriptsToDelete = existingManuscripts.filter(
      (c) => !manuscripts.includes(c.contactId)
    )
    const manuscriptsToAdd = manuscripts.filter(
      (c) => !existingManuscripts.find((e) => e.contactId == c)
    )
    console.log('#### 2', {
      existingManuscripts,
      manuscriptsToDelete,
      manuscriptsToAdd
    })
    await Promise.all(
      manuscriptsToDelete.map((dc) => dealManuscriptRepo.delete(dc))
    )
    await dealManuscriptRepo.insert(
      manuscriptsToAdd.map((contactId) => ({ contactId }))
    )
  }
}

@Entity<DealManuscript>('dealManuscripts', {
  allowApiCrud: Allow.authenticated,
  id: { deal: true, contactId: true }
})
export class DealManuscript {
  @Relations.toOne(() => Deal)
  deal!: Deal
  @Relations.toOne<DealManuscript, Manuscript>(() => Manuscript, 'contactId')
  contact!: Manuscript
  @Fields.string({ dbName: 'contact' })
  contactId!: string
}
