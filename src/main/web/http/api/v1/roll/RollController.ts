import { RollLastVM } from './entities/RollLastVM'
import { RollVM } from './entities/RollVM'
import { RollGetLastRequest, RollGetLastRequestPayload } from './requests/RollGetLastRequest'
import { RollSendRequest, RollSendRequestPayload } from './requests/RollSendRequest'
import { RollService } from '../../../../../domain/services/RollService'
import { HttpRequestMethod, IHttpGateway } from '../../../../../gateways/IHttpGateway'
import { HttpRouteIdentifiers } from '../../../HttpRouteIdentifiers'

export class RollController {
  private readonly rollService: RollService

  constructor(p: { httpGateway: IHttpGateway; rollService: RollService }) {
    this.rollService = p.rollService

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.ROLL_POST,
      method: HttpRequestMethod.POST,
      route: `/api/v1/roll`,
      useAuth: [],
      reqValidator: RollSendRequestPayload.getValidationSchema(),
      resValidator: RollVM.getValidationSchema(),
      bind: this.sendRoll.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.ROLL_GET_LAST,
      method: HttpRequestMethod.GET,
      route: `/api/v1/roll`,
      useAuth: [],
      reqValidator: RollGetLastRequestPayload.getValidationSchema(),
      resValidator: RollLastVM.getValidationSchema(),
      bind: this.getLast.bind(this)
    })
  }

  async getLast(req: RollGetLastRequest): Promise<RollLastVM> {
    const lastRolls = await this.rollService.getLast()
    return RollLastVM.from({
      rollList: lastRolls
    })
  }

  async sendRoll(req: RollSendRequest): Promise<RollVM> {
    const roll = await this.rollService.roll({
      rollerName: req.body.rollerName,
      rollType: req.body.rollType,
      secret: req.body.secret,
      focus: req.body.focus,
      power: req.body.power,
      proficiency: req.body.proficiency,
      benediction: req.body.benediction,
      malediction: req.body.malediction,
      empiriqueRoll: req.body.empiriqueRoll
    })
    return RollVM.from({
      roll: roll
    })
  }
}
