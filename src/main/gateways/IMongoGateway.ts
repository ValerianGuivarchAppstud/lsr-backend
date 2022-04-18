import { IGateway } from './IGateway'
import { Document, PaginateModel, Connection, Schema, SchemaDefinition } from 'mongoose'

export interface IMongoGateway extends IGateway {
  getConnection(): IMongoConnection
  getDefaultDbName(): string
  getInfos(): string
}

export type IMongoSchemaDefinition = SchemaDefinition
export type IMongoSchema<T extends IMongoDocument, V extends IPaginateModel<T>> = Schema<T, V>
export type IMongoDocument = Document
export class IMongoConnection extends Connection {}

export type IPaginateModel<T extends IMongoDocument> = PaginateModel<T>

export const StringNotNull = {
  validator: (v: string): boolean => {
    return v?.length >= 0
  }
}
