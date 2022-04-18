import { DBAccountProvider } from '../../../main/data/database/account/DBAccountProvider'
import { Account } from '../../../main/domain/models/account/Account'
import { Authority } from '../../../main/domain/models/auth/Authority'
import { HttpRequestMethod } from '../../../main/gateways/IHttpGateway'
import { AdminJWTTokenVM } from '../../../main/web/http/api/v1/admin/auth/entities/AdminJWTTokenVM'
import { AdminLoginRequestPayload } from '../../../main/web/http/api/v1/admin/auth/requests/AdminLoginRequest'
import { AdminRegisterRequestPayload } from '../../../main/web/http/api/v1/admin/auth/requests/AdminRegisterRequest'
import { TestHelpers } from '../../TestHelpers'
import { constants } from 'http2'

export class HelpersAdminLogin {
  static async login(p: { testHelpers: TestHelpers; payload: AdminLoginRequestPayload }): Promise<AdminJWTTokenVM> {
    const req = await p.testHelpers.getRouter().inject({
      method: HttpRequestMethod.POST,
      url: `/api/v1/admin/auth/login`,
      payload: p.payload
    })
    expect(req.statusCode).toBe(constants.HTTP_STATUS_OK)
    return JSON.parse(req.body) as AdminJWTTokenVM
  }

  static async create(p: {
    testHelpers: TestHelpers
    payload: AdminRegisterRequestPayload
    doNotBypassValidation?: boolean
  }): Promise<Account> {
    const accountProvider = new DBAccountProvider()
    return accountProvider.create(
      new Account({
        email: p.payload.email,
        password: p.payload.password,
        authority: Authority.ADMIN
      })
    )
  }
}
