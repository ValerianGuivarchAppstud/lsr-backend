import { DBAccountProvider } from '../../../../main/data/database/account/DBAccountProvider'
import { Pageable } from '../../../../main/domain/helpers/pagination/Pageable'
import { Account } from '../../../../main/domain/models/account/Account'
import { Authority } from '../../../../main/domain/models/auth/Authority'
import { TestHelpers } from '../../../TestHelpers'

let testHelpers: TestHelpers

beforeAll(async () => {
  testHelpers = new TestHelpers()
  await testHelpers.start()
})

beforeEach(async () => {
  await testHelpers.cleanUp()
})

// afterEach(async () => {})

afterAll(async () => {
  await testHelpers.stop()
})

test('AccountProvider', async () => {
  const accountProvider = new DBAccountProvider()

  const accounts: Account[] = []
  const nbAccounts = testHelpers.chance.integer({ min: 12, max: 25 })
  // eslint-disable-next-line no-magic-numbers
  for (let i = 0; i < nbAccounts; i++) {
    const acc = await accountProvider.create(
      new Account({ email: `${i}-${testHelpers.chance.email()}`, authority: Authority.ADMIN })
    )
    accounts.push(acc)
  }

  const findAllPaginated = await accountProvider.findAllByAuthorityPaged({
    pageable: new Pageable({ sort: 'createdDate,ASC', page: 1, size: 10 }),
    authority: accounts[0].authority
  })
  expect(findAllPaginated.page).toBe(1)
  expect(findAllPaginated.totalElements).toBe(accounts.length)
  expect(findAllPaginated.content[0].id).toBe(accounts[0].id)
  expect(findAllPaginated.content[0].email).toBe(accounts[0].email)
  expect(findAllPaginated.content[0].authority).toBe(accounts[0].authority)

  const findOneById = await accountProvider.findOneById(accounts[1].id)
  expect(findOneById.id).toBe(accounts[1].id)

  const findOneByEmail = await accountProvider.findOneByEmail(accounts[1].email)
  expect(findOneByEmail.id).toBe(accounts[1].id)
})
