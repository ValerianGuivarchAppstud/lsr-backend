import { logger } from '../domain/helpers/logs/Logging'
import { IMjProvider } from '../domain/providers/IMjProvider'
import { IVisioProvider } from '../domain/providers/IVisioProvider'
import { RecurrenceRule, scheduleJob } from 'node-schedule'

export class AgoraJob {
  private visioProvider: IVisioProvider
  private mjProvider: IMjProvider
  private readonly logger = logger(this.constructor.name)

  constructor(p: { visioProvider: IVisioProvider; mjProvider: IMjProvider }) {
    this.visioProvider = p.visioProvider
    this.mjProvider = p.mjProvider
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
      await this.mjProvider.updateVisioToken(token)

      this.logger.info('AgoraTokenJob > stop')
    })
  }
}
