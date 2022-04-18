import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type RefreshTokenRequest = IHttpRequest<{
  Body: RefreshTokenRequestPayload
}>

export class RefreshTokenRequestPayload {
  refreshToken: string

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('refreshToken', S.string().minLength(1).required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'RefreshTokenRequest',
      tags: ['Swag > Account'],
      body: this.getFluentSchema()
    }
  }
}
