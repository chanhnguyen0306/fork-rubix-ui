import { useState } from "react";
import { ClearModal } from "./ClearModal";
import { HelpModal } from "./HelpModal";
import { LoadModal } from "./LoadModal";
import { SaveModal } from "./SaveModal";
import { flowToBehave } from "../transformers/flowToBehave";
import { useReactFlow } from "react-flow-renderer/nocss";
import {
  GraphEvaluator,
  GraphJSON,
  GraphRegistry,
  readGraphFromJSON,
  registerGenericNodes,
} from "../lib";
import {
  QuestionCircleOutlined,
  DownloadOutlined,
  RestOutlined,
  UploadOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { FlowFactory } from "../factory";
import rawGraphJSON from "../graph.json";

const Controls = () => {
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const instance = useReactFlow();

  const factory = new FlowFactory();

  const handleRun = () => {
    const registry = new GraphRegistry();
    registerGenericNodes(registry.nodes);
    const nodes = instance.getNodes();
    const edges = instance.getEdges();
    const graphJson = flowToBehave(nodes, edges);
    const graph = readGraphFromJSON(graphJson, registry);
    const evaluator = new GraphEvaluator(graph);
    evaluator.triggerEvents("event/start");
    evaluator.executeAllAsync();
  };

  const download = async () => {
    const nodes = instance.getNodes();
    const graphJSON = { nodes };
    const res = await factory.DownloadFlow(graphJSON, true);
    console.log("encodeNodes", graphJSON);
    console.log("res", res);
  };

  return (
    <>
      <div className="absolute top-4 right-4 bg-white z-10 flex black--text">
        <div
          className="cursor-pointer border-r bg-white hover:bg-gray-100"
          title="Help"
          onClick={() => setHelpModalOpen(true)}
        >
          <QuestionCircleOutlined className="p-2 text-gray-700 align-middle" />
        </div>
        <div
          className="cursor-pointer border-r bg-white hover:bg-gray-100"
          title="Load"
          onClick={() => setLoadModalOpen(true)}
        >
          <UploadOutlined className="p-2 text-gray-700 align-middle" />
        </div>
        <div
          className="cursor-pointer border-r bg-white hover:bg-gray-100"
          title="Save"
          onClick={() => setSaveModalOpen(true)}
        >
          <DownloadOutlined className="p-2 text-gray-700 align-middle" />
        </div>
        <div
          className="cursor-pointer border-r bg-white hover:bg-gray-100"
          title="Clear"
          onClick={() => setClearModalOpen(true)}
        >
          <RestOutlined className="p-2 text-gray-700 align-middle" />
        </div>
        <div
          className="cursor-pointer border-r bg-white hover:bg-gray-100"
          title="Run"
          onClick={() => download()}
        >
          <PlayCircleOutlined className="p-2 text-gray-700 align-middle" />
        </div>
      </div>
      <LoadModal open={loadModalOpen} onClose={() => setLoadModalOpen(false)} />
      <SaveModal open={saveModalOpen} onClose={() => setSaveModalOpen(false)} />
      <HelpModal open={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
      <ClearModal
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
      />
    </>
  );
};

export default Controls;
