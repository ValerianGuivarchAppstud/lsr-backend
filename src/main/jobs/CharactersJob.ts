import { logger } from '../domain/helpers/logs/Logging'
import { Category } from '../domain/models/character/Category'
import { ICharacterProvider } from '../domain/providers/ICharacterProvider'
import { RecurrenceRule, scheduleJob } from 'node-schedule'

export class CharacterJob {
  private characterProvider: ICharacterProvider
  private readonly logger = logger(this.constructor.name)

  constructor(p: { characterProvider: ICharacterProvider }) {
    this.characterProvider = p.characterProvider
  }

  start(): void {
    const rule = new RecurrenceRule()
    // running job every two minutes
    // eslint-disable-next-line no-magic-numbers
    rule.hour = 11
    rule.minute = 0

    scheduleJob(rule, async () => {
      this.logger.info('CharacterTokenJob > start')
      // get list of files information from aws bucket
      const tempoList = (await this.characterProvider.findAll()).filter((c) => c.category === Category.TEMPO)
      for (const tempo of tempoList) {
        this.characterProvider.delete(tempo.name)
      }

      this.logger.info('CharacterTokenJob > stop')
    })
  }
}
