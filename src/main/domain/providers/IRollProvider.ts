import { Roll } from '../models/roll/Roll'

export interface IRollProvider {
  add(roll: Roll): Promise<Roll>
  getLast(size: number): Promise<Roll[]>
  updateToSend(): boolean
  updateSent()
}
