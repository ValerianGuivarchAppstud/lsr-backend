import { Authentication } from '../../domain/models/auth/Authentication'
import { Authority } from '../../domain/models/auth/Authority'
import { JWTToken } from '../../domain/models/auth/JWTToken'
import { ITokenProvider } from '../../../../../lsr-backend/src/main/domain/providers/ITokenProvider'
import { ProviderErrors } from '../errors/ProviderErrors'
import { decode, sign, TokenExpiredError, verify } from 'jsonwebtoken'

export class JwtTokenProvider implements ITokenProvider {
  private readonly jwtSecret: string

  constructor(p: { jwtSecret: string }) {
    this.jwtSecret = p.jwtSecret
  }

  async generateTokens(p: { accountId: string; authority: Authority; secret: string }): Promise<JWTToken> {
    const expirationAccess = 86_400 // 1 day
    const expirationRefresh = 2_592_000 // 30 days
    const accessToken = sign({ authority: p.authority }, this.jwtSecret + p.secret, {
      subject: p.accountId.toString(),
      expiresIn: expirationAccess
    })
    const refreshToken = sign({ authority: p.authority, accessToken: accessToken }, this.jwtSecret + p.secret, {
      subject: p.accountId.toString(),
      expiresIn: expirationRefresh
    })
    const today = new Date()
    return new JWTToken({
      accessToken: accessToken,
      // eslint-disable-next-line no-magic-numbers
      accessTokenExpirationDate: new Date(today.getTime() + 1_000 * expirationAccess),
      refreshToken: refreshToken,
      // eslint-disable-next-line no-magic-numbers
      refreshTokenExpirationDate: new Date(today.getTime() + 1_000 * expirationRefresh),
      authority: p.authority
    })
  }

  async unpackToken(token: string): Promise<Authentication> {
    const token2 = decode(token)
    if (!token2) {
      throw ProviderErrors.WrongToken()
    }
    if (typeof token2 === 'object') {
      return new Authentication({
        authority: token2.authority,
        issuedAt: new Date(token2.iat ?? 0),
        expiresAt: new Date(token2.exp ?? 0),
        subject: token2.sub ?? '',
        isRefreshToken: 'accessToken' in token2
      })
    }
    throw ProviderErrors.WrongToken()
  }

  async verifyToken(accessToken: string, secret: string): Promise<void> {
    try {
      await verify(accessToken, this.jwtSecret + secret)
      return
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw ProviderErrors.ExpiredToken()
      }
    }
    throw ProviderErrors.WrongToken()
  }
}
