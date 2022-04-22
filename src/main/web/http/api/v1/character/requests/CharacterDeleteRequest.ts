import { Character } from '../../../../../../domain/models/character/Character'
import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import { CharacterVM } from '../entities/CharacterVM'
import S, { ObjectSchema } from 'fluent-json-schema'

export type CharacterDeleteRequest = IHttpRequest<{
  Params: { id: string }
  Body: CharacterDeleteRequestPayload
}>

export class CharacterDeleteRequestPayload {
  name: string

  static toCharacter(): Partial<Character> {
    const res: Partial<Character> = { }
    return res
  }

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('name', S.string().required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'CharacterDeleteRequest',
      tags: ['Character'],
      body: this.getFluentSchema()
    }
  }
}
