import { OnConnectStartParams } from "react-flow-renderer";
import { NodeInterface } from "../lib/Nodes/NodeInterface";

type LastConnectParams = {
  nodeId: string;
  handleId: string;
};

export const isValidConnection = (
  nodes: NodeInterface[],
  firstConnect: OnConnectStartParams,
  lastConnect: LastConnectParams
) => {
  const firstNode = nodes.find((item) => item.id === firstConnect.nodeId);
  const lastNode = nodes.find((item) => item.id === lastConnect.nodeId);

  if (!firstNode || !lastNode) return false;

  const arrHandleIds = [
    getNodeType(firstNode, firstConnect.handleId || ""),
    getNodeType(lastNode, lastConnect.handleId || ""),
  ];
  const occurrences = arrHandleIds.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
  }, {}); /* eg return: {string: 1:, number: 1} */
  const occString = occurrences["string"];

  return !occString || occString === 0 || occString === 2;
};

const getNodeType = (node: NodeInterface, handleId: string) => {
  let nodeHandle;
  if (handleId && handleId.indexOf("in") !== -1) {
    nodeHandle = node?.data?.inputs.find((item: any) => item.pin === handleId);
  } else {
    nodeHandle = node?.data?.out.find((item: any) => item.pin === handleId);
  }
  return nodeHandle && nodeHandle.dataType;
};
