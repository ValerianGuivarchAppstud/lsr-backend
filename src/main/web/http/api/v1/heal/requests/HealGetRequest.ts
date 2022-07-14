import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type HealGetRequest = IHttpRequest<{
  Querystring: HealGetRequestPayload
}>

export class HealGetRequestPayload {
  name: string

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('name', S.string().minLength(1).required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      ...this.getFluentSchema().valueOf(),
      description: 'HealGetRequest',
      tags: ['Heal']
    }
  }
}
