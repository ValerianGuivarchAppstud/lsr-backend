import { Document, Schema, PaginateModel, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface DBPlayer extends Document {
  relance: number
  playerName: string
}

export const DBPlayerSchema = new Schema<DBPlayer, DBPlayerModelType<DBPlayer>>({
  relance: { type: Number, required: true },
  playerName: { type: String, required: true }
}).plugin(mongoosePaginate)

type DBPlayerModelType<T extends Document> = PaginateModel<T>

export const DBPlayerModel = model<DBPlayer>('players', DBPlayerSchema) as DBPlayerModelType<DBPlayer>
