import { TestHelpers } from '../TestHelpers'

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
}) /*
/*

test('POST /api/v1/auth/register - Should get 200', async () => {
  const registerPayload: RegisterRequestPayload = { email: testHelpers.chance.email(), password: 'password' }

  const resRegister = await testHelpers.getRouter().inject({
    method: HttpRequestMethod.POST,
    url: '/api/v1/auth/register',
    payload: registerPayload
  })
  expect(resRegister.statusCode).toBe(constants.HTTP_STATUS_OK)
  const result = JSON.parse(resRegister.body) as AccountVM
  expect(result.email).toBe(registerPayload.email)
  expect(result.id).toBeDefined()
  expect(result.createdDate).toBeDefined()
  expect(result.updatedDate).toBeDefined()

  const loginPayload: RegisterRequestPayload = { email: result.email, password: 'password' }

  const resLogin = await testHelpers.getRouter().inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: loginPayload
  })
  expect(resLogin.statusCode).toBe(constants.HTTP_STATUS_OK)
  const resultLogin = JSON.parse(resLogin.body) as JWTTokenVM
  expect(resultLogin.accessToken).toBeDefined()
  expect(resultLogin.accessTokenExpiration).toBeDefined()
  expect(resultLogin.refreshToken).toBeDefined()
  expect(resultLogin.refreshTokenExpiration).toBeDefined()

  /**
   * CHECK A FAILED LOGIN
   */ /*
  const loginPayloadFailed: RegisterRequestPayload = { email: testHelpers.chance.email(), password: 'passwordpassword' }
  const resLoginFailed = await testHelpers.getRouter().inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: loginPayloadFailed
  })
  expect(resLoginFailed.statusCode).toBe(constants.HTTP_STATUS_UNAUTHORIZED)
})
*/
