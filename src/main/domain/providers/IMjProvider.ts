import { Session } from '../models/mj/Mj'

export interface IMjProvider {
  getSessionCharacter(): Promise<Session>
  addCharacter(characterName: string): Promise<boolean>
  removeCharacter(characterName: string): Promise<boolean>
}
