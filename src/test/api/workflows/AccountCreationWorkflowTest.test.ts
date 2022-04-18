import { ProfileUpdateRequestPayload } from '../../../main/web/http/api/v1/account/requests/ProfileUpdateRequest'
import { RegisterRequestPayload } from '../../../main/web/http/api/v1/auth/requests/RegisterRequest'
import { HelpersAccountProfile } from '../../helpers/HelpersAccountProfile'
import { TestHelpers } from '../../TestHelpers'

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

test('Account creation workflow', async () => {
  const registerPayload: RegisterRequestPayload = {
    email: testHelpers.chance.email(),
    password: testHelpers.chance.guid()
  }

  const registeredAccount = await HelpersAccountProfile.register({
    testHelpers: testHelpers,
    payload: registerPayload
  })
  expect(registeredAccount.id).toBeDefined()
  expect(registeredAccount.email).toBe(registerPayload.email)
  expect(registeredAccount.profile.id).toBeDefined()
  expect(registeredAccount.createdDate).toBeDefined()
  expect(registeredAccount.updatedDate).toBeDefined()

  /**
   * USER LOGIN
   */
  const jwtToken = await HelpersAccountProfile.login({
    testHelpers: testHelpers,
    payload: { email: registeredAccount.email, password: registerPayload.password }
  })
  expect(jwtToken.accessToken).toBeDefined()
  expect(jwtToken.accessTokenExpiration).toBeDefined()
  expect(jwtToken.refreshToken).toBeDefined()
  expect(jwtToken.refreshTokenExpiration).toBeDefined()

  const accountMe = await HelpersAccountProfile.me({
    testHelpers: testHelpers,
    token: jwtToken.accessToken
  })
  expect(accountMe.email).toBe(registerPayload.email)
  expect(accountMe.profile.id).toBeDefined()

  /**
   * UPDATE ACCOUNT
   */
  const accountMeUpdatedPayload: ProfileUpdateRequestPayload = {
    email: testHelpers.chance.email()
  }
  const accountMeUpdated = await HelpersAccountProfile.update({
    testHelpers: testHelpers,
    token: jwtToken.accessToken,
    payload: accountMeUpdatedPayload
  })
  expect(accountMeUpdated.email).toBe(accountMeUpdatedPayload.email)
  expect(accountMeUpdated.profile.id).toBe(accountMe.profile.id)

  const accountMe2 = await HelpersAccountProfile.me({
    testHelpers: testHelpers,
    token: jwtToken.accessToken
  })
  expect(accountMe2.email).toBe(accountMeUpdated.email)
  expect(accountMe2.profile.id).toBe(accountMeUpdated.profile.id)
})
