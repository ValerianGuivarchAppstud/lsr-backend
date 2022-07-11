import { logger } from '../helpers/logs/Logging'
import { Category } from '../models/character/Category'
import { Character } from '../models/character/Character'
import { ICharacterProvider } from '../providers/ICharacterProvider'

export class CharacterService {
  private characterProvider: ICharacterProvider
  private readonly logger = logger(this.constructor.name)

  constructor(p: { characterProvider: ICharacterProvider }) {
    this.characterProvider = p.characterProvider
  }

  async findByName(name: string): Promise<Character> {
    return this.characterProvider.findByName(name)
  }

  async findManyByName(names: string[]): Promise<Character[]> {
    return this.characterProvider.findManyByName(names)
  }

  async findAll(playerName?: string): Promise<Character[]> {
    if (playerName === 'MJ') {
      return this.characterProvider.findAll()
    } else if (playerName) {
      return this.characterProvider.findAll(playerName)
    } else {
      return this.characterProvider.findAll('-no-player-')
    }
  }

  async findAllByCategory(category: Category): Promise<string[]> {
    return this.characterProvider.findAllByCategory(category)
  }

  async createOrUpdateCharacter(p: { character: Character }): Promise<Character> {
    return await this.characterProvider.createOrUpdate(p.character)
  }

  async deleteCharacter(p: { name: string }): Promise<Character> {
    return await this.characterProvider.delete(p.name)
  }

  async getPlayersName(): Promise<string[]> {
    return this.characterProvider.getPlayersName()
  }
}
