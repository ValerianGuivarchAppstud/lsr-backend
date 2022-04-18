import { Authority } from '../auth/Authority'

export class Account {
  id: string
  email: string
  password: string // hashed
  createdDate: Date
  updatedDate: Date
  secret: string
  authority: Authority

  constructor(p: Partial<Account>) {
    this.id = p.id ?? ''
    this.email = p.email ?? ''
    this.password = p.password ?? ''
    this.createdDate = p.createdDate ?? new Date()
    this.updatedDate = p.updatedDate ?? new Date()
    this.secret = p.secret ?? ''
    this.authority = p.authority ?? Authority.USER
  }
}
