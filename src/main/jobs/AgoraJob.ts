import { logger } from '../domain/helpers/logs/Logging'
import { ISessionProvider } from '../domain/providers/ISessionProvider'
import { IVisioProvider } from '../domain/providers/IVisioProvider'
import { RecurrenceRule, scheduleJob } from 'node-schedule'

export class AgoraJob {
  private visioProvider: IVisioProvider
  private sessionProvider: ISessionProvider
  private readonly logger = logger(this.constructor.name)

  constructor(p: { visioProvider: IVisioProvider; sessionProvider: ISessionProvider }) {
    this.visioProvider = p.visioProvider
    this.sessionProvider = p.sessionProvider
  }

  start(): void {
    const rule = new RecurrenceRule()
    // running job every two minutes
    // eslint-disable-next-line no-magic-numbers
    rule.hour = 6
    rule.minute = 0

    scheduleJob(rule, async () => {
      this.logger.info('AgoraTokenJob > start')
      // get list of files information from aws bucket
      const token = this.visioProvider.generateToken()
      await this.sessionProvider.updateVisioToken(token)

      this.logger.info('AgoraTokenJob > stop')
    })
  }
}
