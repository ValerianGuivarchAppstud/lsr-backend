import { Character } from '../../../../../../domain/models/character/Character'
import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'
import {CharacterVM} from "../entities/CharacterVM";

export type CharacterCreateRequest = IHttpRequest<{
  Body: CharacterCreateRequestPayload
}>

export class CharacterCreateRequestPayload {
  character: CharacterVM

  static toCharacter(): Partial<Character> {
    const res: Partial<Character> = {}
    return res
  }

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('character', CharacterVM.getFluentSchema())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'CharacterCreateRequest',
      tags: ['Character'],
      body: this.getFluentSchema()
    }
  }
}
