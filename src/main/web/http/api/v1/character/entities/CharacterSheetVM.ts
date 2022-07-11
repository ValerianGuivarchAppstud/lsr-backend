import { CharacterVM } from './CharacterVM'
import { Character } from '../../../../../../domain/models/character/Character'
import { Roll } from '../../../../../../domain/models/roll/Roll'
import { RollVM } from '../../roll/entities/RollVM'
import S, { ObjectSchema } from 'fluent-json-schema'

export class CharacterSheetVM {
  character: CharacterVM
  rollList: RollVM[]
  pjAlliesNames: string[]

  private constructor(p: CharacterSheetVM) {
    this.character = p.character
    this.rollList = p.rollList
    this.pjAlliesNames = p.pjAlliesNames
  }

  static from(p: { character: Character; rollList: Roll[]; pjAlliesNames: string[] }): CharacterSheetVM {
    return new CharacterSheetVM({
      character: CharacterVM.from({
        character: p.character
      }),
      rollList: p.rollList.map((roll) => RollVM.from({ roll: roll })),
      pjAlliesNames: p.pjAlliesNames
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('character', CharacterVM.getFluentSchema())
      .prop('rollList', S.array().items(RollVM.getFluentSchema()))
      .prop('pjAlliesNames', S.array().items(S.string()))
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: CharacterSheetVM.name }
  }
}
