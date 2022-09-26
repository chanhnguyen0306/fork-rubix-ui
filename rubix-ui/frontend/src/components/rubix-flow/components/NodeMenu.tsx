import { useState } from "react";
import { XYPosition } from "react-flow-renderer/nocss";
import { useOnPressKey } from "../hooks/useOnPressKey";
import { SettingsModal } from "./SettingsModal";

type NodeMenuProps = {
  position: XYPosition;
  nodeType: string;
  onClose: () => void;
};

const NodeMenu = ({ position, nodeType, onClose }: NodeMenuProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const mousePosition = { x: position.x - 125, y: position.y - 20 };

  useOnPressKey("Escape", onClose);

  const openSettingsModal = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <div
        className="node-picker absolute z-10 text-white bg-gray-800 border rounded border-gray-500"
        style={{ top: mousePosition.y, left: mousePosition.x }}
      >
        <div className="bg-gray-500 p-2">Node Menu</div>
        <div className="overflow-y-scroll" style={{ maxHeight: "23rem" }}>
          <div
            key="settings"
            className="p-2 cursor-pointer border-b border-gray-600"
            onClick={openSettingsModal}
          >
            Settings
          </div>
        </div>
      </div>

      <SettingsModal
        nodeType={nodeType}
        isModalVisible={isModalVisible}
        onCloseModal={onClose}
      />
    </>
  );
};
export default NodeMenu;
