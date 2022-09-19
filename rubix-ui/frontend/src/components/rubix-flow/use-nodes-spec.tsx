import { useEffect, useState } from "react";
import { FlowFactory } from "./factory";
import { NodeSpecJSON } from "./lib";

export const useNodesSpec = () => {
  const [nodesSpec, setNodesSpec] = useState([] as NodeSpecJSON[]);
  const factory = new FlowFactory();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    let specJSON = ((await factory.NodePallet()) || []) as NodeSpecJSON[];
    specJSON = specJSON.map((node: NodeSpecJSON) => {
      if (node.inputs && node.inputs.length > 0) {
        node.inputs = node.inputs.map((input) => {
          let defaultValue = null;
          switch (input?.valueType) {
            case "number":
              defaultValue = 0;
              break;
            case "string":
              defaultValue = "";
              break;
            case "boolean":
              defaultValue = false;
              break;
          }
          return {
            name: input.name,
            defaultValue: defaultValue as any,
            valueType: input.valueType,
          };
        });
      }
      return node;
    });
    setNodesSpec(specJSON);
  };

  return [nodesSpec, setNodesSpec];
};
