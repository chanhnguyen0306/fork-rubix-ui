import { useEffect, useState } from "react";
import { ClearModal } from "./ClearModal";
import { HelpModal } from "./HelpModal";
import { LoadModal } from "./LoadModal";
import { SaveModal } from "./SaveModal";
import { flowToBehave } from "../transformers/flowToBehave";
import { useReactFlow } from "react-flow-renderer/nocss";
import { useKeyPress } from "react-flow-renderer";
import {
  QuestionCircleOutlined,
  DownloadOutlined,
  RestOutlined,
  UploadOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { FlowFactory } from "../factory";

const Controls = () => {
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const instance = useReactFlow();

  const ctrlAndEPressed = useKeyPress("Control+e");
  const ctrlAndIPressed = useKeyPress("Control+i");
  const ctrlAndDPressed = useKeyPress("Control+d");
  const ctrlAndAPressed = useKeyPress("Control+a");

  const factory = new FlowFactory();

  const download = async () => {
    const nodes = instance.getNodes();
    const edges = instance.getEdges();
    const graphJson = flowToBehave(nodes, edges);
    await factory.DownloadFlow(graphJson, true);
  };

  /* Ctrl + e (key): Save Graph */
  useEffect(() => {
    ctrlAndEPressed && setSaveModalOpen(true);
  }, [ctrlAndEPressed]);

  /* Ctrl + i (key): Load Graph */
  useEffect(() => {
    ctrlAndIPressed && setLoadModalOpen(true);
  }, [ctrlAndIPressed]);

  /* Ctrl + d (key): Clear items selected */
  useEffect(() => {
    if (!ctrlAndDPressed) return;

    const _nodes = instance.getNodes();
    const _edges = instance.getEdges();

    const newNodes = _nodes.filter((item) => !item.selected);
    const newEdges = _edges.filter((item) => !item.selected);

    instance.setNodes(newNodes);
    instance.setEdges(newEdges);
  }, [ctrlAndDPressed]);

  /* Ctrl + a (key): Select all items */
  useEffect(() => {
    if (!ctrlAndAPressed) return;

    const _nodes = instance.getNodes();
    const _edges = instance.getEdges();

    const newNodes = _nodes.map((item) => {
      item.selected = true;
      return item;
    });
    const newEdges = _edges.map((item) => {
      item.selected = true;
      return item;
    });

    instance.setNodes(newNodes);
    instance.setEdges(newEdges);
  }, [ctrlAndAPressed]);

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
