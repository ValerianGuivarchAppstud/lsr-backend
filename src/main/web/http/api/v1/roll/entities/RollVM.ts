import { Roll } from '../../../../../../domain/models/roll/Roll'
import { RollType } from '../../../../../../domain/models/roll/RollType'
import S, { ObjectSchema } from 'fluent-json-schema'

export class RollVM {
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
  characterToHelp?: string
  picture?: string
  resistRollList: RollVM[]
  result: number[]
  success: number | null

  private constructor(p: RollVM) {
    this.id = p.id
    this.rollerName = p.rollerName
    this.rollType = p.rollType
    this.date = p.date
    this.secret = p.secret
    this.focus = p.focus
    this.power = p.power
    this.proficiency = p.proficiency
    this.benediction = p.benediction
    this.malediction = p.malediction
    this.characterToHelp = p.characterToHelp
    this.resistRollList = p.resistRollList
    this.result = p.result
    this.success = p.success
    this.picture = p.picture
  }

  static from(p: { roll: Roll; rollList: Roll[] }): RollVM {
    const r = new RollVM({
      id: p.roll.id,
      rollerName: p.roll.rollerName,
      rollType: p.roll.rollType,
      date: p.roll.date,
      secret: p.roll.secret,
      focus: p.roll.focus,
      power: p.roll.power,
      proficiency: p.roll.proficiency,
      benediction: p.roll.benediction,
      malediction: p.roll.malediction,
      characterToHelp: p.roll.characterToHelp ?? undefined,
      picture: p.roll.picture,
      resistRollList:
        p.rollList
          .filter((resistRoll) => p.roll.id.toString() === resistRoll.resistRoll)
          .map((roll) => RollVM.from({ roll: roll, rollList: [] })) ?? [],
      result: p.roll.result,
      success: p.roll.success
    })
    return r
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('id', S.string().required())
      .prop('rollerName', S.string().required())
      .prop('rollType', S.string().required())
      .prop('secret', S.boolean().required())
      .prop('date', S.string().format(S.FORMATS.DATE_TIME).required())
      .prop('focus', S.boolean().required())
      .prop('power', S.boolean().required())
      .prop('proficiency', S.boolean().required())
      .prop('benediction', S.integer().required())
      .prop('malediction', S.integer().required())
      .prop('picture', S.string())
      .prop('characterToHelp', S.string())
      .prop('resistRollList')
      .prop('result', S.array().required())
      .prop('success', S.integer())
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: RollVM.name }
  }
}
