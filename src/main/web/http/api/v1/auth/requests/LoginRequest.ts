import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type LoginRequest = IHttpRequest<{
  Body: LoginRequestPayload
}>

export class LoginRequestPayload {
  email: string
  password: string

  static getFluentSchema(): ObjectSchema {
    return (
      S.object()
        .prop('email', S.string().minLength(1).required())
        // eslint-disable-next-line no-magic-numbers
        .prop('password', S.string().minLength(8).required())
    )
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'LoginRequest',
      tags: ['Swag > Account'],
      body: this.getFluentSchema()
    }
  }
}
