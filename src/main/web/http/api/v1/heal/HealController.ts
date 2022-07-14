import { HealSheetVM } from './entities/HealSheetVM'
import { HealGetRequest, HealGetRequestPayload } from './requests/HealGetRequest'
import { Character } from '../../../../../domain/models/character/Character'
import { CharacterService } from '../../../../../domain/services/CharacterService'
import { MjService } from '../../../../../domain/services/MjService'
import { RollService } from '../../../../../domain/services/RollService'
import { HttpRequestMethod, IHttpGateway } from '../../../../../gateways/IHttpGateway'
import { HttpRouteIdentifiers } from '../../../HttpRouteIdentifiers'

export class HealController {
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
      id: HttpRouteIdentifiers.HEAL_GET,
      method: HttpRequestMethod.GET,
      route: `/api/v1/heal`,
      useAuth: [],
      reqValidator: HealGetRequestPayload.getValidationSchema(),
      resValidator: HealSheetVM.getValidationSchema(),
      bind: this.get.bind(this)
    })
  }

  async get(req: HealGetRequest): Promise<HealSheetVM> {
    const character = await this.characterService.findByName(req.query.name)
    const lastRolls = await this.rollService.getLast()
    const pjAlliesName = (await this.mjService.getSession()).characters
    const pjAllies: Character[] = []
    for (const name of pjAlliesName) {
      pjAllies.push(await this.characterService.findByName(name))
    }
    return HealSheetVM.from({
      character: character,
      rollList: lastRolls,
      pjAllies: pjAllies
    })
  }
}
