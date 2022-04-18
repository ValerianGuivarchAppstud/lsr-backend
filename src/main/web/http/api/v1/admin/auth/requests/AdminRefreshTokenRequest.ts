import { IHttpRequest } from '../../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type AdminRefreshTokenRequest = IHttpRequest<{
  Body: AdminRefreshTokenRequestPayload
}>

export class AdminRefreshTokenRequestPayload {
  refreshToken: string

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('refreshToken', S.string().minLength(1).required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'AdminRefreshTokenRequest',
      tags: ['Admin > Auth'],
      body: this.getFluentSchema()
    }
  }
}
