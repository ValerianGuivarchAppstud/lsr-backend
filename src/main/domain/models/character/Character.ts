import { Apotheose } from './Apotheose'
import { Bloodline } from './Bloodline'
import { Category } from './Category'
import { Classe } from './Classe'
import { Genre } from './Genre'

export class Character {
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
  apotheose: Apotheose
  apotheoseImprovement?: string
  apotheoseImprovementList: string[]
  genre: Genre
  relance: number
  playerName?: string
  picture?: string
  pictureApotheose?: string
  background?: string
  buttonColor?: string
  textColor?: string
  uid?: number

  constructor(p: {
    pp: number
    arcanesMax: number
    classe: string
    bloodline: string
    notes: string
    dettes: number
    chair: number
    essence: number
    pv: number
    arcanes: number
    niveau: number
    lux: string
    pf: number
    pfMax: number
    secunda: string
    name: string
    esprit: number
    ppMax: number
    umbra: string
    category: string
    apotheose: string
    apotheoseImprovement?: string
    apotheoseImprovementList: string[]
    pvMax: number
    genre: string
    relance: number
    playerName?: string
    picture?: string
    pictureApotheose?: string
    background?: string
    buttonColor?: string
    textColor?: string
    uid?: number
  }) {
    this.name = p.name ?? ''
    this.classe = Classe[p.classe] ?? Classe.CHAMPION
    this.bloodline = Bloodline[p.bloodline] ?? Bloodline.AUCUN
    this.apotheose = Apotheose[p.apotheose] ?? Apotheose.NONE
    this.apotheoseImprovement = p.apotheoseImprovement
    this.apotheoseImprovementList = p.apotheoseImprovementList ?? []
    this.chair = p.chair ?? 0
    this.esprit = p.esprit ?? 0
    this.essence = p.essence ?? 0
    this.pv = p.pv ?? 0
    this.pvMax = p.pvMax ?? 0
    this.pf = p.pf ?? 0
    this.pfMax = p.pfMax ?? 0
    this.pp = p.pp ?? 0
    this.ppMax = p.ppMax ?? 0
    this.dettes = p.dettes ?? 0
    this.arcanes = p.arcanes ?? 0
    this.arcanesMax = p.arcanesMax ?? 0
    this.niveau = p.niveau ?? 1
    this.lux = p.lux ?? ''
    this.umbra = p.umbra ?? ''
    this.secunda = p.secunda ?? ''
    this.notes = p.notes ?? ''
    this.category = Category[p.category] ?? Category.TEMPO
    this.genre = Genre[p.genre] ?? Genre.AUTRE
    this.relance = p.relance ?? 0
    this.playerName = p.playerName
    this.picture = p.picture
    this.pictureApotheose = p.pictureApotheose
    this.background = p.background
    this.buttonColor = p.buttonColor
    this.textColor = p.textColor
    this.uid = p.uid
  }
}
