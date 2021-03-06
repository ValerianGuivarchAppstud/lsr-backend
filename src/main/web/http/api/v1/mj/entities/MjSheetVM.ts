import { Character } from '../../../../../../domain/models/character/Character'
import { Session } from '../../../../../../domain/models/mj/Mj'
import { Roll } from '../../../../../../domain/models/roll/Roll'
import { CharacterVM } from '../../character/entities/CharacterVM'
import { RollVM } from '../../roll/entities/RollVM'
import S, { ObjectSchema } from 'fluent-json-schema'

export class MjSheetVM {
  characters: CharacterVM[]
  pjNames: string[]
  pnjNames: string[]
  tempoNames: string[]
  templateNames: string[]
  playersName: string[]
  rollList: RollVM[]

  private constructor(p: MjSheetVM) {
    this.characters = p.characters
    this.pjNames = p.pjNames
    this.pnjNames = p.pnjNames
    this.tempoNames = p.tempoNames
    this.templateNames = p.templateNames
    this.playersName = p.playersName
    this.rollList = p.rollList
  }

  static from(p: {
    mj: Session
    characters: Character[]
    pjNames: string[]
    pnjNames: string[]
    tempoNames: string[]
    templateNames: string[]
    playersName: string[]
    rollList: Roll[]
  }): MjSheetVM {
    return new MjSheetVM({
      characters: p.characters.map((character) => CharacterVM.from({ character: character })),
      pjNames: p.pjNames,
      pnjNames: p.pnjNames,
      tempoNames: p.tempoNames,
      templateNames: p.templateNames,
      playersName: p.playersName,
      rollList: p.rollList
        .filter((roll) => roll.resistRoll === '')
        .map((roll) => RollVM.from({ roll: roll, rollList: p.rollList }))
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('characters', S.array().items(CharacterVM.getFluentSchema()))
      .prop('pjNames', S.array().items(S.string()))
      .prop('pnjNames', S.array().items(S.string()))
      .prop('tempoNames', S.array().items(S.string()))
      .prop('templateNames', S.array().items(S.string()))
      .prop('playersName', S.array().items(S.string()))
      .prop('rollList', S.array().items(RollVM.getFluentSchema()))
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: MjSheetVM.name }
  }
}
