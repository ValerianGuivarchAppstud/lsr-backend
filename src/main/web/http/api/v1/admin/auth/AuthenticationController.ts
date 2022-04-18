import { AdminAccountVM } from './entities/AdminAccountVM'
import { AdminJWTTokenVM } from './entities/AdminJWTTokenVM'
import { AdminLoginRequest, AdminLoginRequestPayload } from './requests/AdminLoginRequest'
import { AdminRefreshTokenRequest, AdminRefreshTokenRequestPayload } from './requests/AdminRefreshTokenRequest'
import { AdminRegisterRequest, AdminRegisterRequestPayload } from './requests/AdminRegisterRequest'
import { AuthenticationService } from '../../../../../../domain/services/AuthenticationService'
import { HttpRequestMethod, IHttpGateway } from '../../../../../../gateways/IHttpGateway'
import { HttpRouteIdentifiers } from '../../../../HttpRouteIdentifiers'

export class AdminAuthenticationController {
  private authenticationService: AuthenticationService

  constructor(p: {
    httpGateway: IHttpGateway
    authenticationService: AuthenticationService
    enabledRegisterEndpoint: boolean
  }) {
    this.authenticationService = p.authenticationService

    // do not allow admin registration on production
    if (p.enabledRegisterEndpoint) {
      p.httpGateway.addRoute({
        id: HttpRouteIdentifiers.ADMIN_AUTH_POST_REGISTER,
        method: HttpRequestMethod.POST,
        route: `/api/v1/admin/auth/register`,
        useAuth: [],
        reqValidator: AdminRegisterRequestPayload.getValidationSchema(),
        resValidator: AdminAccountVM.getValidationSchema(),
        bind: this.register.bind(this)
      })
    }

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.ADMIN_AUTH_POST_LOGIN,
      method: HttpRequestMethod.POST,
      route: `/api/v1/admin/auth/login`,
      useAuth: [],
      reqValidator: AdminLoginRequestPayload.getValidationSchema(),
      resValidator: AdminJWTTokenVM.getValidationSchema(),
      bind: this.login.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.ADMIN_AUTH_POST_REFRESH,
      method: HttpRequestMethod.POST,
      route: `/api/v1/admin/auth/refresh`,
      useAuth: [],
      reqValidator: AdminRefreshTokenRequestPayload.getValidationSchema(),
      resValidator: AdminJWTTokenVM.getValidationSchema(),
      bind: this.refreshToken.bind(this)
    })
  }

  async login(req: AdminLoginRequest): Promise<AdminJWTTokenVM> {
    const token = await this.authenticationService.authenticate(req.body.email, req.body.password)
    return new AdminJWTTokenVM(token)
  }

  async refreshToken(req: AdminRefreshTokenRequest): Promise<AdminJWTTokenVM> {
    const token = await this.authenticationService.refreshToken(req.body.refreshToken)
    return new AdminJWTTokenVM(token)
  }

  async register(req: AdminRegisterRequest): Promise<AdminAccountVM> {
    const result = await this.authenticationService.adminRegister({
      email: req.body.email,
      password: req.body.password
    })
    return AdminAccountVM.of(result)
  }
}
