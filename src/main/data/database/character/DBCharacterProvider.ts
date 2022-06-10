import { DBCharacter, DBCharacterModel } from './DBCharacter'
import { Bloodline } from '../../../domain/models/character/Bloodline'
import { Character } from '../../../domain/models/character/Character'
import { Classe } from '../../../domain/models/character/Classe'
import { ICharacterProvider } from '../../../domain/providers/ICharacterProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'

export class DBCharacterProvider implements ICharacterProvider {
  private static toCharacter(doc: DBCharacter): Character {
    return new Character({
      name: doc.name,
      classe: Classe[doc.classe],
      bloodline: Bloodline[doc.bloodline],
      chair: doc.chair,
      esprit: doc.esprit,
      essence: doc.essence,
      pv: doc.pv,
      pvMax: doc.pvMax,
      pf: doc.pf,
      pfMax: doc.pfMax,
      pp: doc.pp,
      ppMax: doc.ppMax,
      dettes: doc.dettes,
      arcanes: doc.arcanes,
      arcanesMax: doc.arcanesMax,
      niveau: doc.niveau,
      lux: doc.lux,
      umbra: doc.umbra,
      secunda: doc.secunda,
      notes: doc.notes,
      category: doc.category,
      genreMasculin: doc.genreMasculin
    })
  }

  private static fromCharacter(doc: Character): DBCharacter {
    return {
      name: doc.name,
      classe: doc.classe.toString(),
      bloodline: doc.bloodline.toString(),
      chair: doc.chair,
      esprit: doc.esprit,
      essence: doc.essence,
      pv: doc.pv,
      pvMax: doc.pvMax,
      pf: doc.pf,
      pfMax: doc.pfMax,
      pp: doc.pp,
      ppMax: doc.ppMax,
      dettes: doc.dettes,
      arcanes: doc.arcanes,
      arcanesMax: doc.arcanesMax,
      niveau: doc.niveau,
      lux: doc.lux,
      umbra: doc.umbra,
      secunda: doc.secunda,
      notes: doc.notes,
      category: doc.category,
      genreMasculin: doc.genreMasculin
    } as DBCharacter
  }

  async createOrUpdate(newCharacter: Character): Promise<Character> {
    const character = await DBCharacterModel.findOne({ name: newCharacter.name }).exec()
    if (!character) {
      return DBCharacterProvider.toCharacter(
        await DBCharacterModel.create(DBCharacterProvider.fromCharacter(newCharacter))
      )
    } else {
      return this.update(newCharacter)
    }
  }

  async findByName(name: string): Promise<Character> {
    const character = await DBCharacterModel.findOne({ name: name }).exec()
    if (!character) {
      throw ProviderErrors.EntityNotFound(Character.name)
    }
    return DBCharacterProvider.toCharacter(character)
  }

  async update(character: Character): Promise<Character> {
    const newCharacter = await DBCharacterModel.findOneAndUpdate(
      { name: character.name },
      DBCharacterProvider.fromCharacter(character),
      {
        new: true
      }
    ).exec()
    if (!newCharacter) {
      throw ProviderErrors.EntityNotFound(character.name)
    }
    return DBCharacterProvider.toCharacter(newCharacter)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async delete(name: string) {
    const character = await DBCharacterModel.findOneAndDelete({ name: name }).exec()
    if (!character) {
      throw ProviderErrors.EntityNotFound(name)
    }
  }

  countAll(): Promise<number> {
    return DBCharacterModel.count().exec()
  }
}
