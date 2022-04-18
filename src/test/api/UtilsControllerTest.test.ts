import { HttpRequestMethod } from '../../main/gateways/IHttpGateway'
import { StatusVM } from '../../main/web/http/api/v1/utils/entities/StatusVM'
import { TestHelpers } from '../TestHelpers'
import { constants } from 'http2'

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

test('GET /api/v1/status - Should get 200', async () => {
  const res = await testHelpers.getRouter().inject({
    method: HttpRequestMethod.GET,
    url: `/api/v1/status`
  })
  expect(res.statusCode).toBe(constants.HTTP_STATUS_OK)
  const result = JSON.parse(res.body) as StatusVM
  expect(result.status).toBe('UP')
  expect(result.startedAt).toBeDefined()
  expect(result.now).toBeDefined()
  expect(result.version).toBeDefined()
  expect(result.instanceId).toBeDefined()
  expect(result.components.database.status).toBe('UP')
})
