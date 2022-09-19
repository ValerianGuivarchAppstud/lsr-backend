export class Player {
  playerName: string
  relance: number

  constructor(p: { relance: number; playerName: string }) {
    this.relance = p.relance ?? 0
    this.playerName = p.playerName
  }
}
