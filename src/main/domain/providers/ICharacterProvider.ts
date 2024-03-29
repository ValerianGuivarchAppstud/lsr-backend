import { Category } from '../models/character/Category'
import { Character } from '../models/character/Character'

export interface ICharacterProvider {
  createOrUpdate(character: Character): Promise<Character>
  delete(name: string)
  findOneByName(name: string): Promise<Character>
  findByName(name: string): Promise<Character | undefined>
  exist(name: string): Promise<boolean>
  findManyByName(names: string[]): Promise<Character[]>
  findAll(playerName?: string): Promise<Character[]>
  countAll(): Promise<number>
  findAllByCategory(category: Category): Promise<string[]>
}
