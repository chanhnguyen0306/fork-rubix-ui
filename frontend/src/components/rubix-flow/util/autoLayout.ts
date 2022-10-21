import { Edge, Node } from "react-flow-renderer/nocss";

export const autoLayout = (nodes: Node[], edges: Edge[]) => {
  let x = 0;
  nodes.forEach((node) => {
    node.position.x = x;
    x += 200;
  });
};

export const deviantMousePositionX = 300;
export const deviantMousePositionY = 20;
