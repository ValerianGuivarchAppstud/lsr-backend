import { BackendApplicationParams } from '../main/config/BackendApplicationParams'
import { IHttpRouter } from '../main/gateways/IHttpGateway'
import { AppDependencies, BackendApplication } from '../main/main'
import { Chance } from 'chance'
import { GenericContainer, StartedTestContainer } from 'testcontainers'

export class TestHelpers {
  application: BackendApplication
  dependencies: AppDependencies
  private mongod: StartedTestContainer
  chance: Chance.Chance

  constructor() {
    this.chance = new Chance()
  }

  /* eslint-disable no-magic-numbers */
  async start(): Promise<boolean> {
    this.mongod = await new GenericContainer('mongo:5.0.6-focal').withExposedPorts(27017).start()

    // instantiate the core
    this.application = new BackendApplication()
    this.dependencies = await this.application.init(
      new BackendApplicationParams({
        http: {
          port: this.chance.integer({ min: 30000, max: 31000 }),
          host: '127.0.0.1',
          requestMaxSize: 20_000_000
        },
        db: {
          uri: `mongodb://${this.mongod.getHost()}:${this.mongod.getMappedPort(27017)}/${this.chance.guid()}`
        }
      })
    )

    // start the core
    await this.application.start()

    return true
  }

  async stop(): Promise<boolean> {
    await this.application.stop()
    await this.mongod.stop()
    return true
  }

  getRouter(): IHttpRouter {
    return this.dependencies.httpGateway.getRouter()
  }

  async cleanUp(): Promise<boolean> {
    await this.dependencies.databaseGateway.getConnection().dropDatabase()
    return true
  }
}
