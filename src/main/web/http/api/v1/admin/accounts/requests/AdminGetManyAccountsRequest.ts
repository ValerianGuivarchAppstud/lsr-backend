import { IHttpRequest } from '../../../../../../../gateways/IHttpGateway'

export type AdminGetManyAccountsRequest = IHttpRequest<{
  // for some reason, using a field name `ids` doesn't work anymore
  Querystring: { 'ids[]': string[] | string }
}>

export const AdminGetManyAccountsRequestSchema = {
  description: 'AdminGetManyAccountsRequest',
  tags: ['Admin > Accounts']
}
