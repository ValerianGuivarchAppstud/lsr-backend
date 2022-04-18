import { GenericError } from '../../domain/GenericError'
import HttpStatus from 'http-status-codes'

export class DomainErrors {
  static Unauthorized(message: string): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: message,
      code: 'UNAUTHORIZED'
    })
  }
}
