import S, { ObjectSchema } from 'fluent-json-schema'

export class AdminFilePayload {
  base64: string
  filename: string
  mimetype: string

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('base64', S.string().required())
      .prop('filename', S.string().required())
      .prop('mimetype', S.string().required())
  }

  static getValidationSchema(): Record<string, unknown> {
    return {
      description: 'AdminFilePayload',
      tags: ['Admin > Games'],
      body: this.getFluentSchema()
    }
  }
}
