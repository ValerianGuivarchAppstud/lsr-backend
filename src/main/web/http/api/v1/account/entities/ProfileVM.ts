import { Profile } from '../../../../../../domain/models/account/Profile'
import S, { ObjectSchema } from 'fluent-json-schema'

export class ProfileVM {
  id: string

  private constructor(p: ProfileVM) {
    this.id = p.id
  }

  static from(p: { profile: Profile }): ProfileVM {
    return new ProfileVM({
      id: p.profile.id
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('id', S.string().required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: ProfileVM.name }
  }
}
