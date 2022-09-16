import { Connection, ReactFlowInstance } from "react-flow-renderer/nocss";
import { NodeSpecJSON } from "../lib";
import { getSocketsByNodeTypeAndHandleType } from "./getSocketsByNodeTypeAndHandleType";
import { useNodesSpec } from "../use-nodes-spec";

export const isValidConnection = (
  connection: Connection,
  instance: ReactFlowInstance
) => {
  if (connection.source === null || connection.target === null) return false;

  const sourceNode = instance.getNode(connection.source);
  const targetNode = instance.getNode(connection.target);

  if (sourceNode === undefined || targetNode === undefined) return false;

  const [nodesSpec] = useNodesSpec();
  const specJSON = nodesSpec as NodeSpecJSON[];

  const sourceSockets = getSocketsByNodeTypeAndHandleType(
    specJSON,
    sourceNode.type,
    "source"
  );

  const sourceSocket = sourceSockets?.find(
    (socket) => socket.name === connection.sourceHandle
  );

  const targetSockets = getSocketsByNodeTypeAndHandleType(
    specJSON,
    targetNode.type,
    "target"
  );

  const targetSocket = targetSockets?.find(
    (socket) => socket.name === connection.targetHandle
  );

  if (sourceSocket === undefined || targetSocket === undefined) return false;

  return sourceSocket.valueType === targetSocket.valueType;
};
