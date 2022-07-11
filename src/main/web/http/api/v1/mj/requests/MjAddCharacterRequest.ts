import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type MjAddCharacterRequest = IHttpRequest<{
  Querystring: MjAddCharacterRequestPayload
}>

export class MjAddCharacterRequestPayload {
  characterName: string

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('characterName', S.string().required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      ...this.getFluentSchema().valueOf(),
      description: 'MjAddCharacterRequest',
      tags: ['Mj']
    }
  }
}
