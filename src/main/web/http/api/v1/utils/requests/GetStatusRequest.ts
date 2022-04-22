import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'
import {Account} from "../../../../../../domain/models/account/Account";


export type GetStatusRequest = IHttpRequest<{
  Querystring: GetStatusRequestParams
}>

export class GetStatusRequestParams {
  managementSecret?: string
  accountId: string

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('managementSecret', S.string())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'GetStatusRequest',
      tags: ['Status'],
      query: this.getFluentSchema()
    }
  }
}
