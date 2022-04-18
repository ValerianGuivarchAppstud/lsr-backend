import { BackendApplicationParams } from './config/BackendApplicationParams'
import { DBAccountProvider } from './data/database/account/DBAccountProvider'
import { MongoGateway } from './data/database/MongoGateway'
import { DBProfileProvider } from './data/database/profile/DBProfileProvider'
import { EmailAuthProvider } from './data/security/EmailAuthProvider'
import { JwtTokenProvider } from './data/security/JwtTokenProvider'
import { logger } from './domain/helpers/logs/Logging'
import { AccountService } from './domain/services/AccountService'
import { AdminAccountService } from './domain/services/admin/AdminAccountService'
import { AuthenticationService } from './domain/services/AuthenticationService'
import { IHttpGateway, IHttpGatewayOptions } from './gateways/IHttpGateway'
import { IMongoGateway } from './gateways/IMongoGateway'
import { AccountController } from './web/http/api/v1/account/AccountController'
import { AdminAccountController } from './web/http/api/v1/admin/accounts/AdminAccountController'
import { AdminAuthenticationController } from './web/http/api/v1/admin/auth/AuthenticationController'
import { AuthenticationController } from './web/http/api/v1/auth/AuthenticationController'
import { StatusController } from './web/http/api/v1/utils/StatusController'
import { HttpGateway } from './web/http/HttpGateway'
import { config } from 'dotenv'

export class BackendApplication {
  private readonly logger = logger(this.constructor.name)
  private dependencies: AppDependencies

  async init(p: BackendApplicationParams): Promise<AppDependencies> {
    // load environment variables
    config()

    /**
     * GATEWAYS
     */
    const database = new MongoGateway({ uri: p.db.uri, proxyUri: p.db.proxyUri })

    /**
     * PROVIDERS
     */
    const accountProvider = new DBAccountProvider()
    const profileProvider = new DBProfileProvider()
    const tokenProvider = new JwtTokenProvider({ jwtSecret: p.jwt.secret })
    const emailAuthProvider = new EmailAuthProvider(accountProvider)

    /**
     * SERVICES
     */
    const authenticationService = new AuthenticationService({
      accountProvider: accountProvider,
      profileProvider: profileProvider,
      tokenProvider: tokenProvider,
      authProviders: [emailAuthProvider]
    })

    const accountService = new AccountService({
      accountProvider: accountProvider,
      profileProvider: profileProvider
    })

    const adminAccountService = new AdminAccountService({
      accountProvider: accountProvider,
      profileProvider: profileProvider
    })

    /**
     * CONTROLLERS
     */
    const http = new HttpGateway({
      authService: authenticationService,
      httpPort: p.http.port,
      httpHost: p.http.host,
      requestMaxSize: p.http.requestMaxSize
    })
    new AuthenticationController({ httpGateway: http, service: authenticationService })
    new AccountController({ httpGateway: http, accountService: accountService })
    new StatusController({ httpGateway: http, accountProvider: accountProvider, managementSecret: p.management.secret })

    new AdminAuthenticationController({
      httpGateway: http,
      authenticationService: authenticationService,
      // eslint-disable-next-line no-process-env
      enabledRegisterEndpoint: ['local', 'develop', 'staging', 'test'].includes(`${process.env.NODE_ENV}`)
    })
    new AdminAccountController({ httpGateway: http, accountService: adminAccountService })

    this.dependencies = new AppDependencies({
      databaseGateway: database,
      httpGateway: http
    })
    return this.dependencies
  }

  async start(httpOptions?: IHttpGatewayOptions): Promise<boolean> {
    await this.dependencies.httpGateway.startWithOptions(httpOptions)
    await this.dependencies.databaseGateway.start()
    // eslint-disable-next-line no-process-env
    this.logger.info(`start > started with environment ${process.env.NODE_ENV}`)
    return Promise.resolve(true)
  }

  async stop(): Promise<boolean> {
    await this.dependencies.httpGateway.stop()
    await this.dependencies.databaseGateway.stop()
    return Promise.resolve(true)
  }
}

export class AppDependencies {
  httpGateway: IHttpGateway
  databaseGateway: IMongoGateway

  constructor(p: AppDependencies) {
    this.httpGateway = p.httpGateway
    this.databaseGateway = p.databaseGateway
  }
}
