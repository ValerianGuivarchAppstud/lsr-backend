import { logger } from '../helpers/logs/Logging'
import { Category } from '../models/character/Category'
import { Mj } from '../models/mj/Mj'
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

  async getMj(): Promise<Mj> {
    const mj = await this.mjProvider.getMj()
    mj.pjNames = (await this.characterProvider.findAllByCategory(Category.PJ)).sort()
    mj.pnjNames = (await this.characterProvider.findAllByCategory(Category.PNJ)).sort()
    mj.tempoNames = (await this.characterProvider.findAllByCategory(Category.TEMPO)).sort()
    mj.playersName = await this.characterProvider.getPlayersName()
    return mj
  }

  async addCharacter(characterName: string): Promise<boolean> {
    return this.mjProvider.addCharacter(characterName)
  }

  async removeCharacter(characterName: string): Promise<boolean> {
    return this.mjProvider.removeCharacter(characterName)
  }
}
