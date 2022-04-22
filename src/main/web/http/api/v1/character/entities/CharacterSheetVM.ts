import { CharacterVM } from './CharacterVM'
import { Character } from '../../../../../../domain/models/character/Character'
import { Roll } from '../../../../../../domain/models/roll/Roll'
import { RollVM } from '../../roll/entities/RollVM'
import S, { ObjectSchema } from 'fluent-json-schema'

export class CharacterSheetVM {
  character: Character
  rollList: RollVM[]

  private constructor(p: CharacterSheetVM) {
    this.character = p.character
    this.rollList = p.rollList
  }

  static from(p: { character: Character; rollList: Roll[] }): CharacterSheetVM {
    return new CharacterSheetVM({
      character: p.character,
      rollList: p.rollList.map((roll) => RollVM.from({ roll: roll }))
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('character', CharacterVM.getFluentSchema())
      .prop('rollList', S.array().items(RollVM.getFluentSchema()))
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: CharacterSheetVM.name }
  }
}
