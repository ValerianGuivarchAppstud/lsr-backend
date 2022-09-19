import { Player } from '../models/character/Player'

export interface IPlayerProvider {
  createOrUpdate(player: Player): Promise<Player>
  findOneByName(name: string): Promise<Player>
  findAll(): Promise<Player[]>
}
