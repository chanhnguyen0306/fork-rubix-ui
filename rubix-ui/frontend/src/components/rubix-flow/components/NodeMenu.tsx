import { useState } from "react";
import { XYPosition } from "react-flow-renderer/nocss";
import { useOnPressKey } from "../hooks/useOnPressKey";
import { FLOW_TYPE } from "../use-nodes-spec";
import { AddToParentModal } from "./AddToParentModal";
import { SettingsModal } from "./SettingsModal";

type NodeMenuProps = {
  position: XYPosition;
  node: {};
  onClose: () => void;
};

const SettingsComponent = ({ node, onClose }: any) => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const openSettingsModal = () => {
    setIsSettingsModalVisible(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalVisible(false);
    onClose();
  };

  return (
    <>
      <div
        key="settings"
        className="p-2 cursor-pointer border-b border-gray-600"
        onClick={openSettingsModal}
      >
        Settings
      </div>

      <SettingsModal
        node={node}
        isModalVisible={isSettingsModalVisible}
        onCloseModal={closeSettingsModal}
      />
    </>
  );
};

const AddToParentComponent = ({ node, onClose }: any) => {
  if (node.type !== (FLOW_TYPE.DEVICE || FLOW_TYPE.POINT)) return null; //only for types: flow/device, flow/point

  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    onClose();
  };

  return (
    <>
      <div
        key="settings"
        className="p-2 cursor-pointer border-b border-gray-600"
        onClick={openModal}
      >
        Add To Parent
      </div>

      <AddToParentModal
        node={node}
        isModalVisible={isModalVisible}
        onCloseModal={closeModal}
      />
    </>
  );
};

const NodeMenu = ({ position, node, onClose }: NodeMenuProps) => {
  const mousePosition = { x: position.x - 125, y: position.y - 20 };

  useOnPressKey("Escape", onClose);

  return (
    <>
      <div
        className="node-picker absolute z-10 text-white bg-gray-800 border rounded border-gray-500"
        style={{ top: mousePosition.y, left: mousePosition.x }}
      >
        <div className="bg-gray-500 p-2">Node Menu</div>
        <div className="overflow-y-scroll" style={{ maxHeight: "23rem" }}>
          <SettingsComponent node={node} onClose={onClose} />
          <AddToParentComponent node={node} onClose={onClose} />
        </div>
      </div>
    </>
  );
};
export default NodeMenu;
