import { DownloadFlow, NodePallet } from "../../../wailsjs/go/main/App";

export class FlowFactory {
  async NodePallet() {
    return await NodePallet();
  }

  async DownloadFlow(encodedNodes: any, restartFlow: boolean) {
    return await DownloadFlow(encodedNodes, restartFlow);
  }
}
