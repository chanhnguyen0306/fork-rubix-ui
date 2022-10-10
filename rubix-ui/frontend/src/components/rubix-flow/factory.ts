import {
  DownloadFlow,
  NodePallet,
  NodeSchema, NodeValues
} from "../../../wailsjs/go/main/App";
import {node} from "../../../wailsjs/go/models";

export class FlowFactory {

  async NodeSchema(nodeName:string) {
    return await NodeSchema(nodeName);
  }

  async NodeValues(): Promise<Array<node.Values>> {
    return await NodeValues();
  }

  async NodePallet() {
    return await NodePallet();
  }

  async DownloadFlow(encodedNodes: any, restartFlow: boolean) {
    return await DownloadFlow(encodedNodes, restartFlow);
  }
}
