import { BackendApplicationParams } from './config/BackendApplicationParams'
import { DBCharacterProvider } from './data/database/character/DBCharacterProvider'
import { DBMjProvider } from './data/database/mj/DBMjProvider'
import { MongoGateway } from './data/database/MongoGateway'
import { DBRollProvider } from './data/database/roll/DBRollProvider'
import { logger } from './domain/helpers/logs/Logging'
import { CharacterService } from './domain/services/CharacterService'
import { MjService } from './domain/services/MjService'
import { RollService } from './domain/services/RollService'
import { IHttpGateway, IHttpGatewayOptions } from './gateways/IHttpGateway'
import { IMongoGateway } from './gateways/IMongoGateway'
import { CharacterController } from './web/http/api/v1/character/CharacterController'
import { HealController } from './web/http/api/v1/heal/HealController'
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
    const characterProvider = new DBCharacterProvider()
    const mjProvider = new DBMjProvider()
    const rollProvider = new DBRollProvider()

    /**
     * SERVICES
     */
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
    new CharacterController({
      httpGateway: http,
      characterService: characterService,
      rollService: rollService,
      mjService: mjService
    })
    new HealController({
      httpGateway: http,
      characterService: characterService,
      rollService: rollService,
      mjService: mjService
    })
    new MjController({
      httpGateway: http,
      mjService: mjService,
      characterService: characterService,
      rollService: rollService
    })
    new RollController({ httpGateway: http, rollService: rollService })
    new SettingsController({ httpGateway: http, characterService: characterService, mjService: mjService })
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
