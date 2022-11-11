import GraphRegistry from "../GraphRegistry";
import {
  InputSocketSpecJSON,
  NodeSpecJSON,
  OutputSocketSpecJSON,
} from "./NodeSpecJSON";

export const writeNodeSpecsToJSON = (
  registry: GraphRegistry
): NodeSpecJSON[] => {
  const nodeSpecsJSON: NodeSpecJSON[] = [];

  registry.nodes.nodeTypeNameToNodeFactory.forEach((nodeFactory, nodeType) => {
    const node = nodeFactory();

    const nodeSpecJSON: NodeSpecJSON = {
      allowSettings: false,
      info: { icon: "" },
      type: nodeType,
      category: node.category,
      inputs: [],
      outputs: []
    };
    node.inputSockets.forEach((inputSocket) => {
      const socketSpecJSON: InputSocketSpecJSON = {
        name: inputSocket.name,
        defaultValue: inputSocket.value,
        valueType: inputSocket.valueTypeName,
      };
      nodeSpecJSON.inputs?.push(socketSpecJSON);
    });

    node.outputSockets.forEach((outputSocket) => {
      const socketSpecJSON: OutputSocketSpecJSON = {
        name: outputSocket.name,
        valueType: outputSocket.valueTypeName,
      };
      nodeSpecJSON.outputs?.push(socketSpecJSON);
    });

    nodeSpecsJSON.push(nodeSpecJSON);
  });

  return nodeSpecsJSON;
};
