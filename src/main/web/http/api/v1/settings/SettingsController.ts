import { SettingsVM } from './entities/SettingsVM'
import { VisioVM } from './entities/VisioVM'
import { CharacterGetSettingsRequest, CharacterGetSettingsRequestPayload } from './requests/CharacterGetAllRequest'
import { UidPutRequest, UidPutRequestPayload } from './requests/UidPutRequest'
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
      resValidator: SettingsVM.getValidationSchema(),
      bind: this.getSettings.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.TOKEN_GET,
      method: HttpRequestMethod.GET,
      route: `/api/v1/token`,
      useAuth: [],
      reqValidator: undefined,
      resValidator: undefined,
      bind: this.getToken.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.VISIO_GET,
      method: HttpRequestMethod.GET,
      route: `/api/v1/visio`,
      useAuth: [],
      reqValidator: undefined,
      resValidator: undefined,
      bind: this.getVisio.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.UID_VISIO_PUT,
      method: HttpRequestMethod.PUT,
      route: `/api/v1/uid`,
      useAuth: [],
      reqValidator: UidPutRequestPayload.getValidationSchema(),
      resValidator: undefined,
      bind: this.putUidVisio.bind(this)
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

  async getVisio(): Promise<VisioVM> {
    const characters = await this.characterService.findAll('MJ')
    return VisioVM.from({
      characters: characters
    })
  }

  async getToken(): Promise<string> {
    const v = await this.mjService.getSession()
    return v.visioToken
  }

  async putUidVisio(req: UidPutRequest): Promise<boolean> {
    const characterNewUid = await this.characterService.findOneByName(req.query.characterName)
    characterNewUid.uid = req.query.uid
    await this.characterService.createOrUpdateCharacter({
      character: characterNewUid
    })
    return true
  }
}
