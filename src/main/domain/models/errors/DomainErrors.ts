import { GenericError } from '../../GenericError'
import HttpStatus from 'http-status-codes'

export class DomainErrors {
  static AuthFailed(): GenericError {
    return GenericError.of({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: `Authentication token is wrong or missing`,
      code: 'AUTH_FAILED'
    })
  }
}
