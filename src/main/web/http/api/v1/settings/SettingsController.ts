import { SettingsVM } from './entities/SettingsVM'
import { CharacterGetSettingsRequest, CharacterGetSettingsRequestPayload } from './requests/CharacterGetAllRequest'
import { CharacterService } from '../../../../../domain/services/CharacterService'
import { MjService } from '../../../../../domain/services/MjService'
import { HttpRequestMethod, IHttpGateway } from '../../../../../gateways/IHttpGateway'
import { HttpRouteIdentifiers } from '../../../HttpRouteIdentifiers'

export class SettingsController {
  private readonly characterService: CharacterService
  private readonly mjService: MjService

  constructor(p: { httpGateway: IHttpGateway; characterService: CharacterService; mjService: MjService }) {
    this.characterService = p.characterService
    this.mjService = p.mjService

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.SETTINGS_GET,
      method: HttpRequestMethod.GET,
      route: `/api/v1/settings`,
      useAuth: [],
      reqValidator: CharacterGetSettingsRequestPayload.getValidationSchema(),
      resValidator: SettingsVM.getValidationSchema(), // TODO
      bind: this.getSettings.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.TOKEN_VISIO_GET,
      method: HttpRequestMethod.GET,
      route: `/api/v1/token`,
      useAuth: [],
      reqValidator: undefined,
      resValidator: undefined,
      bind: this.getTokenVisio.bind(this)
    })
  }

  async getSettings(req: CharacterGetSettingsRequest): Promise<SettingsVM> {
    const playersName = await this.characterService.getPlayersName()

    const characterListName = (await this.characterService.findAll(req.query.playerName)).map((c) => c.name)
    let characterListResult: string[] = []
    characterListResult.push('')
    characterListResult = characterListResult.concat(characterListName).sort()

    return SettingsVM.from({
      playersName: playersName,
      charactersName: characterListResult
    })
  }

  async getTokenVisio(): Promise<string> {
    const v = await this.mjService.getSession()
    return v.visioToken
  }
}
