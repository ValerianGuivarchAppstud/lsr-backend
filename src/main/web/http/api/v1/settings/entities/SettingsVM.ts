import S, { ObjectSchema } from 'fluent-json-schema'

export class SettingsVM {
  playersName: string[]
  charactersName: string[]

  private constructor(p: SettingsVM) {
    this.playersName = p.playersName
    this.charactersName = p.charactersName
  }

  static from(p: { playersName: string[]; charactersName: string[] }): SettingsVM {
    return new SettingsVM({
      playersName: p.playersName,
      charactersName: p.charactersName
    })
  }

  static getFluentSchema(): ObjectSchema {
    return S.object()
      .prop('playersName', S.array().items(S.string()))
      .prop('charactersName', S.array().items(S.string()))
  }

  static getValidationSchema(): Record<string, unknown> {
    return { ...this.getFluentSchema(), description: SettingsVM.name }
  }
}
