import { Bloodline } from '../../../../../../domain/models/character/Bloodline'
import { Category } from '../../../../../../domain/models/character/Category'
import { Character } from '../../../../../../domain/models/character/Character'
import { Classe } from '../../../../../../domain/models/character/Classe'
import { Genre } from '../../../../../../domain/models/character/Genre'
import S, { ObjectSchema } from 'fluent-json-schema'

export class CharacterVM {
  name: string
  classe: Classe
  bloodline: Bloodline
  chair: number
  esprit: number
  essence: number
  pv: number
  pvMax: number
  pf: number
  pfMax: number
  pp: number
  ppMax: number
  dettes: number
  arcanes: number
  arcanesMax: number
  niveau: number
  lux: string
  umbra: string
  secunda: string
  notes: string
  category: Category
  genre: Genre
  relance: number
  playerName?: string
  picture?: string
  background?: string

  private constructor(p: CharacterVM) {
    this.name = p.name
    this.classe = p.classe
    this.bloodline = p.bloodline
    this.chair = p.chair
    this.esprit = p.esprit
    this.essence = p.essence
    this.pv = p.pv
    this.pvMax = p.pvMax
    this.pf = p.pf
    this.pfMax = p.pfMax
    this.pp = p.pp
    this.ppMax = p.ppMax
    this.dettes = p.dettes
    this.arcanes = p.arcanes
    this.arcanesMax = p.arcanesMax
    this.niveau = p.niveau
    this.lux = p.lux
    this.umbra = p.umbra
    this.secunda = p.secunda
    this.notes = p.notes
    this.category = p.category
    this.genre = p.genre
    this.relance = p.relance
    this.playerName = p.playerName
    this.picture = p.picture
    this.background = p.background
  }

  static from(p: { character: Character }): CharacterVM {
    return new CharacterVM({
      name: p.character.name,
      classe: p.character.classe,
      bloodline: p.character.bloodline,
      chair: p.character.chair,
      esprit: p.character.esprit,
      essence: p.character.essence,
      pv: p.character.pv,
      pvMax: p.character.pvMax,
      pf: p.character.pf,
      pfMax: p.character.pfMax,
      pp: p.character.pp,
      ppMax: p.character.ppMax,
      dettes: p.character.dettes,
      arcanes: p.character.arcanes,
      arcanesMax: p.character.arcanesMax,
      niveau: p.character.niveau,
      lux: p.character.lux,
      umbra: p.character.umbra,
      secunda: p.character.secunda,
      notes: p.character.notes,
      category: p.character.category,
      genre: p.character.genre,
      relance: p.character.relance,
      playerName: p.character.playerName,
      picture: p.character.picture,
      background: p.character.background
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('name', S.string().required())
      .prop('classe', S.string().required())
      .prop('bloodline', S.string().required())
      .prop('chair', S.integer().required())
      .prop('esprit', S.integer().required())
      .prop('essence', S.integer().required())
      .prop('pv', S.integer().required())
      .prop('pvMax', S.integer().required())
      .prop('pf', S.integer().required())
      .prop('pfMax', S.integer().required())
      .prop('pp', S.integer().required())
      .prop('ppMax', S.integer().required())
      .prop('dettes', S.integer().required())
      .prop('arcanes', S.integer().required())
      .prop('arcanesMax', S.integer().required())
      .prop('niveau', S.integer().required())
      .prop('lux', S.string().required())
      .prop('umbra', S.string().required())
      .prop('secunda', S.string().required())
      .prop('notes', S.string().required())
      .prop('category', S.string().required())
      .prop('genre', S.string().required())
      .prop('relance', S.integer().required())
      .prop('playerName', S.string())
      .prop('picture', S.string())
      .prop('background', S.string())
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: CharacterVM.name }
  }
}
