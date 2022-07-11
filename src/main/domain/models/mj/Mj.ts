export class Mj {
  characters: string[]
  pjNames: string[]
  pnjNames: string[]
  tempoNames: string[]
  playersName: string[]

  constructor(p: { characters: string[] }) {
    this.characters = p.characters ?? []
  }
}
