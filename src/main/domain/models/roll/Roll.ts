import { RollType } from './RollType'

export class Roll {
  id: string
  rollerName: string
  rollType: RollType
  date: Date
  secret: boolean
  focus: boolean
  power: boolean
  proficiency: boolean
  benediction: number
  malediction: number
  result: number[]
  success: number | null
  characterToHelp?: string
  resistRoll?: string
  picture?: string
  data?: string
  empirique?: string
  apotheose?: string
  helpUsed: boolean | null

  constructor(p: {
    id?: string
    rollerName: string
    rollType: RollType
    date: Date
    secret: boolean
    focus: boolean
    power: boolean
    proficiency: boolean
    benediction: number
    malediction: number
    result: number[]
    success: number | null
    characterToHelp?: string
    resistRoll?: string
    picture?: string
    data?: string
    empirique?: string
    apotheose?: string
    helpUsed: boolean | null
  }) {
    this.id = p.id ?? 'no_id'
    this.rollerName = p.rollerName
    this.rollType = p.rollType ?? RollType.EMPIRIQUE
    this.date = p.date ?? Date()
    this.secret = p.secret ?? false
    this.focus = p.focus ?? false
    this.power = p.power ?? false
    this.proficiency = p.proficiency ?? false
    this.benediction = p.benediction ?? 0
    this.malediction = p.malediction ?? 0
    this.result = p.result ?? []
    this.success = p.success ?? null
    this.characterToHelp = p.characterToHelp
    this.helpUsed = p.helpUsed
    this.picture = p.picture
    this.data = p.data
    this.empirique = p.empirique
    this.apotheose = p.apotheose
    this.resistRoll = p.resistRoll
  }
}
