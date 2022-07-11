import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type CharacterGetSettingsRequest = IHttpRequest<{
  Querystring: CharacterGetSettingsRequestPayload
}>

export class CharacterGetSettingsRequestPayload {
  playerName?: string

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('playerName', S.string().minLength(1))
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      ...this.getFluentSchema().valueOf(),
      description: 'CharacterGetSettingsRequest',
      tags: ['Character']
    }
  }
}
