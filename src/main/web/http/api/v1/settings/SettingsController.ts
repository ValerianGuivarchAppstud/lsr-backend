import { SettingsVM } from './entities/SettingsVM'
import { CharacterGetSettingsRequest, CharacterGetSettingsRequestPayload } from './requests/CharacterGetAllRequest'
import { CharacterService } from '../../../../../domain/services/CharacterService'
import { HttpRequestMethod, IHttpGateway } from '../../../../../gateways/IHttpGateway'
import { Utils } from '../../../../../utils/Utils'
import { HttpRouteIdentifiers } from '../../../HttpRouteIdentifiers'

export class SettingsController {
  private readonly characterService: CharacterService

  constructor(p: { httpGateway: IHttpGateway; characterService: CharacterService }) {
    this.characterService = p.characterService

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.SETTINGS_GET,
      method: HttpRequestMethod.GET,
      route: `/api/v1/settings`,
      useAuth: [],
      reqValidator: CharacterGetSettingsRequestPayload.getValidationSchema(),
      resValidator: SettingsVM.getValidationSchema(), // TODO
      bind: this.getSettings.bind(this)
    })
  }

  async getSettings(req: CharacterGetSettingsRequest): Promise<SettingsVM> {
    const playerListName = (await this.characterService.findAll('MJ')) // TODO clean this
      .map((c) => c.playerName)
      .filter((p) => p !== undefined)
    let playerListResult: string[] = []
    playerListResult.push('')
    playerListResult = Utils.uniqByReduce(playerListResult.concat(playerListName as string[])).sort()

    const characterListName = (await this.characterService.findAll(req.query.playerName)).map((c) => c.name)
    let characterListResult: string[] = []
    characterListResult.push('')
    characterListResult = characterListResult.concat(characterListName).sort()

    return SettingsVM.from({
      playersName: playerListResult,
      charactersName: characterListResult
    })
  }
}
