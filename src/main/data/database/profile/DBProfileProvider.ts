import { DBProfile, DBProfileModel } from './DBProfile'
import { filterNullAndUndefinedAndEmpty } from '../../../domain/helpers/ArraysHelpers'
import { Profile } from '../../../domain/models/account/Profile'
import { IProfileProvider } from '../../../domain/providers/IProfileProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'

export class DBProfileProvider implements IProfileProvider {
  private static toProfile(doc: DBProfile): Profile {
    return new Profile({
      id: doc.id,
      accountId: doc.accountId,
      createdDate: doc.createdDate,
      updatedDate: doc.updatedDate
    })
  }

  private static fromProfile(profile: Profile): DBProfile {
    return {
      id: profile.id,
      accountId: profile.accountId,
      createdDate: profile.createdDate,
      updatedDate: new Date()
    } as DBProfile
  }

  async create(profile: Profile): Promise<Profile> {
    return DBProfileProvider.toProfile(await DBProfileModel.create(DBProfileProvider.fromProfile(profile)))
  }

  async findOneByAccountId(accountId: string): Promise<Profile> {
    const profile = await DBProfileModel.findOne({ accountId: accountId }).exec()
    if (!profile) {
      throw ProviderErrors.EntityNotFound(Profile.name)
    }
    return DBProfileProvider.toProfile(profile)
  }

  async findOneById(id: string): Promise<Profile> {
    const profile = await DBProfileModel.findById(id).exec()
    if (!profile) {
      throw ProviderErrors.EntityNotFound(Profile.name)
    }
    return DBProfileProvider.toProfile(profile)
  }

  async update(profile: Profile): Promise<Profile> {
    const newProfile = await DBProfileModel.findByIdAndUpdate(profile.id, DBProfileProvider.fromProfile(profile), {
      new: true
    }).exec()
    if (!newProfile) {
      throw ProviderErrors.EntityNotFound(Profile.name)
    }

    return DBProfileProvider.toProfile(newProfile)
  }

  async findAllByIdIn(ids: string[]): Promise<Profile[]> {
    const results = await DBProfileModel.find({
      _id: { $in: ids.filter(filterNullAndUndefinedAndEmpty()) }
    }).exec()
    return results.map((entity) => DBProfileProvider.toProfile(entity))
  }

  async delete(id: string): Promise<Profile> {
    const profile = await DBProfileModel.findByIdAndDelete(id).exec()
    if (!profile) {
      throw ProviderErrors.EntityNotFound(Profile.name)
    }
    return DBProfileProvider.toProfile(profile)
  }
}
