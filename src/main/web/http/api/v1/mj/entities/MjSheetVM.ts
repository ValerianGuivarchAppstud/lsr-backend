import { Category } from '../../../../../../domain/models/character/Category'
import { Character } from '../../../../../../domain/models/character/Character'
import { Roll } from '../../../../../../domain/models/roll/Roll'
import { Round } from '../../../../../../domain/models/session/Round'
import { Session } from '../../../../../../domain/models/session/Session'
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
  charactersBattleAllies: string[]
  charactersBattleEnnemies: string[]
  relanceMj: number
  round: Round

  private constructor(p: MjSheetVM) {
    this.characters = p.characters
    this.pjNames = p.pjNames
    this.pnjNames = p.pnjNames
    this.tempoNames = p.tempoNames
    this.templateNames = p.templateNames
    this.playersName = p.playersName
    this.rollList = p.rollList
    this.charactersBattleAllies = p.charactersBattleAllies
    this.charactersBattleEnnemies = p.charactersBattleEnnemies
    this.relanceMj = p.relanceMj
    this.round = p.round
  }

  static from(p: {
    session: Session
    characters: Character[]
    pjNames: string[]
    pnjNames: string[]
    tempoNames: string[]
    templateNames: string[]
    playersName: string[]
    rollList: Roll[]
    charactersBattleAllies: string[]
    charactersBattleEnnemies: string[]
    relanceMj: number
    round: Round
  }): MjSheetVM {
    return new MjSheetVM({
      characters: p.characters.map((character) => {
        let relance = character.relance
        if (character.category != Category.PJ) {
          relance = p.relanceMj
        }
        return CharacterVM.from({
          character: character,
          relance: relance,
          help: 0,
          alliesName: p.characters.map((c) => c.name)
        })
      }),
      pjNames: p.pjNames,
      pnjNames: p.pnjNames,
      tempoNames: p.tempoNames,
      templateNames: p.templateNames,
      playersName: p.playersName,
      rollList: p.rollList
        .filter((roll) => roll.resistRoll === '')
        .map((roll) => RollVM.from({ roll: roll, rollList: p.rollList })),
      charactersBattleAllies: p.charactersBattleAllies,
      charactersBattleEnnemies: p.charactersBattleEnnemies,
      relanceMj: p.relanceMj,
      round: p.round
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
      .prop('charactersBatlleAllies', S.array().items(S.string()))
      .prop('charactersBatlleEnnemies', S.array().items(S.string()))
      .prop('round', S.string().required())
      .prop('relanceMj', S.integer().required())
      .prop('rollList', S.array().items(RollVM.getFluentSchema()))
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: MjSheetVM.name }
  }
}
