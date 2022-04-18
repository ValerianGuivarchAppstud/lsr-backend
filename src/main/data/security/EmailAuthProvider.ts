import { AuthRequest } from '../../domain/models/auth/AuthRequest'
import { AuthType } from '../../domain/models/auth/AuthType'
import { IAccountProvider } from '../../domain/providers/IAccountProvider'
import { IAuthenticationProvider } from '../../domain/providers/IAuthenticationProvider'
import { compareSync } from 'bcrypt'

export class EmailAuthProvider implements IAuthenticationProvider {
  private accountProvider: IAccountProvider

  constructor(accountProvider: IAccountProvider) {
    this.accountProvider = accountProvider
  }

  supports(type: AuthType): boolean {
    return type === AuthType.MAIL
  }

  async verifyLogin(request: AuthRequest): Promise<boolean> {
    const account = await this.accountProvider.findByEmail(request.email)
    return !(!account?.password || !compareSync(request.password, account.password))
  }
}
