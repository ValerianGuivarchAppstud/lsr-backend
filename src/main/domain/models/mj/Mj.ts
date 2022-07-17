export class Session {
  characters: string[]
  visioToken: string

  constructor(p: { characters: string[]; visioToken: string }) {
    this.characters = p.characters ?? []
    this.visioToken = p.visioToken ?? ''
  }
}
