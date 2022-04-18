import { mergeNonNull } from '../helpers/EntityUtils'
import { logger } from '../helpers/logs/Logging'
import { Account } from '../models/account/Account'
import { Profile } from '../models/account/Profile'
import { IAccountProvider } from '../providers/IAccountProvider'
import { IProfileProvider } from '../providers/IProfileProvider'

export class AccountService {
  private accountProvider: IAccountProvider
  private profileProvider: IProfileProvider
  private readonly logger = logger(this.constructor.name)

  constructor(p: { accountProvider: IAccountProvider; profileProvider: IProfileProvider }) {
    this.accountProvider = p.accountProvider
    this.profileProvider = p.profileProvider
  }

  async findOneAccountById(id: string): Promise<Account> {
    return this.accountProvider.findOneById(id)
  }

  async updateAccount(p: { account: Account; accountUpdate: Partial<Account> }): Promise<Account> {
    const account = await this.accountProvider.findOneById(p.account.id)
    this.logger.info(`updateAccount > Account[${account.id}] > update`)
    return this.accountProvider.update(mergeNonNull(account, p.accountUpdate))
  }

  async findOneProfileByAccountId(accountId: string): Promise<Profile> {
    return this.profileProvider.findOneByAccountId(accountId)
  }

  async findOneProfileById(id: string): Promise<Profile> {
    return this.profileProvider.findOneById(id)
  }

  async updateProfile(p: { profile: Profile; profileUpdate: Partial<Profile> }): Promise<Profile> {
    const profile = await this.profileProvider.findOneByAccountId(p.profile.accountId)
    this.logger.info(`updateProfile > Profile[${profile.id}] > update`)
    return this.profileProvider.update(mergeNonNull(profile, p.profileUpdate))
  }
}
