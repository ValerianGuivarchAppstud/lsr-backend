import { DBRoll, DBRollModel } from './DBRoll'
import { Character } from '../../../domain/models/character/Character'
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
      success: doc.success,
      characterToHelp: doc.characterToHelp,
      picture: doc.picture,
      resistRoll: doc.resistRoll,
      helpUsed: doc.helpUsed
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
      success: doc.success,
      helpUsed: doc.helpUsed,
      characterToHelp: doc.characterToHelp,
      picture: doc.picture,
      resistRoll: doc.resistRoll
    } as DBRoll
  }

  // TODO job to remove olds roll ?
  async add(roll: Roll): Promise<Roll> {
    return DBRollProvider.toRoll(await DBRollModel.create(DBRollProvider.fromRoll(roll)))
  }

  // TODO job to remove olds roll ?
  async update(roll: Roll): Promise<Roll> {
    return DBRollProvider.toRoll(await DBRollModel.replaceOne({ _id: roll.id }, DBRollProvider.fromRoll(roll)))
  }

  async getLast(size: number): Promise<Roll[]> {
    const rollList = await DBRollModel.find().exec()
    return (
      rollList
        .sort((r1, r2) => r2.date.getTime() - r1.date.getTime())
        //.slice(rollList.length - size, rollList.length)
        .slice(0, size)
        .map((roll) => DBRollProvider.toRoll(roll))
    )
  }

  async getLastForCharacter(character: Character): Promise<Roll | undefined> {
    const rollList = await DBRollModel.find().exec()
    return rollList
      .sort((r1, r2) => r2.date.getTime() - r1.date.getTime())
      .map((roll) => DBRollProvider.toRoll(roll))
      .filter(
        (roll) =>
          roll.rollerName === character.name &&
          (roll.rollType === RollType.CHAIR ||
            roll.rollType === RollType.ESPRIT ||
            roll.rollType === RollType.ESSENCE ||
            roll.rollType === RollType.ARCANE_ESPRIT ||
            roll.rollType === RollType.ARCANE_ESSENCE ||
            roll.rollType === RollType.MAGIE_LEGERE ||
            roll.rollType === RollType.MAGIE_FORTE ||
            roll.rollType === RollType.SOIN)
      )[0]
  }

  async helpUsed(rollList: Roll[]): Promise<boolean> {
    for (const roll of rollList) {
      roll.helpUsed = true
      await this.update(roll)
    }
    return true
  }
  async availableHelp(characterName: string): Promise<Roll[]> {
    return (await DBRollModel.find({ helpUsed: false, characterToHelp: characterName }).exec()).map((roll) =>
      DBRollProvider.toRoll(roll)
    )
  }
}
