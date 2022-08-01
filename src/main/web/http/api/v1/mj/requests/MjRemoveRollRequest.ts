import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type MjRemoveRollRequest = IHttpRequest<{
  Querystring: MjRemoveRollRequestPayload
}>

export class MjRemoveRollRequestPayload {
  id: string

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('id', S.string().required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      ...this.getFluentSchema().valueOf(),
      description: 'MjRemoveRollRequest',
      tags: ['Mj']
    }
  }
}
