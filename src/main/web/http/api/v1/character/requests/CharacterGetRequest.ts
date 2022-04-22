import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type CharacterGetRequest = IHttpRequest<{
  Querystring: CharacterGetRequestPayload
}>

export class CharacterGetRequestPayload {
  name: string

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('name', S.string().minLength(1).required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      ...this.getFluentSchema().valueOf(),
      description: 'CharacterGetRequest',
      tags: ['Character']
    }
  }
}
