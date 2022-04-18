import { Authority } from '../../../domain/models/auth/Authority'
import { Document, Schema, PaginateModel, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface DBAccount extends Document {
  id: string
  email: string
  password: string
  authority: Authority
  secret: string
  createdDate: Date
  updatedDate: Date
}

export const AccountSchema = new Schema<DBAccount, DBAccountModelType<DBAccount>>({
  email: { type: String, required: true },
  password: { type: String },
  authority: { type: String },
  secret: { type: String },
  createdDate: { type: Date, default: new Date() },
  updatedDate: { type: Date, default: new Date() }
}).plugin(mongoosePaginate)

type DBAccountModelType<T extends Document> = PaginateModel<T>

export const DBAccountModel = model<DBAccount>('account', AccountSchema) as DBAccountModelType<DBAccount>
