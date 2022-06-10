import { IHttpRequest } from '../../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type AdminEnumRequest = IHttpRequest<{
  Querystring: AdminEnumRequestPayload
}>

export class AdminEnumRequestPayload {
  enum: string

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('enum', S.string().minLength(1).required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'AdminEnumRequest',
      tags: ['Admin > Auth'],
      body: this.getFluentSchema()
    }
  }
}
