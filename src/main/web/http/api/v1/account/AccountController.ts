import { AccountVM } from './entities/AccountVM'
import { ProfileGetRequestSchema } from './requests/ProfileGetRequest'
import { ProfileUpdateRequest, ProfileUpdateRequestPayload } from './requests/ProfileUpdateRequest'
import { Authority } from '../../../../../domain/models/auth/Authority'
import { AccountService } from '../../../../../domain/services/AccountService'
import { HttpRequestMethod, IHttpGateway } from '../../../../../gateways/IHttpGateway'
import { HttpRouteIdentifiers } from '../../../HttpRouteIdentifiers'
import { GetStatusRequest } from '../utils/requests/GetStatusRequest'

export class AccountController {
  private readonly accountService: AccountService

  constructor(p: { httpGateway: IHttpGateway; accountService: AccountService }) {
    this.accountService = p.accountService

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.PROFILE_GET,
      method: HttpRequestMethod.GET,
      route: `/api/v1/account/me`,
      useAuth: [Authority.USER],
      reqValidator: ProfileGetRequestSchema,
      resValidator: AccountVM.getValidationSchema(),
      bind: this.get.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.PROFILE_UPDATE,
      method: HttpRequestMethod.PUT,
      route: `/api/v1/account/me`,
      useAuth: [Authority.USER],
      reqValidator: ProfileUpdateRequestPayload.getValidationSchema(),
      resValidator: AccountVM.getValidationSchema(),
      bind: this.update.bind(this)
    })
  }

  async get(req: GetStatusRequest): Promise<AccountVM> {
    const account = await this.accountService.findOneAccountById(req.accountId)
    const profile = await this.accountService.findOneProfileByAccountId(account.id)

    return AccountVM.of({
      account: account,
      profile: profile
    })
  }

  async update(req: ProfileUpdateRequest): Promise<AccountVM> {
    const account = await this.accountService.findOneAccountById(req.accountId)
    const profile = await this.accountService.findOneProfileByAccountId(account.id)

    const accountUpdated = await this.accountService.updateAccount({
      account: account,
      accountUpdate: ProfileUpdateRequestPayload.toAccount(req.body)
    })

    const profileUpdated = await this.accountService.updateProfile({
      profile: profile,
      profileUpdate: ProfileUpdateRequestPayload.toProfile()
    })

    return AccountVM.of({
      account: accountUpdated,
      profile: profileUpdated
    })
  }
}
