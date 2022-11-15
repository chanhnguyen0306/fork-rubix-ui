import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DEFAULT_NODE_SPEC_JSON } from "./components/NodeMenu";
import { FlowFactory } from "./factory";
import { InputSocketSpecJSON, NodeSpecJSON, OutputSocketSpecJSON } from "./lib";

export const SPEC_JSON = "spec-json";
export const NODES_JSON = "nodes-json";

const _nodesSpec = JSON.parse("" + localStorage.getItem(SPEC_JSON)) || [];

export let getSpecJson = (): NodeSpecJSON[] => _nodesSpec;

export const useNodesSpec = () => {
  const [nodesSpec, setNodesSpec] = useState(getSpecJson);
  const [isFetchingNodeSpec, setIsFetchingNodeSpec] = useState(false);
  const { connUUID = "", hostUUID = "" } = useParams();
  const isRemote = connUUID && hostUUID ? true : false;

  const factory = new FlowFactory();

  useEffect(() => {
    fetch();
  }, [nodesSpec.length, connUUID, hostUUID]);

  const setDefaultInputValue = (inputs: InputSocketSpecJSON[]) => {
    return inputs.map((input) => {
      let defaultValue = null;
      switch (input?.valueType) {
        case "number":
          defaultValue = null;
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
        defaultValue: input?.defaultValue ? input.defaultValue : defaultValue,
        valueType: input.valueType,
      };
    });
  };

  const fetch = async () => {
    setIsFetchingNodeSpec(true);
    let specJSON = ((await factory.NodePallet(
      connUUID,
      hostUUID,
      isRemote,
      ""
    )) || []) as NodeSpecJSON[];
    if (specJSON.length > 0) {
      specJSON = specJSON.map((node: NodeSpecJSON) => {
        if (node.inputs && node.inputs.length > 0) {
          node.inputs = setDefaultInputValue(node.inputs);
        }
        return node;
      });
    }
    setNodesSpec(specJSON);
    getSpecJson = () => specJSON;
    localStorage.setItem(SPEC_JSON, JSON.stringify(specJSON));
    setIsFetchingNodeSpec(false);
  };

  return [nodesSpec, setNodesSpec, isFetchingNodeSpec];
};

export const getNodeSpecDetail = (
  nodesSpec: NodeSpecJSON[] | any,
  nodeType: string
) => {
  return (
    nodesSpec.find((item: NodeSpecJSON) => item.type === nodeType) ||
    DEFAULT_NODE_SPEC_JSON
  );
};

export const convertDataSpec = (
  specs: InputSocketSpecJSON[] | OutputSocketSpecJSON[]
) => {
  if (!specs || specs.length === 0) return [];
  return specs.map((item) => ({
    ...item,
    pin: item.name,
    dataType: item.valueType,
  }));
};