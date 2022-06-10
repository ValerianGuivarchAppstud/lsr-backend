import { AdminUserVM } from './entities/AdminUserVM'
import { AdminCreateAccountRequest, AdminCreateAccountRequestPayload } from './requests/AdminCreateAccountRequest'
import { AdminGetAllAccountsRequest } from './requests/AdminGetAllAccountsRequest'
import { AdminGetManyAccountsRequest } from './requests/AdminGetManyAccountsRequest'
import { AdminGetOneAccountRequest, AdminGetOneAccountRequestSchema } from './requests/AdminGetOneAccountRequest'
import { AdminUpdateAccountRequest, AdminUpdateAccountRequestPayload } from './requests/AdminUpdateAccountRequest'
import { Page } from '../../../../../../domain/helpers/pagination/Page'
import { Pageable } from '../../../../../../domain/helpers/pagination/Pageable'
import { Authority } from '../../../../../../domain/models/auth/Authority'
import { AdminAccountService } from '../../../../../../domain/services/admin/AdminAccountService'
import { HttpRequestMethod, IHttpGateway } from '../../../../../../gateways/IHttpGateway'
import { HttpRouteIdentifiers } from '../../../../HttpRouteIdentifiers'
import {AdminEnumRequest, AdminEnumRequestPayload} from '../auth/requests/AdminEnumsRequest'
import { ReactAdminPage } from '../common/pagination/ReactAdminPage'

export class AdminAccountController {
  private readonly accountService: AdminAccountService

  constructor(p: { httpGateway: IHttpGateway; accountService: AdminAccountService }) {
    this.accountService = p.accountService

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.ADMIN_ACCOUNT_POST,
      method: HttpRequestMethod.POST,
      route: `/api/v1/admin/accounts`,
      useAuth: [Authority.ADMIN],
      reqValidator: AdminCreateAccountRequestPayload.getValidationSchema(),
      resValidator: AdminUserVM.getValidationSchema(),
      bind: this.create.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.ADMIN_ACCOUNT_PUT,
      method: HttpRequestMethod.PUT,
      route: `/api/v1/admin/accounts/:id`,
      useAuth: [Authority.ADMIN],
      reqValidator: AdminUpdateAccountRequestPayload.getValidationSchema(),
      resValidator: AdminUserVM.getValidationSchema(),
      bind: this.update.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.ADMIN_ACCOUNT_GET,
      method: HttpRequestMethod.GET,
      route: `/api/v1/admin/accounts/:id`,
      useAuth: [Authority.ADMIN],
      reqValidator: AdminGetOneAccountRequestSchema,
      resValidator: AdminUserVM.getValidationSchema(),
      bind: this.findOne.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.ADMIN_GET_ENUM,
      method: HttpRequestMethod.GET,
      route: `/api/v1/admin/enums`,
      useAuth: [Authority.ADMIN],
      reqValidator: AdminEnumRequestPayload.getValidationSchema(),
      resValidator: undefined,
      bind: this.findEnums.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.ADMIN_ACCOUNT_GET_ALL,
      method: HttpRequestMethod.GET,
      route: `/api/v1/admin/accounts`,
      useAuth: [Authority.ADMIN],
      reqValidator: undefined,
      resValidator: undefined,
      bind: this.findAll.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.ADMIN_ACCOUNT_GET_MANY,
      method: HttpRequestMethod.GET,
      route: `/api/v1/admin/accounts/many`,
      useAuth: [Authority.ADMIN],
      reqValidator: undefined,
      resValidator: undefined,
      bind: this.many.bind(this)
    })
  }

  async create(req: AdminCreateAccountRequest): Promise<AdminUserVM> {
    const category = await this.accountService.create({
      account: AdminCreateAccountRequestPayload.toAccount(req.body)
    })
    return AdminUserVM.from(category)
  }

  async update(req: AdminUpdateAccountRequest): Promise<AdminUserVM> {
    const account = await this.accountService.findOneById(req.params.id)
    const accountUpdated = await this.accountService.update({
      account: account,
      accountUpdate: AdminUpdateAccountRequestPayload.toAccount(req.body)
    })
    return AdminUserVM.from(accountUpdated)
  }

  async findAll(req: AdminGetAllAccountsRequest): Promise<Page<AdminUserVM>> {
    const pageable = new Pageable({ sort: req.query.sort, page: req.query.page, size: req.query.size })
    const results = await this.accountService.findAllByAuthorityPaged({ pageable: pageable, authority: Authority.USER })
    return {
      ...results,
      content: results.content.map((mp) => {
        return AdminUserVM.from(mp)
      })
    }
  }

  async findOne(req: AdminGetOneAccountRequest): Promise<AdminUserVM> {
    const results = await this.accountService.findOneById(req.params.id)
    return AdminUserVM.from(results)
  }

  async findEnums(req: AdminEnumRequest): Promise<string[]> {
    if(req.query.enum === 'authority') {
      return Object.values(Authority)
    } else {
      return []
    }
  }

  async many(req: AdminGetManyAccountsRequest): Promise<ReactAdminPage<AdminUserVM>> {
    const ids = [req.query['ids[]']].flat()
    const categories = await this.accountService.findAllByIdIn(ids ?? [])
    return ReactAdminPage.ofList(
      categories.map((mp) => {
        return AdminUserVM.from(mp)
      })
    )
  }
}
