import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'
import S, { ObjectSchema } from 'fluent-json-schema'

export type MjAddCharacterFromTemplateRequest = IHttpRequest<{
  Body: MjAddCharacterFromTemplateRequestPayload
}>

export class MjAddCharacterFromTemplateRequestPayload {
  templateName: string
  customName: string
  level: number
  number: number

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('templateName', S.string().required())
      .prop('customName', S.string().required())
      .prop('level', S.number().required())
      .prop('number', S.number().required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      ...this.getFluentSchema().valueOf(),
      description: 'MjAddCharacterFromTemplateRequest',
      tags: ['Mj']
    }
  }
}
