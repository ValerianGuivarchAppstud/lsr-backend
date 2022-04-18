import { AuthRequest } from '../models/auth/AuthRequest'
import { AuthType } from '../models/auth/AuthType'

export interface IAuthenticationProvider {
  verifyLogin(request: AuthRequest): Promise<boolean>

  supports(type: AuthType): boolean
}
