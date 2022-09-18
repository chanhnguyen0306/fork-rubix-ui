import { useEffect, useState } from "react";
import { NodeTypes } from "react-flow-renderer/nocss";
import { Node } from "../components/Node";
import { NodeSpecJSON } from "../lib";

export const customNodeTypes = (spec: NodeSpecJSON[]) => {
  return spec.reduce((nodes, node) => {
    nodes[node.type] = (props: any) => <Node {...props} spec={node} />;
    return nodes;
  }, {} as NodeTypes);
};
