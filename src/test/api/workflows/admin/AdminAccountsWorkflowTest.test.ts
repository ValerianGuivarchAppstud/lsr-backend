import { Authority } from '../../../../main/domain/models/auth/Authority'
import { AdminCreateAccountRequestPayload } from '../../../../main/web/http/api/v1/admin/accounts/requests/AdminCreateAccountRequest'
import { AdminUpdateAccountRequestPayload } from '../../../../main/web/http/api/v1/admin/accounts/requests/AdminUpdateAccountRequest'
import { HelpersAdminLogin } from '../../../helpers/admin/HelpersAdminLogin'
import { HelpersAdminUser } from '../../../helpers/admin/HelpersAdminUser'
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

test('Admin users workflow', async () => {
  const adminInfos = {
    email: testHelpers.chance.email(),
    password: testHelpers.chance.guid()
  }
  const adminAccount = await HelpersAdminLogin.create({ testHelpers: testHelpers, payload: adminInfos })
  const adminToken = await HelpersAdminLogin.login({
    testHelpers: testHelpers,
    payload: { email: adminAccount.email, password: adminInfos.password }
  })

  /**
   * ADMIN CREATE USER
   */
  const createPayload: AdminCreateAccountRequestPayload = {
    email: testHelpers.chance.email(),
    password: testHelpers.chance.guid()
  }
  const accountCreated = await HelpersAdminUser.create({
    testHelpers: testHelpers,
    adminToken: adminToken.accessToken,
    payload: createPayload
  })
  expect(accountCreated.id).toBeDefined()
  expect(accountCreated.email).toBe(createPayload.email)
  expect(accountCreated.authority).toBe(Authority.USER)
  expect(accountCreated.createdDate).toBeDefined()
  expect(accountCreated.updatedDate).toBeDefined()

  /**
   * ADMIN UPDATE USER
   */
  const updatePayload: AdminUpdateAccountRequestPayload = {
    email: testHelpers.chance.email()
  }
  const accountUpdated = await HelpersAdminUser.update({
    testHelpers: testHelpers,
    adminToken: adminToken.accessToken,
    id: accountCreated.id,
    payload: updatePayload
  })
  expect(accountUpdated.id).toBe(accountCreated.id)
  expect(accountUpdated.email).toBe(updatePayload.email)
  expect(accountUpdated.authority).toBe(accountCreated.authority)
  expect(accountUpdated.createdDate).toBeDefined()
  expect(accountUpdated.updatedDate).toBeDefined()

  /**
   * ADMIN GET USER
   */
  const accountGet = await HelpersAdminUser.get({
    testHelpers: testHelpers,
    adminToken: adminToken.accessToken,
    id: accountUpdated.id
  })
  expect(accountGet.id).toBe(accountUpdated.id)
  expect(accountGet.email).toBe(accountUpdated.email)
  expect(accountGet.authority).toBe(accountUpdated.authority)
  expect(accountGet.createdDate).toBeDefined()
  expect(accountGet.updatedDate).toBeDefined()

  /**
   * ADMIN GET ALL USER
   */
  const accountGetAll = await HelpersAdminUser.getAll({
    testHelpers: testHelpers,
    adminToken: adminToken.accessToken
  })
  expect(accountGetAll.totalElements).toBe(1)
  expect(accountGetAll.content[0].id).toBe(accountGet.id)
  expect(accountGetAll.content[0].email).toBe(accountGet.email)
  expect(accountGetAll.content[0].authority).toBe(accountGet.authority)
  expect(accountGetAll.content[0].createdDate).toBeDefined()
  expect(accountGetAll.content[0].updatedDate).toBeDefined()

  /**
   * ADMIN GET MANY USER
   */
  const accountGetMany = await HelpersAdminUser.getMany({
    testHelpers: testHelpers,
    adminToken: adminToken.accessToken,
    ids: [accountGetAll.content[0].id]
  })
  expect(accountGetMany.totalElements).toBe(1)
  expect(accountGetMany.content[0].id).toBe(accountGet.id)
  expect(accountGetMany.content[0].email).toBe(accountGet.email)
  expect(accountGetMany.content[0].authority).toBe(accountGet.authority)
  expect(accountGetMany.content[0].createdDate).toBeDefined()
  expect(accountGetMany.content[0].updatedDate).toBeDefined()
})
