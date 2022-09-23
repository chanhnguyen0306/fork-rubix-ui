import { useEffect, useState } from "react";
import { FlowFactory } from "./factory";
import { NodeSpecJSON } from "./lib";

export const SPEC_JSON = "spec-json";
const _nodesSpec = JSON.parse("" + localStorage.getItem(SPEC_JSON)) || [];

export let getSpecJson = (): NodeSpecJSON[] => _nodesSpec;

export const useNodesSpec = () => {
  const [nodesSpec, setNodesSpec] = useState(getSpecJson);
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
            defaultValue: input?.defaultValue
              ? input.defaultValue
              : defaultValue,
            valueType: input.valueType,
          };
        });
      }
      return node;
    });
    setNodesSpec(specJSON);
    getSpecJson = () => specJSON;
    localStorage.setItem("spec-json", JSON.stringify(specJSON));
  };

  return [nodesSpec, setNodesSpec];
};
