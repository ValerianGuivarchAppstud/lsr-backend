import { Character } from '../models/character/Character'
import { Roll } from '../models/roll/Roll'

export interface IRollProvider {
  add(roll: Roll): Promise<Roll>
  update(roll: Roll): Promise<Roll>
  getLast(size: number): Promise<Roll[]>
  getLastForCharacter(character: Character): Promise<Roll | undefined>
  updateToSend(): boolean
  updateSent()
}
