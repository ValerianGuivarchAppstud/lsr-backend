import { logger } from '../helpers/logs/Logging'
import { Category } from '../models/character/Category'
import { Character } from '../models/character/Character'
import { Session } from '../models/mj/Mj'
import { ICharacterProvider } from '../providers/ICharacterProvider'
import { IMjProvider } from '../providers/IMjProvider'
import { randomInt } from 'crypto'

export class MjService {
  private mjProvider: IMjProvider
  private characterProvider: ICharacterProvider
  private readonly logger = logger(this.constructor.name)

  // eslint-disable-next-line no-magic-numbers
  private static statByLevel: number[] = [7, 8, 8, 9, 10, 10, 11, 12, 12, 13, 14, 15, 16, 16, 17, 18, 18, 19, 20, 21]

  constructor(p: { mjProvider: IMjProvider; characterProvider: ICharacterProvider }) {
    this.mjProvider = p.mjProvider
    this.characterProvider = p.characterProvider
  }

  async getSession(): Promise<Session> {
    return await this.mjProvider.getSessionCharacter()
  }

  async addCharacter(characterName: string): Promise<boolean> {
    return this.mjProvider.addCharacter(characterName)
  }

  async addCharactersFromTemplate(
    templateName: string,
    customName: string,
    level: number,
    number: number
  ): Promise<Character[]> {
    const charactersList: Character[] = []
    const template = await this.characterProvider.findByName(templateName)
    if (level < 1) {
      level = 1
    }
    if (level > MjService.statByLevel.length) {
      level = MjService.statByLevel.length
    }

    let numero = 1
    while (number > 0) {
      if (!(await this.characterProvider.exist(customName + '_' + numero.toString()))) {
        // eslint-disable-next-line no-magic-numbers
        let stat = MjService.statByLevel[level - 1] - 6
        let chair = 2
        let esprit = 2
        let essence = 2
        while (stat > 0) {
          // eslint-disable-next-line no-magic-numbers
          const attribution = randomInt(1, 12)
          if (attribution <= template.chair) {
            chair++
          } else if (attribution <= template.chair + template.esprit) {
            esprit++
          } else {
            essence++
          }
          stat--
        }
        const newCharacter = new Character({
          pp: essence,
          arcanesMax: template.arcanesMax,
          classe: template.classe,
          bloodline: template.bloodline,
          notes: template.notes,
          // eslint-disable-next-line no-magic-numbers
          dettes: randomInt(0, 10),
          chair: chair,
          essence: essence,
          // eslint-disable-next-line no-magic-numbers
          pv: chair * 2,
          arcanes: template.arcanes,
          niveau: level,
          lux: '',
          pf: esprit,
          pfMax: esprit,
          secunda: '',
          name: customName + '_' + numero.toString(),
          esprit: esprit,
          ppMax: essence,
          umbra: '',
          category: Category.TEMPO,
          // eslint-disable-next-line no-magic-numbers
          pvMax: chair * 2,
          genre: template.genre,
          relance: 0,
          picture: template.picture,
          background: template.background
        })
        const newC = await this.characterProvider.createOrUpdate(newCharacter)
        charactersList.push(newC)
        await this.mjProvider.addCharacter(newC.name)
        number = number - 1
      }
      numero = numero + 1
    }
    return charactersList
  }

  async removeCharacter(characterName: string): Promise<boolean> {
    return this.mjProvider.removeCharacter(characterName)
  }
}
