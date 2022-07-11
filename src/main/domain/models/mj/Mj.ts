export class Session {
  characters: string[]

  constructor(p: { characters: string[] }) {
    this.characters = p.characters ?? []
  }
}
