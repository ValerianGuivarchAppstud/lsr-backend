import { Round } from './Round'

export class Session {
  characters: string[]
  visioToken: string
  relanceMj: number
  chaos: number
  charactersBattleAllies: string[]
  charactersBattleEnnemies: string[]
  charactersBoost: string[]
  round: Round

  constructor(p: {
    characters: string[]
    visioToken: string
    charactersBattleAllies: string[]
    charactersBattleEnnemies: string[]
    charactersBoost: string[]
    round: Round
    relanceMj: number
    chaos: number
  }) {
    this.characters = p.characters ?? []
    this.visioToken = p.visioToken ?? ''
    this.charactersBattleAllies = p.charactersBattleAllies ?? []
    this.charactersBattleEnnemies = p.charactersBattleEnnemies ?? []
    this.charactersBoost = p.charactersBoost ?? []
    this.round = p.round ?? Round.NONE
    this.relanceMj = p.relanceMj ?? 0
    this.chaos = p.chaos ?? 0
  }
}
