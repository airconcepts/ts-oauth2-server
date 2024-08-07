
import { base64urlencode } from "../utils/base64.js";
import { ICodeChallenge } from "./verifier.js";
import { Buffer } from "node:buffer";
const encoder = new TextEncoder()
export class S256Verifier implements ICodeChallenge {
  public readonly method = "S256";

  async verifyCodeChallenge(codeVerifier: string, codeChallenge: string) {
    const data = encoder.encode(codeVerifier)
    const codeHash = await crypto.subtle.digest("SHA-256", data);
    return codeChallenge === base64urlencode(Buffer.from(codeHash));
  }
}
