import { RollType } from '../../../../../../domain/models/roll/RollType'
import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type RollSendRequest = IHttpRequest<{
  Body: RollSendRequestPayload
}>

export class RollSendRequestPayload {
  rollerName: string
  rollType: RollType
  secret: boolean
  focus: boolean
  power: boolean
  proficiency: boolean
  benediction: number
  malediction: number
  characterToHelp?: string
  picture?: string
  empiriqueRoll?: string
  resistRoll?: string

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('rollerName', S.string().required())
      .prop('rollType', S.string().required())
      .prop('secret', S.boolean().required())
      .prop('focus', S.boolean().required())
      .prop('power', S.boolean().required())
      .prop('proficiency', S.boolean().required())
      .prop('benediction', S.integer().required())
      .prop('malediction', S.integer().required())
      .prop('empiriqueRoll', S.string())
      .prop('characterToHelp', S.string())
      .prop('picture', S.string())
      .prop('resistRoll', S.string())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'RollSendRequest',
      tags: ['Roll'],
      body: this.getFluentSchema()
    }
  }
}
