import { DBSession, DBSessionModel } from './DBSession'
import { Round } from '../../../domain/models/session/Round'
import { Session } from '../../../domain/models/session/Session'
import { ISessionProvider } from '../../../domain/providers/ISessionProvider'
import { Utils } from '../../../utils/Utils'
import { ProviderErrors } from '../../errors/ProviderErrors'

export class DBSessionProvider implements ISessionProvider {
  private static toSession(doc: DBSession): Session {
    return new Session({
      characters: doc.characters,
      visioToken: doc.visioToken,
      charactersBattleAllies: doc.charactersBattleAllies,
      charactersBattleEnnemies: doc.charactersBattleEnnemies,
      round: Round[doc.round],
      relanceMj: doc.relanceMj
    })
  }

  private static fromSession(doc: Session): DBSession {
    return {
      characters: doc.characters,
      visioToken: doc.visioToken,
      charactersBattleAllies: doc.charactersBattleAllies,
      charactersBattleEnnemies: doc.charactersBattleEnnemies,
      round: doc.round.toString(),
      relanceMj: doc.relanceMj
    } as DBSession
  }

  async getSessionCharacter(): Promise<Session> {
    const session = await DBSessionModel.findOne().exec()
    if (session) return DBSessionProvider.toSession(session)
    else {
      await DBSessionModel.create(
        DBSessionProvider.fromSession(
          new Session({
            characters: [],
            visioToken: '',
            charactersBattleAllies: [],
            charactersBattleEnnemies: [],
            round: Round.NONE,
            relanceMj: 0
          })
        )
      )
      throw new Error('No session')
    }
  }

  async addCharacter(characterName: string): Promise<boolean> {
    const session = await DBSessionModel.findOne().exec()
    if (session) {
      if (!session?.characters.includes(characterName)) {
        session?.characters.push(characterName)
        const newSession = await DBSessionModel.findOneAndUpdate({}, session, { new: true }).exec()
        if (!newSession) {
          throw new Error('No session')
        }
      }
    } else throw new Error('No session')
    return true
  }

  async removeCharacter(characterName: string): Promise<boolean> {
    const session = await DBSessionModel.findOne().exec()
    if (session) {
      if (session.characters.includes(characterName)) {
        session.characters = Utils.removeElementFromArray(session.characters, characterName) as string[]
        const newSession = await DBSessionModel.findOneAndUpdate({}, session, { new: true }).exec()
        if (!newSession) {
          throw ProviderErrors.EntityNotFound('Session')
        }
      }
      return true
    } else throw new Error('No session')
  }

  async updateMjRelance(relance: number): Promise<boolean> {
    const session = await DBSessionModel.findOne().exec()
    if (session) {
      session.relanceMj = relance
      const newSession = await DBSessionModel.findOneAndUpdate({}, session, { new: true }).exec()
      if (!newSession) {
        throw ProviderErrors.EntityNotFound('Session')
      }
      return true
    } else throw new Error('No session')
  }

  async addCharacterBattle(rollerName: string, ally: boolean): Promise<boolean> {
    const session = await DBSessionModel.findOne().exec()
    if (session) {
      if (ally) {
        if (!session.charactersBattleAllies.includes(rollerName)) {
          session?.charactersBattleAllies.push(rollerName)
          await DBSessionModel.findOneAndUpdate({}, session, { new: true }).exec()
        }
      } else {
        if (!session.charactersBattleEnnemies.includes(rollerName)) {
          session?.charactersBattleEnnemies.push(rollerName)
          await DBSessionModel.findOneAndUpdate({}, session, { new: true }).exec()
        }
      }
      return true
    } else throw new Error('No session')
  }

  async updateBattle(
    charactersBattleAllies: string[],
    charactersBattleEnnemies: string[],
    round: Round
  ): Promise<boolean> {
    const session = await DBSessionModel.findOne().exec()
    if (session) {
      session.charactersBattleAllies = charactersBattleAllies
      session.charactersBattleEnnemies = charactersBattleEnnemies
      session.round = round
      const newSession = await DBSessionModel.findOneAndUpdate({}, session, { new: true }).exec()
      if (!newSession) {
        throw ProviderErrors.EntityNotFound('Session')
      }
      return true
    } else throw new Error('No session')
  }

  async updateVisioToken(visioToken: string): Promise<boolean> {
    const session = await DBSessionModel.findOne().exec()
    if (session) {
      session.visioToken = visioToken
      const newSession = await DBSessionModel.findOneAndUpdate({}, session, { new: true }).exec()
      if (!newSession) {
        throw ProviderErrors.EntityNotFound('Session')
      }
      return true
    } else throw new Error('No session')
  }
}
