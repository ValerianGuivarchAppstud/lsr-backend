import { logger } from '../helpers/logs/Logging'
import { Session } from '../models/mj/Mj'
import { ICharacterProvider } from '../providers/ICharacterProvider'
import { IMjProvider } from '../providers/IMjProvider'

export class MjService {
  private mjProvider: IMjProvider
  private characterProvider: ICharacterProvider
  private readonly logger = logger(this.constructor.name)

  constructor(p: { mjProvider: IMjProvider; characterProvider: ICharacterProvider }) {
    this.mjProvider = p.mjProvider
    this.characterProvider = p.characterProvider
  }

  async getSession(): Promise<Session> {
    const session = await this.mjProvider.getSessionCharacter()
    return session
  }

  async addCharacter(characterName: string): Promise<boolean> {
    return this.mjProvider.addCharacter(characterName)
  }

  async removeCharacter(characterName: string): Promise<boolean> {
    return this.mjProvider.removeCharacter(characterName)
  }
}
