import { Character } from '../../../../../../domain/models/character/Character'
import { Roll } from '../../../../../../domain/models/roll/Roll'
import { CharacterVM } from '../../character/entities/CharacterVM'
import { RollVM } from '../../roll/entities/RollVM'
import S, { ObjectSchema } from 'fluent-json-schema'

export class HealSheetVM {
  character: CharacterVM
  rollList: RollVM[]
  pjAllies: CharacterVM[]

  private constructor(p: HealSheetVM) {
    this.character = p.character
    this.rollList = p.rollList
    this.pjAllies = p.pjAllies
  }

  static from(p: { character: Character; rollList: Roll[]; pjAllies: Character[]; relance: number }): HealSheetVM {
    return new HealSheetVM({
      character: CharacterVM.from({
        character: p.character,
        relance: p.relance,
        help: 0,
        alliesName: []
      }),
      rollList: p.rollList
        .filter((roll) => roll.resistRoll === '')
        .map((roll) => RollVM.from({ roll: roll, rollList: p.rollList })),
      pjAllies: p.pjAllies.map((character) =>
        CharacterVM.from({ character: character, relance: 0, help: 0, alliesName: [] })
      )
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('character', CharacterVM.getFluentSchema())
      .prop('rollList', S.array().items(RollVM.getFluentSchema()))
      .prop('pjAllies', S.array().items(CharacterVM.getFluentSchema()))
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: HealSheetVM.name }
  }
}
