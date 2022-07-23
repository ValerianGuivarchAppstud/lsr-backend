import { CharacterSheetVM } from './entities/CharacterSheetVM'
import { CharacterVM } from './entities/CharacterVM'
import { CharacterCreateRequest, CharacterCreateRequestPayload } from './requests/CharacterCreateRequest'
import { CharacterDeleteRequest, CharacterDeleteRequestPayload } from './requests/CharacterDeleteRequest'
import { CharacterGetRequest, CharacterGetRequestPayload } from './requests/CharacterGetRequest'
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
    const character = await this.characterService.findByName(req.query.name)
    const lastRolls = await this.rollService.getLast()
    const session = await this.mjService.getSession()
    const playersName = await this.characterService.getPlayersName()
    return CharacterSheetVM.from({
      character: character,
      rollList: lastRolls,
      pjAlliesNames: session.characters,
      playersName: playersName
    })
  }

  async createOrUpdate(req: CharacterCreateRequest): Promise<CharacterVM> {
    const newCharacter = new Character({
      // TODO majuscule juste à la 1er lettre ?
      name: req.body.character.name,
      classe: Classe[req.body.character.classe],
      bloodline: Bloodline[req.body.character.bloodline],
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
      background: req.body.character.background,
      buttonColor: req.body.character.buttonColor,
      textColor: req.body.character.textColor
    })
    const character = await this.characterService.createOrUpdateCharacter({ character: newCharacter })
    return CharacterVM.from({
      character: character
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async delete(req: CharacterDeleteRequest) {
    await this.characterService.deleteCharacter({
      name: req.body.name
    })
  }
}
