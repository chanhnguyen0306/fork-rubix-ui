import { Edge, Node } from "react-flow-renderer/nocss";
import { GraphJSON, NodeExtend } from "../lib";
import { generateUuid } from "../lib/generateUuid";

export const behaveToFlow = (graph: GraphJSON): [Node[], Edge[]] => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  graph.nodes.forEach((nodeJSON) => {
    const node: NodeExtend = {
      id: nodeJSON.id,
      type: nodeJSON.type ?? "",
      position: {
        x: nodeJSON.metadata?.positionX
          ? Number(nodeJSON.metadata?.positionX)
          : 0,
        y: nodeJSON.metadata?.positionY
          ? Number(nodeJSON.metadata?.positionY)
          : 0,
      },
      data: nodeJSON.data ?? ({} as { [key: string]: any }),
      style: nodeJSON.style ?? ({} as { [key: string]: any }),
      isParent: nodeJSON.isParent ?? false,
    };

    nodes.push(node);

    if (nodeJSON.inputs) {
      if (nodeJSON.inputs.links) {
        for (const [inputKey, input] of Object.entries(nodeJSON.inputs.links)) {
          const { nodeId, socket, value } = input as any;
          if (nodeId !== undefined) {
            edges.push({
              id: generateUuid(),
              source: nodeId,
              sourceHandle: socket,
              target: nodeJSON.id,
              targetHandle: inputKey,
            });
          }
          if (value !== undefined) {
            node.data[inputKey] = value;
          }
        }
      } else {
        for (const [inputKey, input] of Object.entries(nodeJSON.inputs)) {
          if (input.links !== undefined) {
            (input.links as any).forEach((link: any) => {
              edges.push({
                id: generateUuid(),
                source: link.nodeId,
                sourceHandle: link.socket,
                target: nodeJSON.id,
                targetHandle: inputKey,
              });
            });
          }
          if (input.value !== undefined) {
            node.data[inputKey] = input.value;
          }
        }
      }
    }
  });

  return [nodes, edges];
};
