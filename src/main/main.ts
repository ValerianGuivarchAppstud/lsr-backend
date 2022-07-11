import { BackendApplicationParams } from './config/BackendApplicationParams'
import { DBAccountProvider } from './data/database/account/DBAccountProvider'
import { DBCharacterProvider } from './data/database/character/DBCharacterProvider'
import { DBMjProvider } from './data/database/mj/DBMjProvider'
import { MongoGateway } from './data/database/MongoGateway'
import { DBProfileProvider } from './data/database/profile/DBProfileProvider'
import { DBRollProvider } from './data/database/roll/DBRollProvider'
import { EmailAuthProvider } from './data/security/EmailAuthProvider'
import { JwtTokenProvider } from './data/security/JwtTokenProvider'
import { logger } from './domain/helpers/logs/Logging'
import { AccountService } from './domain/services/AccountService'
import { AdminAccountService } from './domain/services/admin/AdminAccountService'
import { AuthenticationService } from './domain/services/AuthenticationService'
import { CharacterService } from './domain/services/CharacterService'
import { MjService } from './domain/services/MjService'
import { RollService } from './domain/services/RollService'
import { IHttpGateway, IHttpGatewayOptions } from './gateways/IHttpGateway'
import { IMongoGateway } from './gateways/IMongoGateway'
import { AccountController } from './web/http/api/v1/account/AccountController'
import { AdminAccountController } from './web/http/api/v1/admin/accounts/AdminAccountController'
import { AdminAuthenticationController } from './web/http/api/v1/admin/auth/AuthenticationController'
import { AuthenticationController } from './web/http/api/v1/auth/AuthenticationController'
import { CharacterController } from './web/http/api/v1/character/CharacterController'
import { MjController } from './web/http/api/v1/mj/MjController'
import { RollController } from './web/http/api/v1/roll/RollController'
import { SettingsController } from './web/http/api/v1/settings/SettingsController'
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
    const characterProvider = new DBCharacterProvider()
    const mjProvider = new DBMjProvider()
    const rollProvider = new DBRollProvider()

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
    const characterService = new CharacterService({
      characterProvider: characterProvider
    })
    const mjService = new MjService({
      mjProvider: mjProvider,
      characterProvider: characterProvider
    })
    const rollService = new RollService({
      rollProvider: rollProvider,
      characterProvider: characterProvider
    })

    /**
     * CONTROLLERS
     */
    const http = new HttpGateway({
      httpPort: p.http.port,
      httpHost: p.http.host,
      requestMaxSize: p.http.requestMaxSize,
      rollService: rollService
    })
    new AdminAuthenticationController({
      httpGateway: http,
      authenticationService: authenticationService,
      enabledRegisterEndpoint: true
    })
    new AdminAccountController({ httpGateway: http, accountService: adminAccountService })
    new AuthenticationController({ httpGateway: http, service: authenticationService })
    new AccountController({ httpGateway: http, accountService: accountService })
    new CharacterController({ httpGateway: http, characterService: characterService, rollService: rollService })
    new MjController({
      httpGateway: http,
      mjService: mjService,
      characterService: characterService,
      rollService: rollService
    })
    new RollController({ httpGateway: http, rollService: rollService })
    new SettingsController({ httpGateway: http, characterService: characterService })
    new StatusController({
      httpGateway: http,
      characterProvider: characterProvider,
      managementSecret: p.management.secret
    })

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
