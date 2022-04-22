import { injectBearerToken } from './tools/InjectBearerToken'
import { HttpRequestMethod } from '../../main/gateways/IHttpGateway'
import { AccountVM } from '../../main/web/http/api/v1/character/entities/AccountVM'
import { ProfileUpdateRequestPayload } from '../../main/web/http/api/v1/character/requests/CharacterUpdateRequest'
import { JWTTokenVM } from '../../main/web/http/api/v1/auth/entities/JWTTokenVM'
import { LoginRequestPayload } from '../../main/web/http/api/v1/auth/requests/LoginRequest'
import { RegisterRequestPayload } from '../../main/web/http/api/v1/auth/requests/RegisterRequest'
import { TestHelpers } from '../TestHelpers'
import { constants } from 'http2'

export class HelpersAccountProfile {
  static async register(p: { testHelpers: TestHelpers; payload: Partial<RegisterRequestPayload> }): Promise<AccountVM> {
    const payload: RegisterRequestPayload = {
      email: p.payload.email ?? p.testHelpers.chance.email(),
      password: p.payload.password ?? 'password'
    }

    const req = await p.testHelpers.getRouter().inject({
      method: HttpRequestMethod.POST,
      url: `/api/v1/auth/register`,
      payload: payload
    })
    expect(req.statusCode).toBe(constants.HTTP_STATUS_OK)

    return JSON.parse(req.body) as AccountVM
  }

  static async login(p: { testHelpers: TestHelpers; payload: LoginRequestPayload }): Promise<JWTTokenVM> {
    const req = await p.testHelpers.getRouter().inject({
      method: HttpRequestMethod.POST,
      url: `/api/v1/auth/login`,
      payload: p.payload
    })
    expect(req.statusCode).toBe(constants.HTTP_STATUS_OK)

    return JSON.parse(req.body) as JWTTokenVM
  }

  static async me(p: { testHelpers: TestHelpers; token: string }): Promise<AccountVM> {
    const result = await p.testHelpers.getRouter().inject({
      method: HttpRequestMethod.GET,
      url: `/api/v1/account/me`,
      headers: {
        authorization: injectBearerToken(p.token)
      }
    })
    expect(result.statusCode).toBe(constants.HTTP_STATUS_OK)

    const accountProfile = JSON.parse(result.body) as AccountVM
    expect(accountProfile.id).toBeDefined()
    expect(accountProfile.email).toBeDefined()
    return accountProfile
  }

  static async update(p: {
    testHelpers: TestHelpers
    token: string
    payload: ProfileUpdateRequestPayload
  }): Promise<AccountVM> {
    const result = await p.testHelpers.getRouter().inject({
      method: HttpRequestMethod.PUT,
      url: `/api/v1/account/me`,
      headers: {
        authorization: injectBearerToken(p.token)
      },
      payload: p.payload
    })
    expect(result.statusCode).toBe(constants.HTTP_STATUS_OK)

    return JSON.parse(result.body) as AccountVM
  }
}
