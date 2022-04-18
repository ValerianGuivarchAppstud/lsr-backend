import { ValidationHelper } from '../../../../../../domain/helpers/ValidationHelpers'
import dayjs from 'dayjs'
import S, { ObjectSchema } from 'fluent-json-schema'

export class StatusVM {
  status: string
  instanceId: string
  instanceIp?: string
  version: string
  startedAt: string
  now: string
  components: ComponentsStatusVM
  env?: EnvVarVM[]

  constructor(p: {
    status: 'UP' | 'DOWN'
    instanceId: string
    instanceIp?: string
    version: string
    startedAt: string
    components: ComponentsStatusVM
  }) {
    this.status = p.status
    this.instanceId = p.instanceId
    this.instanceIp = p.instanceIp
    this.version = p.version
    this.startedAt = p.startedAt
    this.now = dayjs().format()
    this.components = p.components
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('status', S.string().pattern(ValidationHelper.NON_EMPTY_STRING).required())
      .prop('instanceId', S.string())
      .prop('instanceIp', S.string())
      .prop('version', S.string())
      .prop('startedAt', S.string())
      .prop('now', S.string())
      .prop('env', S.array().items(EnvVarVM.getFluentSchema()))
      .prop('components', ComponentsStatusVM.getFluentSchema())
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema().valueOf(), description: StatusVM.name }
  }
}

export class EnvVarVM {
  key: string
  value: string

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('key', S.string()).prop('value', S.string())
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema().valueOf(), description: EnvVarVM.name }
  }
}

export class ComponentsStatusVM {
  database: ComponentsDatabaseVM

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('database', ComponentsDatabaseVM.getFluentSchema())
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema().valueOf(), description: ComponentsStatusVM.name }
  }
}

export class ComponentsDatabaseVM {
  status: 'UP' | 'DOWN'

  static getFluentSchema(): ObjectSchema {
    return S.object().prop('status', S.string().pattern(ValidationHelper.NON_EMPTY_STRING).required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema().valueOf(), description: ComponentsDatabaseVM.name }
  }
}
