import { mergeNonNull } from '../../helpers/EntityUtils'
import { logger } from '../../helpers/logs/Logging'
import { Page } from '../../helpers/pagination/Page'
import { Pageable } from '../../helpers/pagination/Pageable'
import { Account } from '../../models/account/Account'
import { Profile } from '../../models/account/Profile'
import { Authority } from '../../models/auth/Authority'
import { IAccountProvider } from '../../providers/IAccountProvider'
import { IProfileProvider } from '../../../../../../lsr-backend/src/main/domain/providers/IProfileProvider'

export class AdminAccountService {
  private readonly logger = logger(this.constructor.name)
  private accountProvider: IAccountProvider
  private profileProvider: IProfileProvider

  constructor(p: { accountProvider: IAccountProvider; profileProvider: IProfileProvider }) {
    this.accountProvider = p.accountProvider
    this.profileProvider = p.profileProvider
  }

  async create(p: { account: Account }): Promise<Account> {
    const account = await this.accountProvider.create(p.account)
    const profile = await this.profileProvider.create(new Profile({ accountId: account.id }))
    this.logger.info(`create > Account[${account.id}] > Profile[${profile.id}]`)
    return account
  }

  async update(p: { account: Account; accountUpdate: Partial<Account> }): Promise<Account> {
    const account = await this.accountProvider.findOneById(p.account.id)
    const res = await this.accountProvider.update(mergeNonNull(account, p.accountUpdate))
    this.logger.info(`update > Account[${res.id}]`)
    return res
  }

  async findOneById(id: string): Promise<Account> {
    return this.accountProvider.findOneById(id)
  }

  async findAllByIdIn(ids: string[]): Promise<Account[]> {
    return this.accountProvider.findAllByIdIn(ids)
  }

  async findAllByAuthorityPaged(p: { pageable: Pageable; authority: Authority }): Promise<Page<Account>> {
    return this.accountProvider.findAllByAuthorityPaged({ authority: p.authority, pageable: p.pageable })
  }
}
