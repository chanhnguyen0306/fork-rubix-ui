import {
  DownloadFlow,
  NodePallet,
  NodeSchema
} from "../../../wailsjs/go/main/App";

export class FlowFactory {

  async NodeSchema(nodeName:string) {
    return await NodeSchema(nodeName);
  }


  async NodePallet() {
    return await NodePallet();
  }

  async DownloadFlow(encodedNodes: any, restartFlow: boolean) {
    return await DownloadFlow(encodedNodes, restartFlow);
  }
}
