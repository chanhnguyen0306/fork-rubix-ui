import { Node, OnConnectStartParams } from "react-flow-renderer/nocss";
import { NodePickerFilters } from "../components/NodePicker";
import { getSocketsByNodeTypeAndHandleType } from "./getSocketsByNodeTypeAndHandleType";
import { NodeSpecJSON } from "../lib";
import { useNodesSpec } from "../use-nodes-spec";

export const getNodePickerFilters = (
  nodes: Node[],
  params: OnConnectStartParams | undefined
): NodePickerFilters | undefined => {
  if (params === undefined) return;

  const originNode = nodes.find((node) => node.id === params.nodeId);
  if (originNode === undefined) return;

  const [nodesSpec] = useNodesSpec();
  const specJSON = nodesSpec as NodeSpecJSON[];

  const sockets = getSocketsByNodeTypeAndHandleType(
    specJSON,
    originNode.type,
    params.handleType
  );

  const socket = sockets?.find(
    (socket: any) => socket.name === params.handleId
  );

  if (socket === undefined) return;

  return {
    handleType: params.handleType === "source" ? "target" : "source",
    valueType: socket.valueType,
  };
};
