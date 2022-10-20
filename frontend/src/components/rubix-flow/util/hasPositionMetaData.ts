import { GraphJSON } from "../lib";

export const hasPositionMetaData = (graph: GraphJSON): boolean => {
  if (!graph.nodes) {
    return false;
  }

  return graph.nodes.some(
    (node) =>
      node.metadata?.positionX !== undefined ||
      node.metadata?.positionY !== undefined
  );
};
