import { HttpRouteIdentifiers } from './HttpRouteIdentifiers'
import { ProviderErrors } from '../../data/errors/ProviderErrors'
import { logger, logRequestWithBody } from '../../domain/helpers/logs/Logging'
import { starWildcardMatch } from '../../domain/helpers/MatcherUtils'
import { RollService } from '../../domain/services/RollService'
import { HttpRequestMethod, HttpRoute, IHttpGateway, IHttpGatewayOptions } from '../../gateways/IHttpGateway'
import fastify, {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
  RouteShorthandOptions
} from 'fastify'
import fastifyCors from 'fastify-cors'
import fastifyMultipart from 'fastify-multipart'
import { FastifySSEPlugin } from 'fastify-sse-v2'
import fastifySwagger from 'fastify-swagger'
import HttpStatus from 'http-status-codes'
import { IncomingHttpHeaders } from 'http'

export class HttpGateway implements IHttpGateway {
  private readonly instance: FastifyInstance
  private readonly logger = logger(this.constructor.name)
  private readonly swaggerUiUrl = '/swagger-ui'
  private readonly allowedOrigins: string[]
  private readonly httpPort: number
  private readonly httpHost: string
  private routes: HttpRoute[]
  private static rollService: RollService

  constructor(p: { httpPort: number; httpHost: string; requestMaxSize: number; rollService: RollService }) {
    this.allowedOrigins = ['*'] // FIXME change this
    this.instance = fastify({
      logger: this.logger,
      bodyLimit: p.requestMaxSize
    })
    this.instance.register(FastifySSEPlugin)
    this.httpPort = p.httpPort
    this.httpHost = p.httpHost
    this.routes = []
    HttpGateway.rollService = p.rollService
    this.install()
  }

  getInfos(): string {
    return this.instance.printRoutes()
  }

  get router(): FastifyInstance {
    return this.instance
  }

  getRouter(): FastifyInstance {
    return this.instance
  }

  install(): void {
    this.instance.register(fastifySwagger, {
      routePrefix: `${this.swaggerUiUrl}`,
      swagger: {
        info: {
          title: 'Swagger Swag backend',
          description: 'Web repositories of the Swag backend',
          version: '0.1.0'
        },
        host: `${this.httpHost}:${this.httpPort}`,
        tags: [
          // add each controller here to split requests in groups, and tag JSON schemas with the name
          // example : {name: 'Authentication', description: 'Authentication related end-points'}
        ],
        consumes: ['application/json'],
        produces: ['application/json']
      },
      exposeRoute: true
    })

    this.instance.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      const httpError = new HttpError({ error: error, request: request })
      this.logger.error(httpError, error.message || 'Internal Server Error')
      reply.code(httpError.statusCode).send(httpError.filter())
    })

    this.instance.register(fastifyCors, {
      origin: (origin, cb) => {
        const matchedRules = this.allowedOrigins.filter((rule) => starWildcardMatch(origin, rule)).length
        if (matchedRules > 0) {
          cb(null, true)
          return
        }
        // Generate an error on other origins, disabling access
        cb(ProviderErrors.Unauthorized('Not allowed cors origin'), false)
      },
      strictPreflight: false,
      allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization', 'lynkt-marketplace-id'],
      methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS']
    })
    this.instance.register(fastifyMultipart, {
      attachFieldsToBody: true,
      sharedSchemaId: '#sharedMultipartSchema'
    })

    // eslint-disable-next-line no-process-env
    if (process.env.HTTP_REQUESTS_DEBUG === 'true') {
      this.instance.addHook('preHandler', (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
        // eslint-disable-next-line no-process-env
        logRequestWithBody(req, process.env.HTTP_REQUESTS_DEBUG_FILTER)
        done()
      })
    }
  }

  async start(): Promise<boolean> {
    return this.startWithOptions()
  }

  async startWithOptions(options?: IHttpGatewayOptions): Promise<boolean> {
    /*this.instance.get('/api/v1/sse', function (req, res) {
            res.sse(
        (async function* source() {
          async function delay(number: number) {
            return new Promise((resolve) => setTimeout(resolve, number))
          }

          let i = 0
          // eslint-disable-next-line no-magic-numbers
          while (true) {
            // eslint-disable-next-line no-magic-numbers
            await delay(2000)
            const updateToSend = HttpGateway.rollService.updateToSend()
            if (updateToSend) {
              const data = RollLastVM.from({
                rollList: await HttpGateway.rollService.getLast()
              })
              i++
              yield { id: String(i), data: JSON.stringify(data) }
              HttpGateway.rollService.updateSent()
            }
          }
        })()
      )//
    })*/
    if (this.instance.server.listening) {
      this.logger.warn('start > http server already started')
      return true
    }

    this.logger.info(`start > http server starting on ${this.httpHost}:${this.httpPort}...`)

    if (options) {
      // disable specific routes
      const disabledRoutes = options.disabledRoutes
      if (disabledRoutes && disabledRoutes.length) {
        this.instance.log.info(`start > disable routes ${disabledRoutes}`)
        this.routes = this.routes.filter((r) => !disabledRoutes.includes(r.id as HttpRouteIdentifiers))
      }
    }

    // now register all selected routes
    this.routes.forEach((value) => this.registerRoute(value))

    await this.instance.listen(this.httpPort, this.httpHost)
    this.logger.info('start > http server ready')

    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV !== 'production') {
      // TODO this.instance.swagger()
      this.instance.log.info(
        `API Documentation available on https://${this.httpHost}:${this.httpPort}${this.swaggerUiUrl}/static/index.html`
      )
    }

    return true
  }

  async stop(): Promise<boolean> {
    return this.instance.close().then(() => {
      return true
    })
  }

  private authMiddleware() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return async (request: FastifyRequest) => {}
  }

  addRoute(route: HttpRoute): void {
    const existingRoute = this.routes.findIndex((r) => r.id === route.id)
    if (existingRoute >= 0) {
      this.logger.info(`addRoute > remove overridden http route ${route.id}`)
      this.routes.splice(existingRoute, 1)
    }
    this.routes.push(route)
  }

  private registerRoute(route: HttpRoute): void {
    try {
      const schema =
        route.reqValidator && route.resValidator
          ? {
              ...route.reqValidator,
              response: {
                200: route.resValidator
              }
            }
          : {}

      const middleware: RouteShorthandOptions = {
        preHandler: this.authMiddleware(),
        schema: schema
      }

      switch (route.method) {
        case HttpRequestMethod.POST:
          this.router.post(`${route.route}`, middleware, route.bind)
          break
        case HttpRequestMethod.GET:
          this.router.get(`${route.route}`, middleware, route.bind)
          break
        case HttpRequestMethod.DELETE:
          this.router.delete(`${route.route}`, middleware, route.bind)
          break
        case HttpRequestMethod.PATCH:
          this.router.patch(`${route.route}`, middleware, route.bind)
          break
        case HttpRequestMethod.PUT:
          this.router.put(`${route.route}`, middleware, route.bind)
          break
        default:
      }

      this.logger.info(`registerRoute > register [${route.method},${route.route}]`)
    } catch (e) {
      this.logger.error(`registerRoute > error registering [${route.method},/${route.route}]' : ${e}`)
    }
  }
}

// this declaration must be in scope of the typescript interpreter to work
declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface FastifyRequest {}
}

export class HttpError {
  statusCode: number
  code: string
  error: string
  message: string
  stack?: string
  stacktrace?: string[]
  validation?: string[]
  req?: { url: string; method: string; headers: IncomingHttpHeaders }

  constructor(p: { error: FastifyError; request: FastifyRequest }) {
    let errorCode = HttpStatus.INTERNAL_SERVER_ERROR
    if (p.error.statusCode != undefined) {
      errorCode = p.error.statusCode
    } else if (p.error.validation && p.error.validation.length) {
      errorCode = HttpStatus.BAD_REQUEST
    }
    this.statusCode = errorCode
    this.code = p.error.code ?? HttpStatus.getStatusText(errorCode).replace(' ', '_').toUpperCase()
    this.error = HttpStatus.getStatusText(errorCode)
    this.message = p.error.message
    this.stacktrace = p.error.stack?.split(/\r?\n/) ?? []
    this.stack = p.error.stack
    this.validation = p.error.validation?.map((v) => v.message)
    this.req = { url: p.request.url, method: p.request.method, headers: p.request.headers }
  }

  filter(): HttpError {
    // eslint-disable-next-line no-process-env
    const isProd = ['production'].includes(`${process.env.NODE_ENV}`)
    if (isProd) {
      this.stacktrace = undefined
      this.stack = undefined
    }
    this.req = undefined
    return this
  }
}
