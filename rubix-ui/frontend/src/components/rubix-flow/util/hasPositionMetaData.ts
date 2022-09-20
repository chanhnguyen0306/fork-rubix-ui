import { GraphJSON } from "../lib";

export const hasPositionMetaData = (graph: GraphJSON): boolean => {
  return graph.nodes.some(
    (node) =>
      node.metadata?.positionX !== undefined ||
      node.metadata?.positionY !== undefined
  );
};
