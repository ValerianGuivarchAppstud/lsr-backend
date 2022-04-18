export interface IGateway {
  start(): Promise<boolean>
  stop(): Promise<boolean>
}
