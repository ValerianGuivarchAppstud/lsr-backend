import { mergeNonNull } from '../helpers/EntityUtils'
import { logger } from '../helpers/logs/Logging'
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

  async createOrUpdateCharacter(p: { character: Character }): Promise<Character> {
    return await this.characterProvider.createOrUpdate(p.character)
  }

  async deleteCharacter(p: { name: string }): Promise<Character> {
    return await this.characterProvider.delete(p.name)
  }
}
