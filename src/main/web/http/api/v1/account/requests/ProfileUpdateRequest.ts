import { Account } from '../../../../../../domain/models/account/Account'
import { Profile } from '../../../../../../domain/models/account/Profile'
import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type ProfileUpdateRequest = IHttpRequest<{
  Params: { id: string }
  Body: ProfileUpdateRequestPayload
}>

export class ProfileUpdateRequestPayload {
  email: string

  static toProfile(): Partial<Profile> {
    const res: Partial<Profile> = {}
    return res
  }

  static toAccount(p: ProfileUpdateRequestPayload): Partial<Account> {
    const res: Partial<Account> = {
      email: p.email
    }
    return res
  }

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('email', S.string())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'ProfileUpdateRequest',
      tags: ['Account'],
      body: this.getFluentSchema()
    }
  }
}
