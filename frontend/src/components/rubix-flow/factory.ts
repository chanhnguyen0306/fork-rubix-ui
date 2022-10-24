import {
  AddWiresConnection, BulkDeleteWiresConnection,
  DeleteWiresConnection,
  DownloadFlow,
  GetFlow,
  GetWiresConnection,
  GetWiresConnections,
  NodePallet,
  NodeSchema,
  NodeValue,
  NodeValues,
  UpdateWiresConnection
} from "../../../wailsjs/go/backend/App";
import {db, node} from "../../../wailsjs/go/models";

export class FlowFactory {

  // arg1 is the connectionUUID
  // arg2 is hostUUID
  // arg3 is used when user is programming on flow localhost (as in running rubix-edge-wires backend on their PC)
  // set arg3 to true if its a remote connection

  async BulkDeleteWiresConnection(uuids: Array<string>):Promise<any> {
    return await BulkDeleteWiresConnection("", "",false, uuids);
  }

  async GetWiresConnections(): Promise<Array<db.Connection>> {
    return await GetWiresConnections("", "",false);
  }

  async GetWiresConnection(uuid: string): Promise<db.Connection> {
    return await GetWiresConnection("", "",false, uuid);
  }

  async DeleteWiresConnection(uuid: string) {
    await DeleteWiresConnection("", "",false, uuid);
  }

  async UpdateWiresConnection(uuid: string, body: db.Connection): Promise<db.Connection> {
    return await UpdateWiresConnection("", "",false, uuid, body);
  }

  async AddWiresConnection(body: db.Connection): Promise<db.Connection> {
    return await AddWiresConnection("", "",false, body);
  }

  async NodeValue(nodeUUID: string): Promise<node.Values> {
    return await NodeValue("", "",false, nodeUUID);
  }

  async NodeSchema(nodeName: string) {
    return await NodeSchema("", "",false, nodeName);
  }

  async NodeValues(): Promise<Array<node.Values>> {
    return await NodeValues("", "",false);
  }

  async GetFlow(): Promise<any> {
    return await GetFlow("", "",false);
  }

  async NodePallet() {
    return await NodePallet("", "",false);
  }

  async DownloadFlow(encodedNodes: any, restartFlow: boolean) {
    return await DownloadFlow("", "",false, encodedNodes, restartFlow);
  }
}
