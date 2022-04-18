import { Authority } from '../../../../../../../domain/models/auth/Authority'
import { JWTToken } from '../../../../../../../domain/models/auth/JWTToken'
import S, { ObjectSchema } from 'fluent-json-schema'

export class AdminJWTTokenVM {
  accessToken: string
  accessTokenExpiration: number
  refreshToken: string
  refreshTokenExpiration: number
  authority: Authority

  constructor(p: JWTToken) {
    this.accessToken = p.accessToken
    this.accessTokenExpiration = p.accessTokenExpiration
    this.refreshToken = p.refreshToken
    this.refreshTokenExpiration = p.refreshTokenExpiration
    this.authority = p.authority
  }

  static of(jwtToken: JWTToken): AdminJWTTokenVM {
    return new AdminJWTTokenVM({
      accessToken: jwtToken.accessToken,
      accessTokenExpiration: jwtToken.accessTokenExpiration,
      refreshToken: jwtToken.refreshToken,
      refreshTokenExpiration: jwtToken.refreshTokenExpiration,
      authority: jwtToken.authority
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('accessToken', S.string().required())
      .prop('accessTokenExpiration', S.number().required())
      .prop('refreshToken', S.string().required())
      .prop('refreshTokenExpiration', S.number().required())
      .prop('authority', S.string().enum(Object.keys(Authority)).required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema().valueOf(), description: AdminJWTTokenVM.name }
  }
}
