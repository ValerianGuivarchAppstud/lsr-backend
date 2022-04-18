/* eslint-disable no-process-env */
export class BackendApplicationParams {
  http: {
    port: number
    host: string
    requestMaxSize: number
  }
  db: {
    uri: string
    proxyUri?: string
  }
  jwt: {
    secret: string
  }
  management: {
    secret?: string
  }

  constructor(p: Partial<BackendApplicationParams>) {
    let httpPort = 8080
    if (process.env.PORT) {
      httpPort = Number(process.env.PORT)
    } else if (process.env.HTTP_PORT) {
      httpPort = Number(process.env.HTTP_PORT)
    }
    this.http = {
      port: p.http?.port ?? httpPort,
      host: p.http?.host ?? process.env.HTTP_HOST ?? '127.0.0.1',
      requestMaxSize:
        p.http?.requestMaxSize ??
        // eslint-disable-next-line no-magic-numbers
        (process.env.HTTP_REQUEST_MAX_SIZE ? Number(process.env.HTTP_REQUEST_MAX_SIZE) : 20_971_520) // 20 Mo
    }
    this.db = {
      uri: p.db?.uri ?? process.env.DB_URI ?? 'mongodb://localhost:27017/swag-backend',
      proxyUri: p.db?.proxyUri ?? process.env.DB_PROXY_URI
    }
    this.jwt = {
      secret: p.jwt?.secret ?? process.env.JWT_SECRET ?? 'changemechangemechangeme'
    }
    this.management = {
      secret: p.management?.secret ?? process.env.MANAGEMENT_SECRET
    }
  }
}
