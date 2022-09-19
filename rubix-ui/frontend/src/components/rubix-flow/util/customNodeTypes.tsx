import { NodeTypes } from "react-flow-renderer/nocss";
import { Node } from "../components/Node";
import { NodeSpecJSON } from "../lib";

const specJSON = JSON.parse(
  localStorage.getItem("spec-json")?.toString() || ""
) as NodeSpecJSON[];

export const customNodeTypes = specJSON.reduce((nodes, node) => {
  nodes[node.type] = (props: any) => <Node {...props} spec={node} />;
  return nodes;
}, {} as NodeTypes);
