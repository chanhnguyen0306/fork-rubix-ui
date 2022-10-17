import { useEffect, useRef, useState } from "react";
import { XYPosition } from "react-flow-renderer/nocss";
import { useOnPressKey } from "../hooks/useOnPressKey";
import { NodeSpecJSON } from "../lib";
import { useNodesSpec } from "../use-nodes-spec";
import { SettingsModal } from "./SettingsModal";

type NodeMenuProps = {
  position: XYPosition;
  node: { type: string };
  onClose: () => void;
};

const NodeMenu = ({ position, node, onClose }: NodeMenuProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowSetting, setIsShowSetting] = useState(false);
  const [nodesSpec] = useNodesSpec();

  const mousePosition = { x: position.x - 125, y: position.y - 20 };

  useOnPressKey("Escape", onClose);

  const openSettingsModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    const nodeType = (nodesSpec as NodeSpecJSON[]).find(
      (item) => item.type === node.type
    );
    setIsShowSetting(nodeType?.allowSettings || false);
  }, [nodesSpec]);

  return (
    <>
      <div
        className="node-picker absolute z-10 text-white bg-gray-800 border rounded border-gray-500"
        style={{ top: mousePosition.y, left: mousePosition.x }}
      >
        <div className="bg-gray-500 p-2">Node Menu</div>
        <div className="overflow-y-scroll" style={{ maxHeight: "23rem" }}>
          {isShowSetting && (
            <div
              key="settings"
              className="p-2 cursor-pointer border-b border-gray-600"
              onClick={openSettingsModal}
            >
              Settings
            </div>
          )}
        </div>
      </div>

      <SettingsModal
        node={node}
        isModalVisible={isModalVisible}
        onCloseModal={onClose}
      />
    </>
  );
};
export default NodeMenu;
