import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type UidPutRequest = IHttpRequest<{
  Querystring: UidPutRequestPayload
}>

export class UidPutRequestPayload {
  characterName: string
  uid: number

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('characterName', S.string()).prop('uid', S.number())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      ...this.getFluentSchema().valueOf(),
      description: 'UidPutRequest',
      tags: ['Visio']
    }
  }
}
