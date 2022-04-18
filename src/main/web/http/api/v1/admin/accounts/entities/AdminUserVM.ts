import { ValidationHelper } from '../../../../../../../domain/helpers/ValidationHelpers'
import { Account } from '../../../../../../../domain/models/account/Account'
import { Authority } from '../../../../../../../domain/models/auth/Authority'
import S, { ObjectSchema } from 'fluent-json-schema'

export class AdminUserVM {
  id: string
  email: string
  authority: Authority
  createdDate: Date
  updatedDate: Date

  constructor(p: AdminUserVM) {
    this.id = p.id
    this.email = p.email
    this.authority = p.authority
    this.createdDate = p.createdDate
    this.updatedDate = p.updatedDate
  }

  static from(account: Account): AdminUserVM {
    return new AdminUserVM({
      id: account.id,
      email: account.email,
      authority: account.authority,
      createdDate: account.createdDate,
      updatedDate: account.updatedDate
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('id', S.string().pattern(ValidationHelper.REGEX_BSON_ID).required())
      .prop('email', S.string().pattern(ValidationHelper.NON_EMPTY_STRING).required())
      .prop('authority', S.string())
      .prop('createdDate', S.string().format(S.FORMATS.DATE_TIME).required())
      .prop('updatedDate', S.string().format(S.FORMATS.DATE_TIME).required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema().valueOf(), description: AdminUserVM.name }
  }
}
