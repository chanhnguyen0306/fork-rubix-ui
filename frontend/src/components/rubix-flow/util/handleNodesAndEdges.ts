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
  let newEdges: Edge[] = [...flow.edges];

  /* Generate new id of nodes */
  const newNodes: NodeInterface[] = flow.nodes.map((item) => {
    const newNodeId = generateUuid();

    /*
     * Generate new id of edges
     * Add new id source and target of edges
     */
    newEdges = newEdges.map((edge) => ({
      ...edge,
      id: generateUuid(),
      source: edge.source === item.id ? newNodeId : edge.source,
      target: edge.target === item.id ? newNodeId : edge.target,
      selected: isAutoSelected,
    }));

    return {
      ...item,
      id: newNodeId,
      position: { x: item.position.x + 10, y: item.position.y - 10 },
      selected: isAutoSelected,
      data: {
        ...item.data,
        input: undefined,
        output: undefined,
      },
    };
  });

  return {
    nodes: newNodes,
    edges: newEdges,
  };
};
