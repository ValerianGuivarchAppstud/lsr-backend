import { logger } from '../helpers/logs/Logging'
import { Category } from '../models/character/Category'
import { Character } from '../models/character/Character'
import { ICharacterProvider } from '../providers/ICharacterProvider'
import { ISessionProvider } from '../providers/ISessionProvider'

export class CharacterService {
  private characterProvider: ICharacterProvider
  private sessionProvider: ISessionProvider
  private readonly logger = logger(this.constructor.name)

  constructor(p: { characterProvider: ICharacterProvider; sessionProvider: ISessionProvider }) {
    this.characterProvider = p.characterProvider
    this.sessionProvider = p.sessionProvider
  }

  async findOneByName(name: string): Promise<Character> {
    return this.characterProvider.findOneByName(name)
  }

  async findByName(name: string): Promise<Character | undefined> {
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
    if (p.character.category != Category.PJ) {
      await this.sessionProvider.updateMjRelance(p.character.relance)
    }
    return await this.characterProvider.createOrUpdate(p.character)
  }

  async deleteCharacter(p: { name: string }): Promise<Character> {
    return await this.characterProvider.delete(p.name)
  }

  async getPlayersName(): Promise<string[]> {
    return ['', 'Arcady', 'David', 'Elena', 'Eric', 'Florent', 'Guilhem', 'Jupi', 'Nico', 'Tom', 'Valou', 'Guest']
  }
}
