import {
  EdgeBiosLogin,
  EdgeBiosTokens
} from "../../../../wailsjs/go/backend/App";

export class EdgeBiosTokenFactory {
  connectionUUID!: string;
  hostUUID!: string;

  public EdgeBiosLogin(username: string, password: string): Promise<any> {
    return EdgeBiosLogin(this.connectionUUID, this.hostUUID, username, password);
  }

  public EdgeBiosTokens(jwt_token: string): Promise<any> {
    return EdgeBiosTokens(this.connectionUUID, this.hostUUID, jwt_token);
  }
}
