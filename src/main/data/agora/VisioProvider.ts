import { IVisioProvider } from '../../domain/providers/IVisioProvider'
import { RtcTokenBuilder, RtcRole } from 'agora-access-token'

export class AgoraVisioProvider implements IVisioProvider {
  private readonly appId: string
  private readonly appCertificate: string
  private readonly visioChannel: string

  constructor(p: { appId: string; appCertificate: string; visioChannel: string } | undefined) {
    if (p) {
      this.appId = p.appId
      this.visioChannel = p.visioChannel
      this.appCertificate = p.appCertificate
    }
  }

  generateToken(): string {
    // eslint-disable-next-line no-magic-numbers
    const expireTime = 24 * 3600
    // eslint-disable-next-line no-magic-numbers
    const currentTime = Math.floor(Date.now() / 1000)
    const privilegeExpireTime = currentTime + expireTime

    return RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      this.visioChannel,
      0,
      RtcRole.PUBLISHER,
      privilegeExpireTime
    )
  }
}
