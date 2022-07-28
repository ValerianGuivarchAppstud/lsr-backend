import { DBCharacter, DBCharacterModel } from './DBCharacter'
import { Apotheose } from '../../../domain/models/character/Apotheose'
import { Bloodline } from '../../../domain/models/character/Bloodline'
import { Category } from '../../../domain/models/character/Category'
import { Character } from '../../../domain/models/character/Character'
import { Classe } from '../../../domain/models/character/Classe'
import { Genre } from '../../../domain/models/character/Genre'
import { ICharacterProvider } from '../../../domain/providers/ICharacterProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'

export class DBCharacterProvider implements ICharacterProvider {
  private static toCharacter(doc: DBCharacter): Character {
    return new Character({
      name: doc.name,
      classe: Classe[doc.classe],
      bloodline: Bloodline[doc.bloodline],
      apotheose: Apotheose[doc.apotheose],
      apotheoseImprovement: doc.apotheoseImprovement,
      apotheoseImprovementList: doc.apotheoseImprovementList,
      uid: doc.uid,
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
      category: Category[doc.category],
      genre: Genre[doc.genre],
      relance: doc.relance,
      playerName: doc.playerName,
      picture: doc.picture,
      pictureApotheose: doc.pictureApotheose,
      background: doc.background,
      buttonColor: doc.buttonColor,
      textColor: doc.textColor
    })
  }

  private static fromCharacter(doc: Character): DBCharacter {
    return {
      name: doc.name,
      classe: doc.classe.toString(),
      bloodline: doc.bloodline.toString(),
      apotheose: doc.apotheose.toString(),
      apotheoseImprovement: doc.apotheoseImprovement,
      apotheoseImprovementList: doc.apotheoseImprovementList,
      chair: doc.chair,
      uid: doc.uid,
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
      category: doc.category.toString(),
      genre: doc.genre.toString(),
      relance: doc.relance,
      playerName: doc.playerName,
      picture: doc.picture,
      pictureApotheose: doc.pictureApotheose,
      background: doc.background,
      buttonColor: doc.buttonColor,
      textColor: doc.textColor
    } as DBCharacter
  }

  async createOrUpdate(newCharacter: Character): Promise<Character> {
    if (
      newCharacter.apotheoseImprovement &&
      newCharacter.apotheoseImprovement !== '(Ajouter)' &&
      newCharacter.apotheoseImprovement !== 'Aucune' &&
      !newCharacter.apotheoseImprovementList.includes(newCharacter.apotheoseImprovement)
    ) {
      newCharacter.apotheoseImprovementList.push(newCharacter.apotheoseImprovement)
    }
    const character = await DBCharacterModel.findOne({ name: newCharacter.name }).exec()
    if (!character) {
      return DBCharacterProvider.toCharacter(
        await DBCharacterModel.create(DBCharacterProvider.fromCharacter(newCharacter))
      )
    } else {
      return this.update(newCharacter)
    }
  }

  async findOneByName(name: string): Promise<Character> {
    const character = await DBCharacterModel.findOne({ name: name }).exec()
    if (!character) {
      throw ProviderErrors.EntityNotFound(name)
    }
    return DBCharacterProvider.toCharacter(character)
  }

  async findByName(name: string): Promise<Character | undefined> {
    const character = await DBCharacterModel.findOne({ name: name }).exec()
    if (!character) {
      return undefined
    }
    return DBCharacterProvider.toCharacter(character)
  }

  async exist(name: string): Promise<boolean> {
    const character = await DBCharacterModel.findOne({ name: name }).exec()
    return character != null
  }

  async findManyByName(names: string[]): Promise<Character[]> {
    const characters = await DBCharacterModel.find({ name: names }).exec()
    return characters.map((c) => DBCharacterProvider.toCharacter(c))
  }

  async findAll(playerName?: string): Promise<Character[]> {
    if (playerName) {
      const characterList = await DBCharacterModel.find({ playerName: playerName }).exec()
      return characterList.map((c) => DBCharacterProvider.toCharacter(c))
    } else {
      const characterList = await DBCharacterModel.find().exec()
      return characterList.map((c) => DBCharacterProvider.toCharacter(c))
    }
  }

  async findAllByCategory(category: Category): Promise<string[]> {
    const characterList = await DBCharacterModel.find({ category: Category[category].toString() }).exec()
    return characterList.map((c) => c.name)
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
