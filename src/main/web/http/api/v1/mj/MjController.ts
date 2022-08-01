import { MjSheetVM } from './entities/MjSheetVM'
import {
  MjAddCharacterFromTemplateRequest,
  MjAddCharacterFromTemplateRequestPayload
} from './requests/MjAddCharacterFromTemplateRequest'
import { MjAddCharacterFromTemplateResponse } from './requests/MjAddCharacterFromTemplateResponse'
import { MjAddCharacterRequest, MjAddCharacterRequestPayload } from './requests/MjAddCharacterRequest'
import { MjRemoveCharacterRequest, MjRemoveCharacterRequestPayload } from './requests/MjRemoveCharacterRequest'
import { MjRemoveRollRequest } from './requests/MjRemoveRollRequest'
import { Category } from '../../../../../domain/models/character/Category'
import { CharacterService } from '../../../../../domain/services/CharacterService'
import { MjService } from '../../../../../domain/services/MjService'
import { RollService } from '../../../../../domain/services/RollService'
import { HttpRequestMethod, IHttpGateway } from '../../../../../gateways/IHttpGateway'
import { HttpRouteIdentifiers } from '../../../HttpRouteIdentifiers'
import { CharacterVM } from '../character/entities/CharacterVM'

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
      id: HttpRouteIdentifiers.MJ_DELETE_ROLL,
      method: HttpRequestMethod.DELETE,
      route: `/api/v1/roll`,
      useAuth: [],
      reqValidator: undefined,
      resValidator: undefined,
      bind: this.deleteRoll.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.MJ_DELETE_ROLLS,
      method: HttpRequestMethod.DELETE,
      route: `/api/v1/rolls`,
      useAuth: [],
      reqValidator: undefined,
      resValidator: undefined,
      bind: this.deleteRolls.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.MJ_NEXT_ROUND,
      method: HttpRequestMethod.PUT,
      route: `/api/v1/mj/nextRound`,
      useAuth: [],
      reqValidator: undefined,
      resValidator: undefined,
      bind: this.nextRound.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.MJ_STOP_BATTLE,
      method: HttpRequestMethod.PUT,
      route: `/api/v1/mj/stopBattle`,
      useAuth: [],
      reqValidator: undefined,
      resValidator: undefined,
      bind: this.stopBattle.bind(this)
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

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.MJ_TEMPLATE,
      method: HttpRequestMethod.PUT,
      route: `/api/v1/mj/template`,
      useAuth: [],
      reqValidator: MjAddCharacterFromTemplateRequestPayload.getValidationSchema(),
      resValidator: MjAddCharacterFromTemplateResponse.getValidationSchema(),
      bind: this.template.bind(this)
    })
  }

  async get(): Promise<MjSheetVM> {
    const session = await this.mjService.getSession()
    const characters = await this.characterService.findManyByName(session.characters)
    const lastRolls = await this.rollService.getLast()
    const pjNames = (await this.characterService.findAllByCategory(Category.PJ)).sort()
    const pnjNames = await this.characterService.findAllByCategory(Category.PNJ_ALLY)
    pnjNames.push(...(await this.characterService.findAllByCategory(Category.PNJ_ENNEMY)))
    pnjNames.sort()
    const tempoNames = (await this.characterService.findAllByCategory(Category.TEMPO)).sort()
    const templateNames = (await this.characterService.findAllByCategory(Category.TEMPLATE)).sort()
    const playersName = await this.characterService.getPlayersName()
    return MjSheetVM.from({
      session: session,
      characters: characters,
      pjNames: pjNames,
      pnjNames: pnjNames,
      tempoNames: tempoNames,
      templateNames: templateNames,
      playersName: playersName,
      rollList: lastRolls,
      charactersBattleAllies: session.charactersBattleAllies,
      charactersBattleEnnemies: session.charactersBattleEnnemies,
      relanceMj: session.relanceMj,
      round: session.round
    })
  }

  async addCharacter(req: MjAddCharacterRequest): Promise<MjSheetVM> {
    await this.mjService.addCharacter(req.query.characterName)
    return this.get()
  }

  async deleteRolls(): Promise<boolean> {
    return await this.rollService.deleteAll()
  }

  async deleteRoll(req: MjRemoveRollRequest): Promise<boolean> {
    return await this.rollService.delete(req.query.id)
  }

  async template(req: MjAddCharacterFromTemplateRequest): Promise<MjAddCharacterFromTemplateResponse> {
    const templateNewCharacters = await this.mjService.addCharactersFromTemplate(
      req.body.templateName,
      req.body.customName,
      req.body.level,
      req.body.number
    )
    return new MjAddCharacterFromTemplateResponse({
      templateNewCharacters: templateNewCharacters.map((character) =>
        CharacterVM.from({
          character: character,
          relance: 0,
          help: 0,
          pjAlliesNames: []
        })
      )
    })
  }

  async removeCharacter(req: MjRemoveCharacterRequest): Promise<MjSheetVM> {
    await this.mjService.removeCharacter(req.query.characterName)
    return this.get()
  }

  async nextRound(): Promise<boolean> {
    await this.mjService.nextRound()
    return true
  }

  async stopBattle(): Promise<boolean> {
    await this.mjService.stopBattle()
    return true
  }
}
