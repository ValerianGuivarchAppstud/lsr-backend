import { MjSheetVM } from './entities/MjSheetVM'
import { MjAddCharacterRequest, MjAddCharacterRequestPayload } from './requests/MjAddCharacterRequest'
import { MjRemoveCharacterRequest, MjRemoveCharacterRequestPayload } from './requests/MjRemoveCharacterRequest'
import { CharacterService } from '../../../../../domain/services/CharacterService'
import { MjService } from '../../../../../domain/services/MjService'
import { RollService } from '../../../../../domain/services/RollService'
import { HttpRequestMethod, IHttpGateway } from '../../../../../gateways/IHttpGateway'
import { HttpRouteIdentifiers } from '../../../HttpRouteIdentifiers'

export class MjController {
  private readonly characterService: CharacterService
  private readonly mjService: MjService
  private readonly rollService: RollService

  constructor(p: {
    httpGateway: IHttpGateway
    mjService: MjService
    characterService: CharacterService
    rollService: RollService
  }) {
    this.characterService = p.characterService
    this.mjService = p.mjService
    this.rollService = p.rollService

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.MJ_GET,
      method: HttpRequestMethod.GET,
      route: `/api/v1/mj`,
      useAuth: [],
      reqValidator: undefined,
      resValidator: MjSheetVM.getValidationSchema(),
      bind: this.get.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.MJ_ADD_CHARACTER,
      method: HttpRequestMethod.PUT,
      route: `/api/v1/mj/character`,
      useAuth: [],
      reqValidator: MjAddCharacterRequestPayload.getValidationSchema(),
      resValidator: MjSheetVM.getValidationSchema(),
      bind: this.addCharacter.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.MJ_REMOVE_CHARACTER,
      method: HttpRequestMethod.DELETE,
      route: `/api/v1/mj/character`,
      useAuth: [],
      reqValidator: MjRemoveCharacterRequestPayload.getValidationSchema(),
      resValidator: MjSheetVM.getValidationSchema(),
      bind: this.removeCharacter.bind(this)
    })
  }

  async get(): Promise<MjSheetVM> {
    const mj = await this.mjService.getMj()
    const characters = await this.characterService.findManyByName(mj.characters)
    const lastRolls = await this.rollService.getLast()
    return MjSheetVM.from({
      mj: mj,
      characters: characters,
      rollList: lastRolls
    })
  }

  async addCharacter(req: MjAddCharacterRequest): Promise<MjSheetVM> {
    await this.mjService.addCharacter(req.query.characterName)
    return this.get()
  }

  async removeCharacter(req: MjRemoveCharacterRequest): Promise<MjSheetVM> {
    await this.mjService.removeCharacter(req.query.characterName)
    return this.get()
  }
}
