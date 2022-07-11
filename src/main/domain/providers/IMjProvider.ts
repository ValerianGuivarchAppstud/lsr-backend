import { Mj } from '../models/mj/Mj'

export interface IMjProvider {
  getMj(): Promise<Mj>
  addCharacter(characterName: string): Promise<boolean>
  removeCharacter(characterName: string): Promise<boolean>
}
