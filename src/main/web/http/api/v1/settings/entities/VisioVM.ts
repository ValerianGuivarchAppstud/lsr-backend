import { Character } from '../../../../../../domain/models/character/Character'
import { CharacterVM } from '../../character/entities/CharacterVM'
import S, { ObjectSchema } from 'fluent-json-schema'

export class VisioVM {
  characters?: CharacterVM[]

  private constructor(p: VisioVM) {
    this.characters = p.characters
  }

  static from(p: { characters: Character[] }): VisioVM {
    return new VisioVM({
      characters: p.characters.map((character) =>
        CharacterVM.from({ character: character, relance: character.relance, help: 0, alliesName: [] })
      )
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('characters', S.array().items(CharacterVM.getFluentSchema()))
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: VisioVM.name }
  }
}
