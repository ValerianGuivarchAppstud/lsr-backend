import { ProviderErrors } from '../../data/errors/ProviderErrors'
import { logger } from '../helpers/logs/Logging'
import { Bloodline } from '../models/character/Bloodline'
import { Roll } from '../models/roll/Roll'
import { RollType } from '../models/roll/RollType'
import { ICharacterProvider } from '../providers/ICharacterProvider'
import { IRollProvider } from '../providers/IRollProvider'

export class RollService {
  // eslint-disable-next-line no-magic-numbers
  public static readonly MAX_ROLL_LIST_SIZE = 50
  // eslint-disable-next-line no-magic-numbers
  public static readonly CLASSIC_ROLL_VALUE = 6
  // eslint-disable-next-line no-magic-numbers
  public static readonly DEATH_ROLL_VALUE = 20
  // eslint-disable-next-line no-magic-numbers
  public static readonly ONE_SUCCESS_DICE = 5
  // eslint-disable-next-line no-magic-numbers
  public static readonly ONE_SUCCESS_EFFECT = 1
  // eslint-disable-next-line no-magic-numbers
  public static readonly TWO_SUCCESS_DICE = 6
  // eslint-disable-next-line no-magic-numbers
  public static readonly TWO_SUCCESS_EFFECT = 2

  private rollProvider: IRollProvider
  private characterProvider: ICharacterProvider
  private readonly logger = logger(this.constructor.name)

  constructor(p: { rollProvider: IRollProvider; characterProvider: ICharacterProvider }) {
    this.characterProvider = p.characterProvider
    this.rollProvider = p.rollProvider
  }

  async getLast(): Promise<Roll[]> {
    return this.rollProvider.getLast(RollService.MAX_ROLL_LIST_SIZE)
  }

  async roll(p: {
    rollerName: string
    rollType: RollType
    secret: boolean
    focus: boolean
    power: boolean
    proficiency: boolean
    benediction: number
    malediction: number
    empiriqueRoll?: string
    characterToHelp?: string
    resistRoll?: string
  }): Promise<Roll> {
    const character = await this.characterProvider.findByName(p.rollerName)
    if (p.rollType === RollType.RELANCE) {
      const lastRoll = await this.rollProvider.getLastForCharacter(character)
      if (lastRoll === undefined) {
        throw ProviderErrors.RollNoPreviousRoll()
      } else if (character.relance <= 0) {
        throw ProviderErrors.RollNotEnoughRelance()
      }
      lastRoll.date = new Date()
      lastRoll.success =
        (lastRoll.success ?? 0) -
        lastRoll.result.filter((r) => r === RollService.ONE_SUCCESS_DICE).length * RollService.ONE_SUCCESS_EFFECT -
        lastRoll.result.filter((r) => r === RollService.TWO_SUCCESS_DICE).length * RollService.TWO_SUCCESS_EFFECT

      const diceNumber = lastRoll.result.length
      lastRoll.result = []
      for (let i = 0; i < diceNumber; i++) {
        const dice = RollService.randomIntFromInterval(1, RollService.CLASSIC_ROLL_VALUE)
        if (dice === RollService.ONE_SUCCESS_DICE) {
          lastRoll.success = (lastRoll.success ?? 0) + RollService.ONE_SUCCESS_EFFECT
        }
        if (dice === RollService.TWO_SUCCESS_DICE) {
          // eslint-disable-next-line no-magic-numbers
          lastRoll.success = (lastRoll.success ?? 0) + RollService.TWO_SUCCESS_EFFECT
        }
        lastRoll.result.push(dice)
      }
      character.relance = character.relance - 1
      this.characterProvider.createOrUpdate(character)
      return await this.rollProvider.update(lastRoll)
    }
    let diceNumber = 0
    let diceValue = 0
    let diceValueDelta = p.benediction - p.malediction
    let pfDelta = 0
    let ppDelta = 0
    let arcaneDelta = 0
    let dettesDelta = 0
    let usePf = p.focus
    let usePp = p.power
    let useProficiency = p.proficiency
    const result: number[] = []
    let successToCalculate = true
    const availableHelp = await this.rollProvider.availableHelp(p.rollerName)
    let helpCanBeUsed = false
    if (
      p.rollType === RollType.SOIN ||
      p.rollType === RollType.MAGIE_FORTE ||
      p.rollType === RollType.MAGIE_LEGERE ||
      p.rollType === RollType.ESPRIT ||
      p.rollType === RollType.ARCANE_ESPRIT ||
      p.rollType === RollType.ESSENCE ||
      p.rollType === RollType.ARCANE_ESSENCE ||
      p.rollType === RollType.CHAIR
    ) {
      helpCanBeUsed = true
      for (const help of availableHelp) {
        if (!help.helpUsed) {
          if (help.success === 0) {
            diceValueDelta--
          } else {
            diceValueDelta = diceValueDelta + (help.success ?? 0)
          }
        }
      }
    }

    if (usePf) {
      diceValueDelta++
    }
    if (p.rollType === RollType.CHAIR) {
      diceNumber = character.chair + diceValueDelta
      diceValue = RollService.CLASSIC_ROLL_VALUE
    } else if (p.rollType === RollType.ESPRIT) {
      diceNumber = character.esprit + diceValueDelta
      diceValue = RollService.CLASSIC_ROLL_VALUE
    } else if (p.rollType === RollType.ESSENCE) {
      diceNumber = character.essence + diceValueDelta
      diceValue = RollService.CLASSIC_ROLL_VALUE
    } else if (p.rollType === RollType.ARCANE_FIXE) {
      diceNumber = 0
      diceValue = 0
      arcaneDelta--
      usePp = false
      usePf = false
      useProficiency = false
      successToCalculate = false
    } else if (p.rollType === RollType.ARCANE_ESPRIT) {
      diceNumber = character.esprit + diceValueDelta
      diceValue = RollService.CLASSIC_ROLL_VALUE
      arcaneDelta--
      usePp = false
    } else if (p.rollType === RollType.ARCANE_ESSENCE) {
      diceNumber = character.essence + diceValueDelta
      diceValue = RollService.CLASSIC_ROLL_VALUE
      arcaneDelta--
      usePp = false
    } else if (p.rollType === RollType.MAGIE_LEGERE) {
      diceNumber = character.essence + diceValueDelta
      diceValue = RollService.CLASSIC_ROLL_VALUE
      usePp = false
      ppDelta--
    } else if (p.rollType === RollType.MAGIE_FORTE) {
      diceNumber = character.essence + diceValueDelta
      diceValue = RollService.CLASSIC_ROLL_VALUE
      dettesDelta++
    } else if (p.rollType === RollType.SOIN && character.bloodline !== Bloodline.LUMIERE) {
      diceNumber = character.essence + diceValueDelta
      diceValue = RollService.CLASSIC_ROLL_VALUE
      dettesDelta++
      ppDelta--
    } else if (p.rollType === RollType.SOIN && character.bloodline === Bloodline.LUMIERE) {
      diceNumber = character.essence + diceValueDelta
      diceValue = RollService.CLASSIC_ROLL_VALUE
      ppDelta--
    } else if (p.rollType === RollType.EMPIRIQUE) {
      try {
        diceNumber = Number(p.empiriqueRoll?.substring(0, p.empiriqueRoll.indexOf('d')))
        diceValue = Number(p.empiriqueRoll?.substring(p.empiriqueRoll.indexOf('d') + 1))
        usePf = false
        usePp = false
        useProficiency = false
        successToCalculate = false
      } catch (e) {
        throw ProviderErrors.RollWrongEmpiricalRequest()
      }
    } else if (p.rollType === RollType.SAUVEGARDE_VS_MORT) {
      diceNumber = 1
      diceValue = RollService.DEATH_ROLL_VALUE
      usePf = false
      usePp = false
      useProficiency = false
      successToCalculate = false
    }
    if (usePf) {
      pfDelta--
    }
    if (usePp) {
      ppDelta--
      dettesDelta++
    }
    let success: number | null = null
    if (successToCalculate) {
      success = 0
    }
    for (let i = 0; i < diceNumber; i++) {
      const dice = RollService.randomIntFromInterval(1, diceValue)
      if (successToCalculate) {
        if (dice === RollService.ONE_SUCCESS_DICE) {
          success = (success ?? 0) + RollService.ONE_SUCCESS_EFFECT
        }
        if (dice === RollService.TWO_SUCCESS_DICE) {
          // eslint-disable-next-line no-magic-numbers
          success = (success ?? 0) + RollService.TWO_SUCCESS_EFFECT
        }
      }
      result.push(dice)
    }
    if (usePp) {
      success = (success ?? 0) + 1
    }
    if (useProficiency) {
      success = (success ?? 0) + 1
    }

    if (p.rollType === RollType.SOIN) {
      if (character.bloodline !== Bloodline.LUMIERE) {
        // eslint-disable-next-line no-magic-numbers
        success = Math.floor((1 + (success ?? 0)) / 2)
      }
      success = (success ?? 0) + 1
    }
    if (character.pf + pfDelta < 0) {
      throw ProviderErrors.RollNotEnoughPf()
    } else if (character.pp + ppDelta < 0) {
      throw ProviderErrors.RollNotEnoughPp()
    } else if (character.arcanes + arcaneDelta < 0) {
      throw ProviderErrors.RollNotEnoughArcane()
    } else {
      let helpUsed: boolean | null = null
      if (p.characterToHelp) {
        helpUsed = false
      }
      const rollToCreate = new Roll({
        rollerName: p.rollerName,
        rollType: p.rollType,
        date: new Date(),
        secret: p.secret,
        focus: usePf,
        power: usePp,
        proficiency: useProficiency,
        benediction: p.benediction,
        malediction: p.malediction,
        result: result,
        success: success,
        characterToHelp: p.characterToHelp,
        resistRoll: p.resistRoll,
        helpUsed: helpUsed,
        picture: character.picture // TODO update bdd si on change image
      })
      const createdRoll = this.rollProvider.add(rollToCreate)
      character.pf += pfDelta
      character.pp += ppDelta
      character.arcanes += arcaneDelta
      character.dettes += dettesDelta
      this.characterProvider.createOrUpdate(character)
      if (helpCanBeUsed) {
        this.rollProvider.helpUsed(availableHelp)
      }
      return createdRoll
    }
  }

  private static randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
