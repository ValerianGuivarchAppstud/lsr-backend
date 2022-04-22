import { RollVM } from './RollVM'
import { Roll } from '../../../../../../domain/models/roll/Roll'
import S, { ObjectSchema } from 'fluent-json-schema'

export class RollLastVM {
  rollList: RollVM[]

  private constructor(p: RollLastVM) {
    this.rollList = p.rollList
  }

  static from(p: { rollList: Roll[] }): RollLastVM {
    return new RollLastVM({
      rollList: p.rollList.map((roll) => RollVM.from({ roll: roll }))
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('rollList', S.array().items(RollVM.getFluentSchema()))
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: RollLastVM.name }
  }
}
