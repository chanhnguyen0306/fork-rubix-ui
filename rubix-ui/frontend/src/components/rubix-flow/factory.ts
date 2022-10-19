import {
  AddWiresConnection,
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
} from "../../../wailsjs/go/main/App";
import {db, node} from "../../../wailsjs/go/models";

export class FlowFactory {


  async GetWiresConnections(): Promise<Array<db.Connection>> {
    return await GetWiresConnections();
  }

  async GetWiresConnection(uuid: string): Promise<db.Connection> {
    return await GetWiresConnection(uuid);
  }

  async DeleteWiresConnection(uuid: string) {
    await DeleteWiresConnection(uuid);
  }

  async UpdateWiresConnection(uuid: string, body: db.Connection): Promise<db.Connection> {
    return await UpdateWiresConnection(uuid, body);
  }

  async AddWiresConnection(body: db.Connection): Promise<db.Connection> {
    return await AddWiresConnection(body);
  }

  async NodeValue(nodeUUID: string): Promise<node.Values> {
    return await NodeValue(nodeUUID);
  }

  async NodeSchema(nodeName: string) {
    return await NodeSchema(nodeName);
  }

  async NodeValues(): Promise<Array<node.Values>> {
    return await NodeValues();
  }

  async GetFlow(): Promise<any> {
    return await GetFlow();
  }

  async NodePallet() {
    return await NodePallet();
  }

  async DownloadFlow(encodedNodes: any, restartFlow: boolean) {
    return await DownloadFlow(encodedNodes, restartFlow);
  }
}
