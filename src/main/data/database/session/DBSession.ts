import { Document, Schema, PaginateModel, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface DBSession extends Document {
  characters: string[]
  visioToken: string
  round: string
  charactersBattleAllies: string[]
  charactersBattleEnnemies: string[]
  relanceMj: number
  chaos: number
}

export const DBSessionSchema = new Schema<DBSession, DBSessionModelType<DBSession>>({
  characters: [{ type: String, required: true }],
  visioToken: { type: String, required: true },
  charactersBattleAllies: [{ type: String, required: true }],
  charactersBattleEnnemies: [{ type: String, required: true }],
  round: { type: String, required: true },
  relanceMj: { type: Number, required: true },
  chaos: { type: Number, required: true }
}).plugin(mongoosePaginate)

type DBSessionModelType<T extends Document> = PaginateModel<T>

export const DBSessionModel = model<DBSession>('Session', DBSessionSchema) as DBSessionModelType<DBSession>
