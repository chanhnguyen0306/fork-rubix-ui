import { Edge, OnConnectStartParams } from "react-flow-renderer/nocss";
import { NodeInterface } from "../lib/Nodes/NodeInterface";

type LastConnectParams = {
  nodeId: string;
  handleId: string;
};

export const isValidConnection = (
  nodes: NodeInterface[],
  firstConnect: OnConnectStartParams,
  lastConnect: LastConnectParams,
  isDragSelected = false,
) => {
  const firstNode = nodes.find((item) => item.id === firstConnect.nodeId);
  const lastNode = nodes.find((item) => item.id === lastConnect.nodeId);

  if (!firstNode || !lastNode) return false;

  /* isDragSelected = true then the 2 connections will be equal */
  const isGetDataInputs = firstConnect.handleType === "target";
  const isGetDataOut = isDragSelected ? isGetDataInputs : !isGetDataInputs;

  const arrHandleIds = [
    getNodeType(firstNode, firstConnect.handleId || "", isGetDataInputs),
    getNodeType(lastNode, lastConnect.handleId || "", isGetDataOut),
  ];
  const occurrences = arrHandleIds.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
  }, {}); /* eg return: {string: 1:, number: 1} */
  const occString = occurrences["string"];

  return !occString || occString === 0 || occString === 2;
};

const getNodeType = (
  node: NodeInterface,
  handleId: string,
  isGetDataInputs: boolean,
) => {
  let nodeHandle;
  if (isGetDataInputs) {
    nodeHandle = node?.data?.inputs.find((item: any) => item.pin === handleId);
  } else {
    nodeHandle = node?.data?.out.find((item: any) => item.pin === handleId);
  }
  return nodeHandle && nodeHandle.dataType;
};

/* Max one connection per input */
export const isInputExistConnection = (
  edges: Edge[],
  connTarget: string,
  connTargetHandle: string,
  param: "target" | "source" = "target",
) => {
  return !!edges.find(
    (edge) =>
      edge[param] === connTarget && edge[`${param}Handle`] === connTargetHandle
  );
};
