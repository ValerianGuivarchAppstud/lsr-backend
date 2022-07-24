import { Document, Schema, PaginateModel, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface DBCharacter extends Document {
  name: string
  classe: string
  bloodline: string
  apotheose: string
  apotheoseImprovement?: string
  apotheoseImprovementList: string[]
  chair: number
  esprit: number
  essence: number
  pv: number
  pvMax: number
  pf: number
  pfMax: number
  pp: number
  ppMax: number
  dettes: number
  arcanes: number
  arcanesMax: number
  niveau: number
  lux: string
  umbra: string
  secunda: string
  notes: string
  category: string
  genre: string
  relance: number
  playerName?: string
  picture?: string
  pictureApotheose?: string
  background?: string
  buttonColor?: string
  textColor?: string
}

export const DBCharacterSchema = new Schema<DBCharacter, DBCharacterModelType<DBCharacter>>({
  name: { type: String, required: true },
  classe: { type: String, required: true },
  bloodline: { type: String, required: true },
  apotheose: { type: String, required: true },
  apotheoseImprovement: { type: String, required: false },
  apotheoseImprovementList: [{ type: String, required: true }],
  chair: { type: Number, required: true },
  esprit: { type: Number, required: true },
  essence: { type: Number, required: true },
  pv: { type: Number, required: true },
  pvMax: { type: Number, required: true },
  pf: { type: Number, required: true },
  pfMax: { type: Number, required: true },
  pp: { type: Number, required: true },
  ppMax: { type: Number, required: true },
  dettes: { type: Number, required: true },
  arcanes: { type: Number, required: true },
  arcanesMax: { type: Number, required: true },
  niveau: { type: Number, required: true },
  lux: { type: String, required: true },
  umbra: { type: String, required: true },
  secunda: { type: String, required: true },
  notes: { type: String, required: true },
  category: { type: String, required: true },
  genre: { type: String, required: true },
  relance: { type: Number, required: true },
  playerName: { type: String, required: false },
  picture: { type: String, required: false },
  pictureApotheose: { type: String, required: false },
  background: { type: String, required: false },
  buttonColor: { type: String, required: false },
  textColor: { type: String, required: false }
}).plugin(mongoosePaginate)

type DBCharacterModelType<T extends Document> = PaginateModel<T>

export const DBCharacterModel = model<DBCharacter>('characters', DBCharacterSchema) as DBCharacterModelType<DBCharacter>
