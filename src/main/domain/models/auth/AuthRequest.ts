import { AuthType } from './AuthType'

export class AuthRequest {
  type: AuthType
  email: string
  password: string

  constructor(type: AuthType, email: string, password: string) {
    this.type = type
    this.email = email
    this.password = password
  }
}
