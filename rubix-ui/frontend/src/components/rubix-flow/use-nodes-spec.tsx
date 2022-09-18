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
    const res = ((await factory.NodePallet()) || []) as NodeSpecJSON[];
    setNodesSpec(res);
  };

  return [nodesSpec, setNodesSpec];
};
