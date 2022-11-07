import { Edge } from "react-flow-renderer";
import { generateUuid } from "../lib/generateUuid";
import { NodeInterface } from "../lib/Nodes/NodeInterface";

export const handleCopyNodesAndEdges = (
  flow: {
    nodes: NodeInterface[];
    edges: Edge[];
  },
  isAutoSelected = true
) => {
  /* Generate new id of nodes */
  flow.nodes = flow.nodes.map((item) => {
    const __newNodeId = generateUuid();

    /*
     * Generate new id of edges
     * Add new id source and target of edges
     */
    flow.edges = flow.edges.map((edge) => ({
      ...edge,
      id: generateUuid(),
      source: edge.source === item.id ? __newNodeId : edge.source,
      target: edge.target === item.id ? __newNodeId : edge.target,
      selected: isAutoSelected,
    }));

    return {
      ...item,
      id: __newNodeId,
      position: { x: item.position.x + 10, y: item.position.y - 10 },
      selected: isAutoSelected,
      data: {
        ...item.data,
        input: undefined,
        output: undefined,
      },
    };
  });

  return flow;
};
