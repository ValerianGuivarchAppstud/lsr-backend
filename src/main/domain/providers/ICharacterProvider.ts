import { Character } from '../models/character/Character'

export interface ICharacterProvider {
  createOrUpdate(character: Character): Promise<Character>
  delete(name: string)
  findByName(name: string): Promise<Character>
  countAll(): Promise<number>
}
