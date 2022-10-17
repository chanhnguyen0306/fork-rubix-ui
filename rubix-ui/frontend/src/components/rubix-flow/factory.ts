import {
  DownloadFlow, GetFlow,
  NodePallet,
  NodeSchema, NodeValues, NodeValue
} from "../../../wailsjs/go/main/App";
import {node} from "../../../wailsjs/go/models";

export class FlowFactory {

  async NodeValue(nodeUUID:string): Promise<node.Values> {
    return await NodeValue(nodeUUID);
  }

  async NodeSchema(nodeName:string) {
    return await NodeSchema(nodeName);
  }

  async NodeValues(): Promise<Array<node.Values>> {
    return await NodeValues();
  }

  async GetFlow():Promise<any> {
    return await GetFlow();
  }

  async NodePallet() {
    return await NodePallet();
  }

  async DownloadFlow(encodedNodes: any, restartFlow: boolean) {
    return await DownloadFlow(encodedNodes, restartFlow);
  }
}
