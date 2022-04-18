import { Page } from '../helpers/pagination/Page'
import { Pageable } from '../helpers/pagination/Pageable'
import { Account } from '../models/account/Account'
import { Authority } from '../models/auth/Authority'

export interface IAccountProvider {
  create(account: Account): Promise<Account>
  update(account: Account): Promise<Account>
  findOneById(id: string): Promise<Account>
  findById(id: string): Promise<Account | undefined>
  findOneByEmail(email: string): Promise<Account>
  findByEmail(email: string): Promise<Account | undefined>
  findAllByIdIn(ids: string[]): Promise<Account[]>
  findAllByAuthorityPaged(p: { pageable: Pageable; authority: Authority }): Promise<Page<Account>>
  countAll(): Promise<number>
}
