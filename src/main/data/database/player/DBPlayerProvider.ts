import { DBPlayer, DBPlayerModel } from './DBPlayer'
import { Player } from '../../../domain/models/character/Player'
import { IPlayerProvider } from '../../../domain/providers/IPlayerProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'

export class DBPlayerProvider implements IPlayerProvider {
  private static toPlayer(doc: DBPlayer): Player {
    return new Player({
      relance: doc.relance,
      playerName: doc.playerName
    })
  }

  private static fromPlayer(doc: Player): DBPlayer {
    return {
      playerName: doc.playerName,
      relance: doc.relance
    } as DBPlayer
  }

  async createOrUpdate(newPlayer: Player): Promise<Player> {
    const player = await DBPlayerModel.findOne({ playerName: newPlayer.playerName }).exec()
    if (!player) {
      return DBPlayerProvider.toPlayer(await DBPlayerModel.create(DBPlayerProvider.fromPlayer(newPlayer)))
    } else {
      return this.update(newPlayer)
    }
  }

  async update(player: Player): Promise<Player> {
    const newPlayer = await DBPlayerModel.findOneAndUpdate(
      { playerName: player.playerName },
      DBPlayerProvider.fromPlayer(player),
      {
        new: true
      }
    ).exec()
    if (!newPlayer) {
      throw ProviderErrors.EntityNotFound(player.playerName)
    }
    return DBPlayerProvider.toPlayer(newPlayer)
  }

  async findOneByName(name: string): Promise<Player> {
    let player = await DBPlayerModel.findOne({ playerName: name }).exec()
    if (!player) {
      await this.createOrUpdate({ relance: 0, playerName: name })
      player = await DBPlayerModel.findOne({ name: name }).exec()
    }
    if (!player) {
      throw ProviderErrors.EntityNotFound(name)
    }
    return DBPlayerProvider.toPlayer(player)
  }

  async findAll(): Promise<Player[]> {
    const playerList = await DBPlayerModel.find({}).exec()
    return playerList.map((c) => DBPlayerProvider.toPlayer(c))
  }
}
