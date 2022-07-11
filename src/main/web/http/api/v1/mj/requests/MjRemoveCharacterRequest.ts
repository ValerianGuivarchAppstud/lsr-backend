import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type MjRemoveCharacterRequest = IHttpRequest<{
  Querystring: MjRemoveCharacterRequestPayload
}>

export class MjRemoveCharacterRequestPayload {
  characterName: string

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('characterName', S.string().required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      ...this.getFluentSchema().valueOf(),
      description: 'MjRemoveCharacterRequest',
      tags: ['Mj']
    }
  }
}
