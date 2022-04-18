import { IGateway } from './IGateway'
import { Authority } from '../domain/models/auth/Authority'
import { HttpRouteIdentifiers } from '../web/http/HttpRouteIdentifiers'
import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify'
import { Multipart } from 'fastify-multipart'

export interface IHttpGatewayOptions {
  disabledRoutes?: HttpRouteIdentifiers[]
}

export interface IHttpGateway extends IGateway {
  startWithOptions(options?: IHttpGatewayOptions): Promise<boolean>
  addRoute(route: HttpRoute): void
  getInfos(): string
  getRouter(): IHttpRouter
}

export class HttpRoute {
  id: HttpRouteIdentifiers | string
  method: HttpRequestMethod
  route: string
  useAuth: Authority[]
  reqValidator: Record<string, unknown> | undefined
  resValidator: Record<string, unknown> | undefined
  bind: RouteHandlerMethod

  constructor(p: HttpRoute) {
    this.method = p.method
    this.route = p.route
    this.useAuth = p.useAuth ?? []
    this.reqValidator = p.reqValidator ?? {}
    this.resValidator = p.resValidator ?? {}
    this.bind = p.bind
  }
}

export type IHttpRouter = FastifyInstance
export type IHttpHandler = RouteHandlerMethod
export type IMultipart = Multipart
export type IHttpResponse = FastifyReply

export interface IHttpRequest<T> extends FastifyRequest<T> {
  accountId: string
}

export enum HttpRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE'
}
