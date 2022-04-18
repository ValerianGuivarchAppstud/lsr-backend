import { JWTTokenVM } from './entities/JWTTokenVM'
import { LoginRequest, LoginRequestPayload } from './requests/LoginRequest'
import { RefreshTokenRequest, RefreshTokenRequestPayload } from './requests/RefreshTokenRequest'
import { RegisterRequest, RegisterRequestPayload } from './requests/RegisterRequest'
import { AuthenticationService } from '../../../../../domain/services/AuthenticationService'
import { HttpRequestMethod, IHttpGateway } from '../../../../../gateways/IHttpGateway'
import { HttpRouteIdentifiers } from '../../../HttpRouteIdentifiers'
import { AccountVM } from '../account/entities/AccountVM'

export class AuthenticationController {
  private service: AuthenticationService

  constructor(p: { httpGateway: IHttpGateway; service: AuthenticationService }) {
    this.service = p.service

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.AUTH_POST_REGISTER,
      method: HttpRequestMethod.POST,
      route: `/api/v1/auth/register`,
      useAuth: [],
      reqValidator: RegisterRequestPayload.getValidationSchema(),
      resValidator: AccountVM.getValidationSchema(),
      bind: this.register.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.AUTH_POST_LOGIN,
      method: HttpRequestMethod.POST,
      route: `/api/v1/auth/login`,
      useAuth: [],
      reqValidator: LoginRequestPayload.getValidationSchema(),
      resValidator: JWTTokenVM.getValidationSchema(),
      bind: this.login.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.AUTH_POST_REFRESH,
      method: HttpRequestMethod.POST,
      route: `/api/v1/auth/refresh`,
      useAuth: [],
      reqValidator: RefreshTokenRequestPayload.getValidationSchema(),
      resValidator: JWTTokenVM.getValidationSchema(),
      bind: this.refreshToken.bind(this)
    })
  }

  async login(req: LoginRequest): Promise<JWTTokenVM> {
    const token = await this.service.authenticate(req.body.email, req.body.password)
    return new JWTTokenVM(token)
  }

  async refreshToken(req: RefreshTokenRequest): Promise<JWTTokenVM> {
    const token = await this.service.refreshToken(req.body.refreshToken)
    return new JWTTokenVM(token)
  }

  async register(req: RegisterRequest): Promise<AccountVM> {
    const result = await this.service.register(req.body.email, req.body.password)
    return AccountVM.of(result)
  }
}
