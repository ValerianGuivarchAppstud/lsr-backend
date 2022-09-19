import { logger } from '../helpers/logs/Logging'
import { Category } from '../models/character/Category'
import { Character } from '../models/character/Character'
import { Player } from '../models/character/Player'
import { ICharacterProvider } from '../providers/ICharacterProvider'
import { IPlayerProvider } from '../providers/IPlayerProvider'
import { ISessionProvider } from '../providers/ISessionProvider'

export class CharacterService {
  private characterProvider: ICharacterProvider
  private sessionProvider: ISessionProvider
  private playerProvider: IPlayerProvider
  private readonly logger = logger(this.constructor.name)

  constructor(p: {
    characterProvider: ICharacterProvider
    sessionProvider: ISessionProvider
    playerProvider: IPlayerProvider
  }) {
    this.characterProvider = p.characterProvider
    this.sessionProvider = p.sessionProvider
    this.playerProvider = p.playerProvider
  }

  async findOneByName(name: string): Promise<Character> {
    return this.characterProvider.findOneByName(name)
  }

  async findPlayerByPlayerName(name: string): Promise<Player> {
    return this.playerProvider.findOneByName(name)
  }

  async findByName(name: string): Promise<Character | undefined> {
    return this.characterProvider.findByName(name)
  }

  async findManyByName(names: string[]): Promise<Character[]> {
    return this.characterProvider.findManyByName(names)
  }

  async findAll(playerName?: string): Promise<Character[]> {
    if (playerName === 'MJ') {
      return this.characterProvider.findAll()
    } else if (playerName) {
      return this.characterProvider.findAll(playerName)
    } else {
      return this.characterProvider.findAll('-no-player-')
    }
  }

  async findAllByCategory(category: Category): Promise<string[]> {
    return this.characterProvider.findAllByCategory(category)
  }

  async createOrUpdateCharacter(p: { character: Character }): Promise<Character> {
    return await this.characterProvider.createOrUpdate(p.character)
  }

  async deleteCharacter(p: { name: string }): Promise<Character> {
    return await this.characterProvider.delete(p.name)
  }

  async getPlayersName(): Promise<string[]> {
    return ['', 'Arcady', 'David', 'Elena', 'Eric', 'Florent', 'Guilhem', 'Jupi', 'Nico', 'Tom', 'Valou', 'Guest']
  }

  async createOrUpdatePlayer(name: string, relance: number): Promise<Player> {
    return await this.playerProvider.createOrUpdate({
      playerName: name,
      relance: relance
    })
  }

  async findAllPlayers(): Promise<Player[]> {
    return this.playerProvider.findAll()
  }
}
