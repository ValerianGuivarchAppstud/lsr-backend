import { logger } from '../../domain/helpers/logs/Logging'
import { IMongoConnection, IMongoGateway } from '../../gateways/IMongoGateway'
import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export class MongoGateway implements IMongoGateway {
  private readonly uri: string
  private readonly proxyUri?: string
  private readonly retries: number
  private readonly retryDelay: number
  private readonly logger = logger(this.constructor.name)

  constructor(p: { uri: string; proxyUri?: string }) {
    this.uri = p.uri
    this.proxyUri = p.proxyUri
    this.retries = 3
    this.retryDelay = 3000
  }

  private async connect(tries = 0): Promise<boolean> {
    try {
      /**
       * Connection ready state
       *
       * - 0 = disconnected
       * - 1 = connected
       * - 2 = connecting
       * - 3 = disconnecting
       */
      if (mongoose.connection.readyState === 1) {
        this.logger.warn(`start > already connected`)
        return true
      }

      // eslint-disable-next-line no-process-env
      if (process.env.DEBUG_MONGO && process.env.DEBUG_MONGO === 'true') {
        mongoose.set('debug', true)
      }

      const opts: mongoose.ConnectOptions = {}
      if (this.proxyUri) {
        const proxyConfig = new URL(this.proxyUri)
        opts.proxyHost = proxyConfig.hostname
        opts.proxyUsername = proxyConfig.username
        opts.proxyPassword = proxyConfig.password
        opts.proxyPort = Number(proxyConfig.port)
        this.logger.info(`start > use proxy ${opts.proxyHost}:${opts.proxyPort}`)
      }

      await mongoose
        .connect(this.uri, opts)
        .then((c) => {
          this.logger.info(
            `start > connected to ${c.connection.host}:${c.connection.port}/${c.connection.db.databaseName}`
          )
        })
        .catch((e) => {
          throw e
        })

      mongoose.plugin(mongoosePaginate)

      // allow empty string when a field is flagged as required
      // https://github.com/Automattic/mongoose/issues/7150
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Str = mongoose.Schema.Types.String as any
      Str.checkRequired((v) => v != null)
      return true
    } catch (e) {
      this.logger.error(e, `start > unable to connect to mongo : ${e}`)
      if (tries < this.retries) {
        tries++
        this.logger.error(`start > waiting ${this.retryDelay} ms before retrying... (retry ${tries}/${this.retries})`)
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay, ''))
        return this.connect(tries)
      }
      throw e
    }
  }

  async start(): Promise<boolean> {
    return this.connect()
  }

  async stop(): Promise<boolean> {
    return mongoose
      .disconnect()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  getConnection(): IMongoConnection {
    return mongoose.connection
  }

  getDefaultDbName(): string {
    return mongoose.connection.db.databaseName
  }

  getInfos(): string {
    return mongoose.connection.host
  }
}
