import { FC, useState } from "react";
import { useReactFlow } from "react-flow-renderer/nocss";
import { behaveToFlow } from "../transformers/behaveToFlow";
import { autoLayout } from "../util/autoLayout";
import { hasPositionMetaData } from "../util/hasPositionMetaData";
import { Modal } from "./Modal";
import { GraphJSON } from "../lib";

import Branch from "../examples/basics/Branch.json";
import Delay from "../examples/basics/Delay.json";
import HelloWorld from "../examples/basics/HelloWorld.json";
import Math from "../examples/basics/Math.json";
import State from "../examples/basics/State.json";
import { handleNodesEmptySettings } from "../util/handleSettings";
import { useParams } from "react-router-dom";

const examples = {
  branch: Branch,
  delay: Delay,
  helloWorld: HelloWorld,
  math: Math,
  state: State,
} as Record<string, GraphJSON>;

export type LoadModalProps = {
  open?: boolean;
  onClose: () => void;
};

export const LoadModal: FC<LoadModalProps> = ({ open = false, onClose }) => {
  const [value, setValue] = useState<string>();
  const [selected, setSelected] = useState("");
  const { connUUID = "", hostUUID = "" } = useParams();
  const isRemote = connUUID && hostUUID ? true : false;

  const instance = useReactFlow();

  const handleLoad = async () => {
    let graph;
    if (value !== undefined) {
      graph = JSON.parse(value) as GraphJSON;
    } else if (selected !== "") {
      graph = examples[selected];
    }

    if (graph === undefined) return;

    let [nodes, edges] = behaveToFlow(graph);

    if (hasPositionMetaData(graph) === false) {
      autoLayout(nodes, edges);
    }

    nodes = await handleNodesEmptySettings(connUUID, hostUUID, isRemote, nodes);

    instance.setNodes([...instance.getNodes(), ...nodes]);
    instance.setEdges([...instance.getEdges(), ...edges]);

    // TODO better way to call fit vew after edges render
    setTimeout(() => {
      instance.fitView();
    }, 100);

    handleClose();
  };

  const handleClose = () => {
    setValue(undefined);
    setSelected("");
    onClose();
  };

  return (
    <Modal
      title="Load Graph"
      actions={[
        { label: "Cancel", onClick: handleClose },
        { label: "Load", onClick: handleLoad },
      ]}
      open={open}
      onClose={onClose}
    >
      <textarea
        autoFocus
        className="border border-gray-300 p-2 align-top"
        placeholder="Paste JSON here"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        style={{ height: "50vh", width: "500px" }}
      />
      <div className="p-4 text-center text-gray-800">or</div>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded block w-full p-3"
        onChange={(e) => setSelected(e.target.value)}
        value={selected}
      >
        <option disabled value="">
          Select an example
        </option>
        <option value="branch">Branch</option>
        <option value="delay">Delay</option>
        <option value="helloWorld">Hello World</option>
        <option value="math">Math</option>
        <option value="state">State</option>
      </select>
    </Modal>
  );
};
