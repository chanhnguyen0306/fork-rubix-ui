import { NodeTypes } from "react-flow-renderer/nocss";
import { Node } from "../components/Node";
import { getSpecJson } from "../use-nodes-spec";

const specJSON = getSpecJson();
console.log("customNodeTypes-specJSON", specJSON);

export const customNodeTypes = specJSON.reduce((nodes, node) => {
  nodes[node.type] = (props: any) => <Node {...props} spec={node} />;
  return nodes;
}, {} as NodeTypes);
