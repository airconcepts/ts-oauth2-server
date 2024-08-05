import * as jose from 'jose';
import { OAuthClient } from "../entities/client.entity.js";
import { OAuthUser } from "../entities/user.entity.js";

export type ExtraAccessTokenFields = Record<string, string | number | boolean | (string | number | boolean)[]>;
export type ExtraAccessTokenFieldArgs = {
  user?: OAuthUser | null;
  client: OAuthClient;
};
export interface JwtInterface {
  verify(token: string): Promise<Record<string, unknown>>;
  decode(encryptedData: string): Promise<Record<string, unknown> | null>;
  sign(payload: Record<string, unknown>): Promise<string>;
  extraTokenFields?(params: ExtraAccessTokenFieldArgs): ExtraAccessTokenFields | Promise<ExtraAccessTokenFields>;
}

export class JwtService implements JwtInterface {
  private readonly encoder;

  constructor(private readonly secretOrPrivateKey: string) {
    this.encoder = new TextEncoder();
  }

  /**
   * Asynchronously verify given token using a secret or a public key to get a decoded token
   */
  async verify(token: string): Promise<Record<string, unknown>> {
    const secret = this.encoder.encode(this.secretOrPrivateKey);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as Record<string, unknown>;
  }

  /**
   * Returns the decoded payload without verifying if the signature is valid.
   */
  async decode(encryptedData: string): Promise<Record<string, unknown> | null> {
    const payload = jose.decodeJwt(encryptedData);
    return payload as Record<string, unknown> | null;
  }

  /**
   * Sign the given payload into a JSON Web Token string
   */
  async sign(payload: Record<string, unknown>): Promise<string> {
    const secret = this.encoder.encode(this.secretOrPrivateKey);
    return new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);
  }
}