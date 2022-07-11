import { Document, Schema, PaginateModel, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface DBMj extends Document {
  characters: string[]
}

export const DBMjSchema = new Schema<DBMj, DBMjModelType<DBMj>>({
  characters: [{ type: String, required: true }]
}).plugin(mongoosePaginate)

type DBMjModelType<T extends Document> = PaginateModel<T>

export const DBMjModel = model<DBMj>('mj', DBMjSchema) as DBMjModelType<DBMj>
