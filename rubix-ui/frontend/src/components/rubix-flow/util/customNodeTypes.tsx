import { NodeTypes } from "react-flow-renderer/nocss";
import { Node } from "../components/Node";
import { NodeSpecJSON } from "../lib";
import specJson from "../lib/node-spec.json";

const spec = specJson as NodeSpecJSON[];

export const customNodeTypes = spec.reduce((nodes, node) => {
  nodes[node.type] = (props: any) => <Node spec={node} {...props} />;
  return nodes;
}, {} as NodeTypes);
