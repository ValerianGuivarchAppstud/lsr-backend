import { Document, Schema, PaginateModel, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface DBProfile extends Document {
  id: string
  accountId: string
  createdDate: Date
  updatedDate: Date
}

export const DBProfileSchema = new Schema<DBProfile, DBProfileModelType<DBProfile>>({
  accountId: { type: String, required: true },
  createdDate: { type: Date, default: new Date() },
  updatedDate: { type: Date, default: new Date() }
}).plugin(mongoosePaginate)

type DBProfileModelType<T extends Document> = PaginateModel<T>

export const DBProfileModel = model<DBProfile>('profile', DBProfileSchema) as DBProfileModelType<DBProfile>
