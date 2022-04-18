import { Account } from '../../../../../../../domain/models/account/Account'
import { IHttpRequest } from '../../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type AdminUpdateAccountRequest = IHttpRequest<{
  Params: { id: string }
  Body: AdminUpdateAccountRequestPayload
}>

export class AdminUpdateAccountRequestPayload {
  email: string

  static toAccount(p: AdminUpdateAccountRequestPayload): Partial<Account> {
    const res: Partial<Account> = {
      email: p.email
    }
    return res
  }

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('email', S.string().required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'AdminUpdateAccountRequest',
      tags: ['Admin > Accounts'],
      body: this.getFluentSchema()
    }
  }
}
