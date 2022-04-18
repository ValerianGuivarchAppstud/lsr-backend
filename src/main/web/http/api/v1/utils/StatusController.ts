import { EnvVarVM, StatusVM } from './entities/StatusVM'
import { GetStatusRequest, GetStatusRequestParams } from './requests/GetStatusRequest'
import { IAccountProvider } from '../../../../../domain/providers/IAccountProvider'
import { HttpRequestMethod, IHttpGateway, IHttpRequest, IHttpResponse } from '../../../../../gateways/IHttpGateway'
import { HttpRouteIdentifiers } from '../../../HttpRouteIdentifiers'
import axios from 'axios'
import dayjs from 'dayjs'
import { constants } from 'http2'

export class StatusController {
  private readonly accountProvider: IAccountProvider
  private readonly managementSecret?: string

  constructor(p: { httpGateway: IHttpGateway; managementSecret?: string; accountProvider: IAccountProvider }) {
    this.accountProvider = p.accountProvider
    this.managementSecret = p.managementSecret

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.GET_STATUS,
      method: HttpRequestMethod.GET,
      route: `/api/v1/status`,
      useAuth: [],
      reqValidator: GetStatusRequestParams.getValidationSchema(),
      resValidator: StatusVM.getValidationSchema(),
      bind: this.status.bind(this)
    })

    p.httpGateway.addRoute({
      id: HttpRouteIdentifiers.GET_ROOT,
      method: HttpRequestMethod.GET,
      route: `/`,
      useAuth: [],
      reqValidator: undefined,
      resValidator: undefined,
      bind: this.getRoot.bind(this)
    })
  }

  async getRoot(request: IHttpRequest<unknown>, reply: IHttpResponse): Promise<void> {
    reply.code(constants.HTTP_STATUS_OK).header('Content-Type', 'application/json; charset=utf-8').send('')
  }

  private static async getPublicIp(): Promise<string> {
    try {
      const ownIp = await axios.get('https://ifconfig.io/ip')
      return ownIp.data?.trim() ?? ''
    } catch (e) {
      return ''
    }
  }

  private static getInstanceId(): string {
    // eslint-disable-next-line no-process-env
    return process.env.INSTANCE_ID ?? process.env.HOSTNAME ?? ''
  }

  private static getStartedAt(): string {
    return dayjs().subtract(process.uptime(), 'second').format()
  }

  private static getVersion(): string {
    // eslint-disable-next-line no-process-env
    return process.env.RELEASE ?? ''
  }

  private async testDatabaseConnection(): Promise<boolean> {
    try {
      await this.accountProvider.countAll()
      return true
    } catch (e) {
      return false
    }
  }

  async status(request: GetStatusRequest, reply: IHttpResponse): Promise<void> {
    // this is to test the mongoDB connexion, use a low impact request like a count()
    const dbIsUp = await this.testDatabaseConnection()
    const isManagementRequest =
      request.query.managementSecret && request.query.managementSecret === this.managementSecret

    const statusVm = new StatusVM({
      status: 'UP',
      instanceId: StatusController.getInstanceId(),
      instanceIp: undefined,
      version: StatusController.getVersion(),
      startedAt: StatusController.getStartedAt(),
      components: {
        database: {
          status: dbIsUp ? 'UP' : 'DOWN'
        }
      }
    })

    if (isManagementRequest) {
      try {
        statusVm.instanceIp = await StatusController.getPublicIp()
        // eslint-disable-next-line no-process-env
        statusVm.env = Object.keys(process.env).map((envVar) => {
          return {
            key: envVar,
            // eslint-disable-next-line no-process-env
            value: process.env[envVar]
          } as EnvVarVM
        })
      } catch (e) {
        // no logs
      }
    }

    try {
      statusVm.status = 'UP'
      reply.code(constants.HTTP_STATUS_OK).header('Content-Type', 'application/json; charset=utf-8').send(statusVm)
    } catch (e) {
      statusVm.status = 'DOWN'
      reply
        .code(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(statusVm)
    }
  }
}
