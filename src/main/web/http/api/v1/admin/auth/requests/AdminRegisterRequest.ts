import { APPLICATION_CONSTANTS } from '../../../../../../../config/Constants'
import { IHttpRequest } from '../../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type AdminRegisterRequest = IHttpRequest<{
  Body: AdminRegisterRequestPayload
}>

export class AdminRegisterRequestPayload {
  email: string
  password: string

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('email', S.string().minLength(1).required())
      .prop('password', S.string().minLength(APPLICATION_CONSTANTS.MIN_PASSWORD_LENGTH).required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'AdminRegisterRequest',
      tags: ['Admin > Auth'],
      body: this.getFluentSchema()
    }
  }
}
