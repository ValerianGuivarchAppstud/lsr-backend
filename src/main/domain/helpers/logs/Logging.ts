import { FastifyRequest } from 'fastify'
import pino, { LoggerOptions } from 'pino'

export const redactedLogsParams = {
  paths: ['req.headers.authorization', 'phone', 'password', 'secret', 'accessToken', 'refreshToken'],
  censor: '**REDACTED**'
}

/* eslint-disable no-process-env */
const pinoOpts: LoggerOptions = {
  redact: redactedLogsParams,
  level: ['test'].includes(`${process.env.NODE_ENV}`) && process.env.CI ? 'silent' : 'info',
  serializers: ['local', 'test'].includes(`${process.env.NODE_ENV}`)
    ? {}
    : {
        // add headers to the logs
        req(req) {
          return {
            method: req.method,
            url: req.url,
            headers: req.headers,
            hostname: req.hostname,
            remoteAddress: req.ip,
            remotePort: req.socket?.remotePort
          }
        }
      },
  transport:
    ['local', 'test'].includes(`${process.env.NODE_ENV}`) && !process.env.CI
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname,module',
            singleLine: true,
            messageFormat: '{module} > {msg}'
          }
        }
      : undefined
}

const rootLogger = pino(pinoOpts)
export const logger = (module: string): pino.Logger => {
  return rootLogger.child({ module })
}

export const logRequestWithBody = (req: FastifyRequest, filters?: string): void => {
  if (req.body) {
    const filteredProperties = filters ? filters.split(',') : redactedLogsParams.paths
    // eslint-disable-next-line @typescript-eslint/ban-types
    const raw = req.body as Object
    const filtered = Object.keys(raw).reduce((obj, key) => {
      if (filteredProperties.includes(key)) {
        obj[key] = redactedLogsParams.censor
      } else {
        obj[key] = raw[key]
      }
      return obj
    }, {})

    req.log.debug(
      {
        request: {
          method: req.method,
          url: req.url,
          headers: req.headers,
          hostname: req.hostname,
          remoteAddress: req.ip,
          remotePort: req.socket?.remotePort,
          body: filtered
        }
      },
      'incoming request'
    )
  }
}
