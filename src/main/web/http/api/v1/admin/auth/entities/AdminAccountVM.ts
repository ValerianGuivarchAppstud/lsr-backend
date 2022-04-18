import { ValidationHelper } from '../../../../../../../domain/helpers/ValidationHelpers'
import { Account } from '../../../../../../../domain/models/account/Account'
import S, { ObjectSchema } from 'fluent-json-schema'

export class AdminAccountVM {
  id: string
  email: string
  createdDate: Date
  updatedDate: Date

  static of(account: Account): AdminAccountVM {
    return {
      id: account.id,
      email: account.email,
      createdDate: account.createdDate,
      updatedDate: new Date()
    }
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('id', S.string().pattern(ValidationHelper.REGEX_BSON_ID).required())
      .prop('email', S.string().format(S.FORMATS.EMAIL).required())
      .prop('createdDate', S.string().format(S.FORMATS.DATE_TIME).required())
      .prop('updatedDate', S.string().format(S.FORMATS.DATE_TIME).required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema().valueOf(), description: AdminAccountVM.name }
  }
}
