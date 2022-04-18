import { Page } from '../../../main/domain/helpers/pagination/Page'
import { HttpRequestMethod } from '../../../main/gateways/IHttpGateway'
import { AdminUserVM } from '../../../main/web/http/api/v1/admin/accounts/entities/AdminUserVM'
import { AdminCreateAccountRequestPayload } from '../../../main/web/http/api/v1/admin/accounts/requests/AdminCreateAccountRequest'
import { AdminUpdateAccountRequestPayload } from '../../../main/web/http/api/v1/admin/accounts/requests/AdminUpdateAccountRequest'
import { ReactAdminPage } from '../../../main/web/http/api/v1/admin/common/pagination/ReactAdminPage'
import { TestHelpers } from '../../TestHelpers'
import { injectBearerToken } from '../tools/InjectBearerToken'
import { constants } from 'http2'

export class HelpersAdminUser {
  static async create(p: {
    testHelpers: TestHelpers
    adminToken: string
    payload: AdminCreateAccountRequestPayload
  }): Promise<AdminUserVM> {
    const req = await p.testHelpers.getRouter().inject({
      method: HttpRequestMethod.POST,
      url: `/api/v1/admin/accounts`,
      payload: p.payload,
      headers: {
        authorization: injectBearerToken(p.adminToken)
      }
    })
    expect(req.statusCode).toBe(constants.HTTP_STATUS_OK)
    return JSON.parse(req.body) as AdminUserVM
  }

  static async update(p: {
    testHelpers: TestHelpers
    adminToken: string
    id: string
    payload: AdminUpdateAccountRequestPayload
  }): Promise<AdminUserVM> {
    const req = await p.testHelpers.getRouter().inject({
      method: HttpRequestMethod.PUT,
      url: `/api/v1/admin/accounts/${p.id}`,
      payload: p.payload,
      headers: {
        authorization: injectBearerToken(p.adminToken)
      }
    })
    expect(req.statusCode).toBe(constants.HTTP_STATUS_OK)
    return JSON.parse(req.body) as AdminUserVM
  }

  static async get(p: { testHelpers: TestHelpers; adminToken: string; id: string }): Promise<AdminUserVM> {
    const req = await p.testHelpers.getRouter().inject({
      method: HttpRequestMethod.GET,
      url: `/api/v1/admin/accounts/${p.id}`,
      headers: {
        authorization: injectBearerToken(p.adminToken)
      }
    })
    expect(req.statusCode).toBe(constants.HTTP_STATUS_OK)
    return JSON.parse(req.body) as AdminUserVM
  }

  static async getAll(p: { testHelpers: TestHelpers; adminToken: string }): Promise<Page<AdminUserVM>> {
    const req = await p.testHelpers.getRouter().inject({
      method: HttpRequestMethod.GET,
      url: `/api/v1/admin/accounts`,
      headers: {
        authorization: injectBearerToken(p.adminToken)
      }
    })
    expect(req.statusCode).toBe(constants.HTTP_STATUS_OK)
    return JSON.parse(req.body) as Page<AdminUserVM>
  }

  static async getMany(p: {
    testHelpers: TestHelpers
    adminToken: string
    ids: string[]
  }): Promise<ReactAdminPage<AdminUserVM>> {
    const req = await p.testHelpers.getRouter().inject({
      method: HttpRequestMethod.GET,
      url: `/api/v1/admin/accounts?ids=${p.ids.join(',')}`,
      headers: {
        authorization: injectBearerToken(p.adminToken)
      }
    })
    expect(req.statusCode).toBe(constants.HTTP_STATUS_OK)
    return JSON.parse(req.body) as ReactAdminPage<AdminUserVM>
  }
}
