import { Round } from './Round'

export class Session {
  characters: string[]
  visioToken: string
  relanceMj: number
  charactersBattleAllies: string[]
  charactersBattleEnnemies: string[]
  round: Round

  constructor(p: {
    characters: string[]
    visioToken: string
    charactersBattleAllies: string[]
    charactersBattleEnnemies: string[]
    round: Round
    relanceMj: number
  }) {
    this.characters = p.characters ?? []
    this.visioToken = p.visioToken ?? ''
    this.charactersBattleAllies = p.charactersBattleAllies ?? []
    this.charactersBattleEnnemies = p.charactersBattleEnnemies ?? []
    this.round = p.round ?? Round.NONE
    this.relanceMj = p.relanceMj ?? 0
  }
}
