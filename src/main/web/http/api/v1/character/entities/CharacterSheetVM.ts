import { CharacterVM } from './CharacterVM'
import { Character } from '../../../../../../domain/models/character/Character'
import { Roll } from '../../../../../../domain/models/roll/Roll'
import { RollVM } from '../../roll/entities/RollVM'
import S, { ObjectSchema } from 'fluent-json-schema'

export class CharacterSheetVM {
  character: CharacterVM
  rollList: RollVM[]
  pjAlliesNames: string[]
  playersName: string[]

  private constructor(p: CharacterSheetVM) {
    this.character = p.character
    this.rollList = p.rollList
    this.pjAlliesNames = p.pjAlliesNames
    this.playersName = p.playersName
  }

  static from(p: {
    character: Character
    rollList: Roll[]
    pjAlliesNames: string[]
    playersName: string[]
    relance: number
  }): CharacterSheetVM {
    const t2 = p.rollList
      .filter((roll) => roll.resistRoll === '')
      .map((roll) => RollVM.from({ roll: roll, rollList: p.rollList }))
    return new CharacterSheetVM({
      character: CharacterVM.from({
        character: p.character,
        relance: p.relance
      }),
      rollList: t2,
      pjAlliesNames: p.pjAlliesNames,
      playersName: p.playersName
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('character', CharacterVM.getFluentSchema())
      .prop('rollList', S.array().items(RollVM.getFluentSchema()))
      .prop('pjAlliesNames', S.array().items(S.string()))
      .prop('playersName', S.array().items(S.string()))
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: CharacterSheetVM.name }
  }
}
