import { Node, OnConnectStartParams } from "react-flow-renderer/nocss";
import { NodePickerFilters } from "../components/NodePicker";
import { getSocketsByNodeTypeAndHandleType } from "./getSocketsByNodeTypeAndHandleType";
import { NodeSpecJSON } from "../lib";
import specJson from "../lib/node-spec.json";

const specJSON = specJson as NodeSpecJSON[];

export const getNodePickerFilters = (
  nodes: Node[],
  params: OnConnectStartParams | undefined
): NodePickerFilters | undefined => {
  if (params === undefined) return;

  const originNode = nodes.find((node) => node.id === params.nodeId);
  if (originNode === undefined) return;

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
