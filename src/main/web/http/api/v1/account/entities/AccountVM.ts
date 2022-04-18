import { ProfileVM } from './ProfileVM'
import { ValidationHelper } from '../../../../../../domain/helpers/ValidationHelpers'
import { Account } from '../../../../../../domain/models/account/Account'
import { Profile } from '../../../../../../domain/models/account/Profile'
import S, { ObjectSchema } from 'fluent-json-schema'

export class AccountVM {
  id: string
  email: string
  profile: ProfileVM
  createdDate: Date
  updatedDate: Date

  constructor(p: AccountVM) {
    this.id = p.id
    this.email = p.email
    this.profile = p.profile
    this.createdDate = p.createdDate
    this.updatedDate = p.updatedDate
  }

  static of(p: { account: Account; profile: Profile }): AccountVM {
    return new AccountVM({
      id: p.account.id,
      email: p.account.email,
      profile: ProfileVM.from({ profile: p.profile }),
      createdDate: p.account.createdDate,
      updatedDate: new Date()
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('id', S.string().pattern(ValidationHelper.REGEX_BSON_ID).required())
      .prop('email', S.string().format(S.FORMATS.EMAIL).required())
      .prop('profile', ProfileVM.getFluentSchema())
      .prop('createdDate', S.string().format(S.FORMATS.DATE_TIME).required())
      .prop('updatedDate', S.string().format(S.FORMATS.DATE_TIME).required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema().valueOf(), description: AccountVM.name }
  }
}
