import { CharacterSheetVM } from './entities/CharacterSheetVM'
import { CharacterVM } from './entities/CharacterVM'
import { CharacterCreateRequest, CharacterCreateRequestPayload } from './requests/CharacterCreateRequest'
import { CharacterDeleteRequest, CharacterDeleteRequestPayload } from './requests/CharacterDeleteRequest'
import { CharacterGetRequest, CharacterGetRequestPayload } from './requests/CharacterGetRequest'
import { Apotheose } from '../../../../../domain/models/character/Apotheose'
import { Bloodline } from '../../../../../domain/models/character/Bloodline'
import { Category } from '../../../../../domain/models/character/Category'
import { Character } from '../../../../../domain/models/character/Character'
import { Classe } from '../../../../../domain/models/character/Classe'
import { Genre } from '../../../../../domain/models/character/Genre'
import { CharacterService } from '../../../../../domain/services/CharacterService'
import { MjService } from '../../../../../domain/services/MjService'
import { RollService } from '../../../../../domain/services/RollService'
import { HttpRequestMethod, IHttpGateway } from '../../../../../gateways/IHttpGateway'
import { HttpRouteIdentifiers } from '../../../HttpRouteIdentifiers'

export class CharacterController {
  private readonly characterService: CharacterService
  private readonly rollService: RollService
  private readonly mjService: MjService

  constructor(p: {
    httpGateway: IHttpGateway
    characterService: CharacterService
    rollService: RollService
    mjService: MjService
  }) {
    this.characterService = p.characterService
    this.rollService = p.rollService
    this.mjService = p.mjService

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.CHARACTER_GET,
      method: HttpRequestMethod.GET,
      route: `/api/v1/character`,
      useAuth: [],
      reqValidator: CharacterGetRequestPayload.getValidationSchema(),
      resValidator: CharacterSheetVM.getValidationSchema(),
      bind: this.get.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.CHARACTER_GETALL,
      method: HttpRequestMethod.GET,
      route: `/api/v1/characters`,
      useAuth: [],
      reqValidator: undefined,
      resValidator: undefined,
      bind: this.getAll.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.CHARACTER_CREATE_OR_UPDATE,
      method: HttpRequestMethod.PUT,
      route: `/api/v1/character`,
      useAuth: [],
      reqValidator: CharacterCreateRequestPayload.getValidationSchema(),
      resValidator: CharacterVM.getValidationSchema(),
      bind: this.createOrUpdate.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.CHARACTER_DELETE,
      method: HttpRequestMethod.DELETE,
      route: `/api/v1/character`,
      useAuth: [],
      reqValidator: CharacterDeleteRequestPayload.getValidationSchema(),
      resValidator: CharacterVM.getValidationSchema(),
      bind: this.delete.bind(this)
    })
  }

  async get(req: CharacterGetRequest): Promise<CharacterSheetVM> {
    const character = await this.characterService.findOneByName(req.query.name)
    const lastRolls = await this.rollService.getLast()
    const session = await this.mjService.getSession()
    let alliesName: string[]
    const characters = await this.characterService.findAll('MJ')
    if (character.category === Category.PJ) {
      alliesName = session.characters.filter((characterName) => {
        const character = characters.filter((c) => characterName == c.name)[0]
        return character?.category === Category.PJ || character?.category === Category.PNJ_ALLY
      })
    } else {
      alliesName = session.characters
    }
    const playersName = await this.characterService.getPlayersName()
    const help = await this.rollService.getHelp(character.name)
    let relance = character.relance
    if (character.category != Category.PJ) {
      relance = session.relanceMj
    }
    return CharacterSheetVM.from({
      character: character,
      rollList: lastRolls,
      alliesName: alliesName,
      playersName: playersName,
      relance: relance,
      help: help,
      chaos: session.chaos
    })
  }

  async getAll(): Promise<CharacterSheetVM[]> {
    const characters = await this.characterService.findAll('MJ')
    return characters.map((character) =>
      CharacterSheetVM.from({
        character: character,
        rollList: [],
        alliesName: [],
        playersName: [],
        relance: 0,
        help: 0,
        chaos: 0
      })
    )
  }

  async createOrUpdate(req: CharacterCreateRequest): Promise<CharacterVM> {
    const newCharacter = new Character({
      // TODO majuscule juste à la 1er lettre ?
      name: req.body.character.name,
      classe: Classe[req.body.character.classe],
      bloodline: Bloodline[req.body.character.bloodline],
      apotheose: Apotheose[req.body.character.apotheose],
      apotheoseImprovement: req.body.character.apotheoseImprovement,
      apotheoseImprovementList: req.body.character.apotheoseImprovementList,
      chair: req.body.character.chair,
      esprit: req.body.character.esprit,
      essence: req.body.character.essence,
      pv: req.body.character.pv,
      pvMax: req.body.character.pvMax,
      pf: req.body.character.pf,
      pfMax: req.body.character.pfMax,
      pp: req.body.character.pp,
      ppMax: req.body.character.ppMax,
      dettes: req.body.character.dettes,
      arcanes: req.body.character.arcanes,
      arcanesMax: req.body.character.arcanesMax,
      niveau: req.body.character.niveau,
      lux: req.body.character.lux,
      umbra: req.body.character.umbra,
      secunda: req.body.character.secunda,
      notes: req.body.character.notes,
      category: Category[req.body.character.category],
      genre: Genre[req.body.character.genre],
      relance: req.body.character.relance,
      playerName: req.body.character.playerName,
      picture: req.body.character.picture,
      pictureApotheose: req.body.character.pictureApotheose,
      background: req.body.character.background,
      buttonColor: req.body.character.buttonColor,
      textColor: req.body.character.textColor
    })
    const character = await this.characterService.createOrUpdateCharacter({ character: newCharacter })

    const help = await this.rollService.getHelp(character.name)
    let relance = newCharacter.relance
    if (newCharacter.category != Category.PJ) {
      const session = await this.mjService.getSession()
      relance = session.relanceMj
    }
    return CharacterVM.from({
      character: character,
      relance: relance,
      help: help,
      alliesName: []
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async delete(req: CharacterDeleteRequest) {
    await this.characterService.deleteCharacter({
      name: req.body.name
    })
  }
}
