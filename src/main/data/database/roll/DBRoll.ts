import { Document, Schema, PaginateModel, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface DBRoll extends Document {
  rollerName: string
  rollType: string
  date: Date
  secret: boolean
  focus: boolean
  power: boolean
  proficiency: boolean
  benediction: number
  malediction: number
  result: number[]
  success: number | null
  juge12: number | null
  juge34: number | null
  characterToHelp?: string
  picture?: string
  data?: string
  empirique?: string
  apotheose?: string
  resistRoll?: string
  helpUsed: boolean | null
}

export const DBRollSchema = new Schema<DBRoll, DBRollModelType<DBRoll>>({
  rollerName: { type: String, required: true },
  rollType: { type: String, required: true },
  date: { type: Date, required: true },
  secret: { type: Boolean, required: true },
  focus: { type: Boolean, required: true },
  power: { type: Boolean, required: true },
  proficiency: { type: Boolean, required: true },
  benediction: { type: Number, required: true },
  malediction: { type: Number, required: true },
  result: { type: [Number], required: true },
  success: { type: Number, required: false },
  juge12: { type: Number, required: false },
  juge34: { type: Number, required: false },
  characterToHelp: { type: String, required: false },
  picture: { type: String, required: false },
  data: { type: String, required: false },
  empirique: { type: String, required: false },
  apotheose: { type: String, required: false },
  resistRoll: { type: String, required: false },
  helpUsed: { type: Boolean, required: false }
}).plugin(mongoosePaginate)

type DBRollModelType<T extends Document> = PaginateModel<T>

export const DBRollModel = model<DBRoll>('roll', DBRollSchema) as DBRollModelType<DBRoll>
