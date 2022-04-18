import { APPLICATION_CONSTANTS } from '../../../../../../../config/Constants'
import { IHttpRequest } from '../../../../../../../gateways/IHttpGateway'
import { LoginRequestPayload } from '../../../auth/requests/LoginRequest'
import S, { ObjectSchema } from 'fluent-json-schema'

export type AdminLoginRequest = IHttpRequest<{
  Body: LoginRequestPayload
}>

export class AdminLoginRequestPayload {
  email: string
  password: string

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('email', S.string().minLength(1).required())
      .prop('password', S.string().minLength(APPLICATION_CONSTANTS.MIN_PASSWORD_LENGTH).required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'AdminLoginRequest',
      tags: ['Admin > Auth'],
      body: this.getFluentSchema()
    }
  }
}
