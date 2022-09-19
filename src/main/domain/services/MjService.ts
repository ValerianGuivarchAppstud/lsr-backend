import { logger } from '../helpers/logs/Logging'
import { Category } from '../models/character/Category'
import { Character } from '../models/character/Character'
import { Round } from '../models/session/Round'
import { Session } from '../models/session/Session'
import { ICharacterProvider } from '../providers/ICharacterProvider'
import { ISessionProvider } from '../providers/ISessionProvider'
import { randomInt } from 'crypto'

export class MjService {
  private sessionProvider: ISessionProvider
  private characterProvider: ICharacterProvider
  private readonly logger = logger(this.constructor.name)

  // eslint-disable-next-line no-magic-numbers
  private static statByLevel: number[] = [7, 8, 8, 9, 10, 10, 11, 12, 12, 13, 14, 15, 16, 16, 17, 18, 18, 19, 20, 21]

  constructor(p: { sessionProvider: ISessionProvider; characterProvider: ICharacterProvider }) {
    this.sessionProvider = p.sessionProvider
    this.characterProvider = p.characterProvider
  }

  async getSession(): Promise<Session> {
    const session = await this.sessionProvider.getSessionCharacter()
    for (const cName of session.characters) {
      if (!(await this.characterProvider.exist(cName))) {
        await this.sessionProvider.removeCharacter(cName)
      }
    }
    return session
  }

  async addCharacter(characterName: string): Promise<boolean> {
    return this.sessionProvider.addCharacter(characterName)
  }

  async addCharactersFromTemplate(
    templateName: string,
    customName: string,
    level: number,
    number: number
  ): Promise<Character[]> {
    const charactersList: Character[] = []
    const template = await this.characterProvider.findOneByName(templateName)
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
          apotheose: template.apotheose,
          apotheoseImprovement: template.apotheoseImprovement,
          apotheoseImprovementList: template.apotheoseImprovementList,
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
          picture: template.picture,
          background: template.background,
          buttonColor: template.buttonColor,
          textColor: template.textColor,
          uid: template.uid,
          playerName: template.playerName,
          pictureApotheose: template.pictureApotheose
        })
        const newC = await this.characterProvider.createOrUpdate(newCharacter)
        charactersList.push(newC)
        await this.sessionProvider.addCharacter(newC.name)
        number = number - 1
      }
      numero = numero + 1
    }
    return charactersList
  }

  async removeCharacter(characterName: string): Promise<boolean> {
    return this.sessionProvider.removeCharacter(characterName)
  }

  async nextRound(): Promise<boolean> {
    const session = await this.sessionProvider.getSessionCharacter()
    if (session.round === Round.NONE) {
      return await this.sessionProvider.updateBattle([], [], Round.PJ)
    } else if (session.round === Round.PJ) {
      return await this.sessionProvider.updateBattle(session.charactersBattleAllies, [], Round.PNJ)
    } else {
      return await this.sessionProvider.updateBattle([], session.charactersBattleEnnemies, Round.PJ)
    }
  }

  async stopBattle(): Promise<boolean> {
    return await this.sessionProvider.updateBattle([], [], Round.NONE)
  }
}
