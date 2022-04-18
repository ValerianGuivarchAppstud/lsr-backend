import { DBAccount, DBAccountModel } from './DBAccount'
import { filterNullAndUndefinedAndEmpty } from '../../../domain/helpers/ArraysHelpers'
import { hashPromise } from '../../../domain/helpers/bcrypt/BcryptHelpers'
import { Page } from '../../../domain/helpers/pagination/Page'
import { Pageable } from '../../../domain/helpers/pagination/Pageable'
import { Account } from '../../../domain/models/account/Account'
import { Authority } from '../../../domain/models/auth/Authority'
import { IAccountProvider } from '../../../domain/providers/IAccountProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { PaginationMapper } from '../PaginationMapper'
import { v4 as randomUuid } from 'uuid'

export class DBAccountProvider implements IAccountProvider {
  private static toAccount(doc: DBAccount): Account {
    return new Account({
      id: doc.id,
      email: doc.email,
      authority: doc.authority,
      password: doc.password,
      secret: doc.secret,
      createdDate: doc.createdDate,
      updatedDate: doc.updatedDate
    })
  }

  private static fromAccount(doc: Account): DBAccount {
    return {
      id: doc.id,
      email: doc.email,
      password: doc.password,
      secret: doc.secret,
      authority: doc.authority,
      createdDate: doc.createdDate,
      updatedDate: new Date()
    } as DBAccount
  }

  async create(account: Account): Promise<Account> {
    // Check if account already exists
    const acc = await DBAccountModel.findOne({ email: account.email }).exec()
    if (acc) {
      throw ProviderErrors.EmailAlreadyUsed(account.email)
    }
    const created = await DBAccountModel.create(
      DBAccountProvider.fromAccount({
        ...account,
        // eslint-disable-next-line no-magic-numbers
        password: await hashPromise(account.password ?? '', 10),
        secret: randomUuid()
      })
    )
    return DBAccountProvider.toAccount(created)
  }

  async update(account: Account): Promise<Account> {
    const accountEmail = await DBAccountModel.findOne({ email: account.email }).exec()
    if (accountEmail && accountEmail.id != account.id) {
      throw ProviderErrors.AccountAlreadyCreated()
    }
    return DBAccountModel.findByIdAndUpdate(account.id, DBAccountProvider.fromAccount(account), { new: true })
      .exec()
      .then((result) => {
        if (!result) {
          throw ProviderErrors.EntityNotFound(Account.name)
        }
        return DBAccountProvider.toAccount(result)
      })
  }

  async findOneByEmail(email: string): Promise<Account> {
    const account = await DBAccountModel.findOne({ email: email }).exec()
    if (!account) {
      throw ProviderErrors.EntityNotFound(Account.name)
    }
    return DBAccountProvider.toAccount(account)
  }

  async findByEmail(email: string): Promise<Account | undefined> {
    const account = await DBAccountModel.findOne({ email: email }).exec()
    if (!account) {
      return undefined
    }
    return DBAccountProvider.toAccount(account)
  }

  async findOneById(id: string): Promise<Account> {
    const account = await DBAccountModel.findById(id).exec()
    if (!account) {
      throw ProviderErrors.EntityNotFound(Account.name)
    }
    return DBAccountProvider.toAccount(account)
  }

  async findById(id: string): Promise<Account | undefined> {
    const account = await DBAccountModel.findById(id).exec()
    if (!account) {
      return undefined
    }
    return DBAccountProvider.toAccount(account)
  }

  async countAll(): Promise<number> {
    return DBAccountModel.countDocuments().exec()
  }

  async findAllByAuthorityPaged(p: { pageable: Pageable; authority: Authority }): Promise<Page<Account>> {
    const result = await DBAccountModel.paginate({ authority: p.authority }, PaginationMapper.fromPageable(p.pageable))
    const translated = { ...result, docs: result.docs.map((doc) => DBAccountProvider.toAccount(doc)) }
    return PaginationMapper.toPage<Account>(translated)
  }

  async findAllByIdIn(ids: string[]): Promise<Account[]> {
    const results = await DBAccountModel.find({ _id: { $in: ids.filter(filterNullAndUndefinedAndEmpty()) } }).exec()
    return results.map((entity) => DBAccountProvider.toAccount(entity))
  }
}
