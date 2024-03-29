import { GenericError } from '../../domain/GenericError'
import HttpStatus from 'http-status-codes'

export class ProviderErrors {
  static ExpiredToken(): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'The token has expired. Please refresh token',
      code: 'EXPIRED_TOKEN'
    })
  }


  static AccountAlreadyCreated(): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'This email is already used by a created account',
      code: 'ACCOUNT_ALREADY_CREATED'
    })
  }

  static WrongToken(): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'This token is wrong. Please login',
      code: 'WRONG_TOKEN'
    })
  }

  static WrongCredentials(msg?: string): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: `The credentials are not correct ${msg ? '(' + msg + ')' : ''}`,
      code: 'WRONG_CREDENTIALS'
    })
  }

  static Unauthorized(message: string): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: message,
      code: 'UNAUTHORIZED'
    })
  }

  static EmailAlreadyUsed(email: string): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.CONFLICT,
      message: `Email already used: ${email}`,
      code: 'EMAIL_ALREADY_USED'
    })
  }

  static EntityNotFound(entityName: string): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.NOT_FOUND,
      message: `This entity ${entityName} does not exist`,
      code: 'ENTITY_NOT_FOUND'
    })
  }

  static CharacterAlreadyCreated(name: string): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'The character' + name + ' already exists',
      code: 'CHARACTER_ALREADY_CREATED'
    })
  }

  static RollNotEnoughPf(): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.METHOD_FAILURE,
      message: 'Pas assez de Pf !',
      code: 'ROLL_NOT_ENOUGH_PF'
    })
  }

  static RollNotEnoughRelance(): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.METHOD_FAILURE,
      message: 'Pas assez de relance !',
      code: 'ROLL_NOT_ENOUGH_RELANCE'
    })
  }

  static RollWrongEmpiricalRequest(): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.METHOD_FAILURE,
      message: 'Erreur dans la requête empirique',
      code: 'ROLL_WRONG_EMPIRICAL_REQUEST'
    })
  }

  static RollNoPreviousRoll(): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.METHOD_FAILURE,
      message: 'Pas de lancer de dé à relancer',
      code: 'ROLL_NO_PREVIOUS_ROLL'
    })
  }

  static RollNotEnoughPp(): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.METHOD_FAILURE,
      message: 'Pas assez de Pp !',
      code: 'ROLL_NOT_ENOUGH_PP'
    })
  }

  static RollNotEnoughArcane(): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.METHOD_FAILURE,
      message: 'Pas assez d\'arcane !',
      code: 'ROLL_NOT_ENOUGH_ARCANE'
    })
  }
}
