import { Authority } from '../../../../../../domain/models/auth/Authority'
import { JWTToken } from '../../../../../../domain/models/auth/JWTToken'
import S, { ObjectSchema } from 'fluent-json-schema'

export class JWTTokenVM {
  authority: string
  accessToken: string
  accessTokenExpiration: number
  refreshToken: string
  refreshTokenExpiration: number

  constructor(p: JWTTokenVM) {
    this.authority = p.authority
    this.accessToken = p.accessToken
    this.accessTokenExpiration = p.accessTokenExpiration
    this.refreshToken = p.refreshToken
    this.refreshTokenExpiration = p.refreshTokenExpiration
  }

  static of(jwtToken: JWTToken): JWTTokenVM {
    return new JWTTokenVM({
      authority: jwtToken.authority,
      accessToken: jwtToken.accessToken,
      accessTokenExpiration: jwtToken.accessTokenExpiration,
      refreshToken: jwtToken.refreshToken,
      refreshTokenExpiration: jwtToken.refreshTokenExpiration
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('authority', S.string().enum(Object.keys(Authority)).required())
      .prop('accessToken', S.string().required())
      .prop('accessTokenExpiration', S.number().required())
      .prop('refreshToken', S.string().required())
      .prop('refreshTokenExpiration', S.number().required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema().valueOf(), description: JWTTokenVM.name }
  }
}
