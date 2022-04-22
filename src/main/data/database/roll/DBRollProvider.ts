import { DBRoll, DBRollModel } from './DBRoll'
import { Roll } from '../../../domain/models/roll/Roll'
import { RollType } from '../../../domain/models/roll/RollType'
import { IRollProvider } from '../../../domain/providers/IRollProvider'

export class DBRollProvider implements IRollProvider {
  private static toRoll(doc: DBRoll): Roll {
    return new Roll({
      id: doc._id,
      rollerName: doc.rollerName,
      rollType: RollType[doc.rollType],
      date: doc.date,
      secret: doc.secret,
      focus: doc.focus,
      power: doc.power,
      proficiency: doc.proficiency,
      benediction: doc.benediction,
      malediction: doc.malediction,
      result: doc.result,
      success: doc.success
    })
  }

  private static fromRoll(doc: Roll): DBRoll {
    return {
      rollerName: doc.rollerName,
      rollType: doc.rollType.toString(),
      date: doc.date,
      secret: doc.secret,
      focus: doc.focus,
      power: doc.power,
      proficiency: doc.proficiency,
      benediction: doc.benediction,
      malediction: doc.malediction,
      result: doc.result,
      success: doc.success
    } as DBRoll
  }

  // TODO job to remove olds roll ?
  async add(roll: Roll): Promise<Roll> {
    return DBRollProvider.toRoll(await DBRollModel.create(DBRollProvider.fromRoll(roll)))
  }

  async getLast(size: number): Promise<Roll[]> {
    const rollList = await DBRollModel.find().exec()
    return rollList
      .sort((r1, r2) => r1.date.getTime() - r2.date.getTime())
      .slice(rollList.length - size, rollList.length)
      .map((roll) => DBRollProvider.toRoll(roll))
  }
}
