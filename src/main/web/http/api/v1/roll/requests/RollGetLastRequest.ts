import { IHttpRequest } from '../../../../../../gateways/IHttpGateway'

export type RollGetLastRequest = IHttpRequest<never>

export class RollGetLastRequestPayload {
  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'RollGetLastRequest',
      tags: ['Roll']
    }
  }
}
