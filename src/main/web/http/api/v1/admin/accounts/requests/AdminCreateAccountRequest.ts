import { Account } from '../../../../../../../domain/models/account/Account'
import { IHttpRequest } from '../../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type AdminCreateAccountRequest = IHttpRequest<{
  Body: AdminCreateAccountRequestPayload
}>

export class AdminCreateAccountRequestPayload {
  email: string
  password: string

  static toAccount(p: AdminCreateAccountRequestPayload): Account {
    return new Account({
      email: p.email,
      password: p.password
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('email', S.string().required()).prop('password', S.string().required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'AdminCreateAccountRequest',
      tags: ['Admin > Accounts'],
      body: this.getFluentSchema()
    }
  }
}
