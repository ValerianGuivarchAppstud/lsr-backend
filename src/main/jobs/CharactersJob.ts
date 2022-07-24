import { logger } from '../domain/helpers/logs/Logging'
import { Category } from '../domain/models/character/Category'
import { ICharacterProvider } from '../domain/providers/ICharacterProvider'
import { IRollProvider } from '../domain/providers/IRollProvider'
import { RecurrenceRule, scheduleJob } from 'node-schedule'

export class CleanJob {
  private characterProvider: ICharacterProvider
  private rollProvider: IRollProvider
  private readonly logger = logger(this.constructor.name)

  constructor(p: { characterProvider: ICharacterProvider; rollProvider: IRollProvider }) {
    this.characterProvider = p.characterProvider
    this.rollProvider = p.rollProvider
  }

  start(): void {
    const rule = new RecurrenceRule()
    // running job every two minutes
    // eslint-disable-next-line no-magic-numbers
    rule.hour = 11
    rule.minute = 0

    scheduleJob(rule, async () => {
      this.logger.info('CleanJob > start')
      // get list of files information from aws bucket
      const tempoList = (await this.characterProvider.findAll()).filter((c) => c.category === Category.TEMPO)
      for (const tempo of tempoList) {
        this.characterProvider.delete(tempo.name)
      }
      await this.rollProvider.deleteAll()
      this.logger.info('CleanJob > stop')
    })
  }
}
