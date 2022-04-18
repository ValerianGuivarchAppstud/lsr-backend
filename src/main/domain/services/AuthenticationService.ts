import { ProviderErrors } from '../../data/errors/ProviderErrors'
import { logger } from '../helpers/logs/Logging'
import { Account } from '../models/account/Account'
import { Profile } from '../models/account/Profile'
import { Authority } from '../models/auth/Authority'
import { AuthRequest } from '../models/auth/AuthRequest'
import { AuthType } from '../models/auth/AuthType'
import { JWTToken } from '../models/auth/JWTToken'
import { IAccountProvider } from '../providers/IAccountProvider'
import { IAuthenticationProvider } from '../providers/IAuthenticationProvider'
import { IProfileProvider } from '../providers/IProfileProvider'
import { ITokenProvider } from '../providers/ITokenProvider'

export class AuthenticationService {
  private readonly logger = logger(this.constructor.name)
  private accountProvider: IAccountProvider
  private profileProvider: IProfileProvider
  private tokenProvider: ITokenProvider
  private authProviders: IAuthenticationProvider[]

  constructor(p: {
    accountProvider: IAccountProvider
    profileProvider: IProfileProvider
    tokenProvider: ITokenProvider
    authProviders: IAuthenticationProvider[]
  }) {
    this.accountProvider = p.accountProvider
    this.profileProvider = p.profileProvider
    this.tokenProvider = p.tokenProvider
    this.authProviders = p.authProviders
  }

  async register(email: string, password: string): Promise<{ account: Account; profile: Profile }> {
    const account = await this.accountProvider.create(new Account({ email: email, password: password }))
    const profile = await this.profileProvider.create(new Profile({ accountId: account.id }))
    this.logger.info(`register > Account[${account.id}] > Profile[${profile.id}]`)
    return { account: account, profile: profile }
  }

  async adminRegister(p: { email: string; password: string }): Promise<Account> {
    return this.accountProvider.create(
      new Account({ email: p.email, password: p.password, authority: Authority.ADMIN })
    )
  }

  async authenticate(email: string, password: string): Promise<JWTToken> {
    const request = new AuthRequest(AuthType.MAIL, email, password)
    if (!(await this.authProviders.find((elt) => elt.supports(request.type))?.verifyLogin(request))) {
      throw ProviderErrors.WrongCredentials()
    }
    const account = await this.accountProvider.findOneByEmail(email)
    return this.tokenProvider.generateTokens({
      accountId: account.id,
      secret: account.secret,
      authority: account.authority
    })
  }

  async refreshToken(refreshToken: string): Promise<JWTToken> {
    const auth = await this.tokenProvider.unpackToken(refreshToken)
    if (!auth.isRefreshToken) {
      throw ProviderErrors.WrongToken()
    }
    const account = await this.accountProvider.findOneById(auth.subject)
    await this.tokenProvider.verifyToken(refreshToken, account.secret)
    return this.tokenProvider.generateTokens({
      accountId: account.id,
      secret: account.secret,
      authority: account.authority
    })
  }

  async getConnectedAccount(authorization: string): Promise<Account> {
    const accessToken = authorization.replace('Bearer ', '')
    const auth = await this.tokenProvider.unpackToken(accessToken)
    if (auth.isRefreshToken) {
      throw ProviderErrors.WrongToken()
    }
    const account = await this.accountProvider.findOneById(auth.subject)
    await this.tokenProvider.verifyToken(accessToken, account.secret)
    return account
  }
}
