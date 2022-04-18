import { IHttpRequest } from '../../../../../../../gateways/IHttpGateway'

export type AdminGetOneAccountRequest = IHttpRequest<{
  Params: { id: string }
}>

export const AdminGetOneAccountRequestSchema = {
  description: 'AdminGetOneAccountRequest',
  tags: ['Admin > Accounts']
}
