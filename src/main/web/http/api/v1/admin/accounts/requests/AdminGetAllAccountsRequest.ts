import { IPageableParams } from '../../../../../../../domain/helpers/pagination/Pageable'
import { IHttpRequest } from '../../../../../../../gateways/IHttpGateway'

export type AdminGetAllAccountsRequest = IHttpRequest<{
  Querystring: AdminGetAllAccountsRequestParams
}>

export type AdminGetAllAccountsRequestParams = IPageableParams

export const AdminGetAllAccountsRequestSchema = {
  description: 'AdminGetAllAccountsRequest',
  tags: ['Admin > Accounts']
}
