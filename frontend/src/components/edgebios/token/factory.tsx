import {
  EdgeBiosLogin,
  EdgeBiosTokenBlock,
  EdgeBiosTokenDelete,
  EdgeBiosTokenGenerate,
  EdgeBiosTokenRegenerate,
  EdgeBiosTokens
} from "../../../../wailsjs/go/backend/App";

export class EdgeBiosTokenFactory {
  connectionUUID!: string;
  hostUUID!: string;

  public EdgeBiosLogin(username: string, password: string): Promise<any> {
    return EdgeBiosLogin(this.connectionUUID, this.hostUUID, username, password);
  }

  public EdgeBiosTokens(jwtToken: string): Promise<any> {
    return EdgeBiosTokens(this.connectionUUID, this.hostUUID, jwtToken);
  }

  public EdgeBiosTokenGenerate(jwtToken: string, name: string): Promise<any> {
    return EdgeBiosTokenGenerate(this.connectionUUID, this.hostUUID, jwtToken, name);
  }

  public EdgeBiosTokenBlock(jwtToken: string, uuid: string, block: boolean): Promise<any> {
    return EdgeBiosTokenBlock(this.connectionUUID, this.hostUUID, jwtToken, uuid, block);
  }

  public EdgeBiosTokenRegenerate(jwtToken: string, uuid: string): Promise<any> {
    return EdgeBiosTokenRegenerate(this.connectionUUID, this.hostUUID, jwtToken, uuid);
  }

  public EdgeBiosTokenDelete(jwtToken: string, uuid: string): Promise<any> {
    return EdgeBiosTokenDelete(this.connectionUUID, this.hostUUID, jwtToken, uuid);
  }
}
