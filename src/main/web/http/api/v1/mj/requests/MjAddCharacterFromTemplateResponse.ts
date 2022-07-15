import { CharacterVM } from '../../character/entities/CharacterVM'
import S, { ObjectSchema } from 'fluent-json-schema'

export class MjAddCharacterFromTemplateResponse {
  templateNewCharacters: CharacterVM[]

  constructor(p: MjAddCharacterFromTemplateResponse) {
    this.templateNewCharacters = p.templateNewCharacters
  }

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('templateNewCharacters', S.array().items(CharacterVM.getFluentSchema()))
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: MjAddCharacterFromTemplateResponse.name }
  }
}
