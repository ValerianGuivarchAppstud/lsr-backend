import { DBMj, DBMjModel } from './DBMj'
import { Mj } from '../../../domain/models/mj/Mj'
import { IMjProvider } from '../../../domain/providers/IMjProvider'
import { Utils } from '../../../utils/Utils'
import { ProviderErrors } from '../../errors/ProviderErrors'

export class DBMjProvider implements IMjProvider {
  private static toMj(doc: DBMj): Mj {
    return new Mj({
      characters: doc.characters
    })
  }

  private static fromMj(doc: Mj): DBMj {
    return {
      characters: doc.characters
    } as DBMj
  }

  async getMj(): Promise<Mj> {
    const mj = await DBMjModel.findOne().exec()
    if (!mj) {
      return DBMjProvider.toMj(await DBMjModel.create(DBMjProvider.fromMj(new Mj({ characters: [] }))))
    }
    return DBMjProvider.toMj(mj)
  }

  async addCharacter(characterName: string): Promise<boolean> {
    const mj = await DBMjModel.findOne().exec()
    if (!mj) {
      DBMjProvider.toMj(await DBMjModel.create(DBMjProvider.fromMj(new Mj({ characters: [characterName] }))))
      return true
    }
    if (!mj.characters.includes(characterName)) {
      mj.characters.push(characterName)
      const newMj = await DBMjModel.findOneAndUpdate({}, mj, { new: true }).exec()
      if (!newMj) {
        throw ProviderErrors.EntityNotFound('Mj')
      }
    }
    return true
  }

  async removeCharacter(characterName: string): Promise<boolean> {
    const mj = await DBMjModel.findOne().exec()
    if (!mj) {
      DBMjProvider.toMj(await DBMjModel.create(DBMjProvider.fromMj(new Mj({ characters: [] }))))
      return true
    }
    if (mj.characters.includes(characterName)) {
      mj.characters = Utils.removeElementFromArray(mj.characters, characterName) as string[]
      const newMj = await DBMjModel.findOneAndUpdate({}, mj, { new: true }).exec()
      if (!newMj) {
        throw ProviderErrors.EntityNotFound('Mj')
      }
    }
    return true
  }
}
