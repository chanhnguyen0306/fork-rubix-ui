import { useEffect, useState } from "react";
import { useReactFlow, XYPosition } from "react-flow-renderer/nocss";
import { isObjectEmpty } from "../../../utils/utils";
import { useOnPressKey } from "../hooks/useOnPressKey";
import { NodeJSON, NodeSpecJSON } from "../lib";
import { generateUuid } from "../lib/generateUuid";
import { getNodePickerFilters } from "../util/getPickerFilters";
import { useNodesSpec } from "../use-nodes-spec";
import { SettingsModal } from "./SettingsModal";
import NodePicker from "./NodePicker";
import { FlowFactory } from "../factory";
import { useParams } from "react-router-dom";
import { SetPayloadModal } from "./SetPayloadModal";
import { NodeInterface } from "../lib/Nodes/NodeInterface";

type NodeMenuProps = {
  position: XYPosition;
  node: NodeInterface;
  isDoubleClick: boolean;
  onClose: () => void;
};

const AddNodeComponent = ({ node, onClose, instance }: any) => {
  if (!node.isParent) return null;

  const nodes = instance.getNodes();
  const [nodePickerVisibility, setNodePickerVisibility] = useState(false);

  const openModal = () => {
    setNodePickerVisibility(true);
  };

  const closeNodePicker = () => {
    setNodePickerVisibility(false);
    onClose();
  };

  const handleAddNode = (
    isParent: boolean,
    style: any,
    nodeType: string,
    position: XYPosition
  ) => {
    closeNodePicker();

    const newNode = {
      id: generateUuid(),
      isParent,
      style,
      type: nodeType,
      position: {
        x: node.position.x + 10,
        y:
          node.position.y +
          (node.originalHeight ? node.originalHeight : node.height),
      },
      data: {},
      parentId: node.id,
    };

    //to handle sub-node's position
    if (!node.originalHeight) {
      node.originalHeight = node.height;
    }

    const index = nodes.findIndex((n: NodeJSON) => n.id === node.id);
    const parentStyle = { width: 300, height: 300 };
    nodes[index] = {
      ...node,
      style: isObjectEmpty(nodes[index].style)
        ? parentStyle
        : nodes[index].style,
    };
    const newNodes = nodes.concat(newNode);
    instance.setNodes(newNodes);
  };

  return (
    <>
      <div
        key="settings"
        className="cursor-pointer border-b border-gray-600 ant-menu-item ant-menu-item-only-child"
        onClick={openModal}
      >
        Add node
      </div>

      {nodePickerVisibility && (
        <NodePicker
          position={{} as XYPosition}
          filters={getNodePickerFilters(nodes, undefined)}
          onPickNode={handleAddNode}
          onClose={closeNodePicker}
        />
      )}
    </>
  );
};

const AddSubNodeComponent = ({ node, onClose, instance }: any) => {
  if (!node.isParent) return null;

  const [nodePickerVisibility, setNodePickerVisibility] = useState(false);
  const [nodeList, setNodeList] = useState([] as any[]);
  const nodes = instance.getNodes();
  const { connUUID = "", hostUUID = "" } = useParams();
  const isRemote = connUUID && hostUUID ? true : false;
  const category = node.type.split("/")[0];

  const factory = new FlowFactory();

  const openModal = () => {
    setNodePickerVisibility(true);
    fetchNodeList();
  };

  const closeNodePicker = () => {
    setNodePickerVisibility(false);
    onClose();
  };

  const handleAddNode = (
    isParent: boolean,
    style: any,
    nodeType: string,
    position: XYPosition
  ) => {
    closeNodePicker();

    const newNode = {
      id: generateUuid(),
      isParent,
      style,
      type: nodeType,
      position: {
        x: node.position.x + 10,
        y:
          node.position.y +
          (node.originalHeight ? node.originalHeight : node.height),
      },
      data: {},
      parentId: node.id,
    };

    //to handle sub-node's position
    if (!node.originalHeight) {
      node.originalHeight = node.height;
    }

    const index = nodes.findIndex((n: NodeJSON) => n.id === node.id);
    const parentStyle = { width: 300, height: 300 };
    nodes[index] = {
      ...node,
      style: isObjectEmpty(nodes[index].style)
        ? parentStyle
        : nodes[index].style,
    };
    const newNodes = nodes.concat(newNode);
    instance.setNodes(newNodes);
  };

  const fetchNodeList = async () => {
    const nodeList = await factory.NodePallet(
      connUUID,
      hostUUID,
      isRemote,
      category
    );
    setNodeList(nodeList);
  };

  return (
    <>
      <div
        key="settings"
        className="cursor-pointer border-b border-gray-600 ant-menu-item ant-menu-item-only-child"
        onClick={openModal}
      >
        Add sub node
      </div>

      {nodePickerVisibility && (
        <NodePicker
          position={{} as XYPosition}
          filters={getNodePickerFilters(nodes, undefined)}
          onPickNode={handleAddNode}
          onClose={closeNodePicker}
          nodeList={nodeList}
        />
      )}
    </>
  );
};

const DEFAULT_NODE_SPEC_JSON: NodeSpecJSON = {
  allowSettings: false,
  type: "",
  category: "None",
};

const NodeMenu = ({
  position,
  node,
  isDoubleClick,
  onClose,
}: NodeMenuProps) => {
  const [isModalVisible, setIsModalVisible] = useState(isDoubleClick);
  const [isShowSetting, setIsShowSetting] = useState(false);
  const [isShowPayload, setIsShowPayload] = useState(false);
  const [nodeType, setNodeType] = useState<NodeSpecJSON>(
    DEFAULT_NODE_SPEC_JSON
  );

  const [nodesSpec] = useNodesSpec();
  const instance = useReactFlow();

  useOnPressKey("Escape", onClose);

  const openSettingsModal = () => {
    setIsModalVisible(true);
  };

  const handleTogglePayload = () => {
    setIsShowPayload(!isShowPayload);
  };

  useEffect(() => {
    const nodeType =
      (nodesSpec as NodeSpecJSON[]).find((item) => item.type === node.type) ||
      DEFAULT_NODE_SPEC_JSON;
    setNodeType(nodeType);

    const isAllowSetting = nodeType?.allowSettings || false;

    if (isDoubleClick && !isAllowSetting) {
      onClose();
    }

    setIsShowSetting(isAllowSetting);
  }, [node, nodesSpec]);

  return (
    <>
      {!isDoubleClick && (
        <div
          className="node-picker node-menu absolute z-10 text-white border rounded border-gray-500 ant-menu ant-menu-root ant-menu-inline ant-menu-dark"
          style={{
            top: position.y,
            left: position.x,
            width: "auto",
            borderRight: "1px solid #303030",
            minWidth: 120,
          }}
        >
          <div className="bg-gray-500 mt-0 ant-menu-item ant-menu-item-only-child">
            Node Menu
          </div>
          <AddSubNodeComponent
            node={node}
            onClose={onClose}
            instance={instance}
          />
          <AddNodeComponent node={node} onClose={onClose} instance={instance} />
          {nodeType.allowPayload && (
            <div
              key="Set Payload"
              className="cursor-pointer ant-menu-item ant-menu-item-only-child"
              onClick={handleTogglePayload}
            >
              Set Payload
            </div>
          )}
          {isShowSetting && (
            <div
              key="settings"
              className="cursor-pointer ant-menu-item ant-menu-item-only-child"
              onClick={openSettingsModal}
            >
              Settings
            </div>
          )}
        </div>
      )}
      {isShowSetting && (
        <SettingsModal
          node={node}
          isModalVisible={isModalVisible}
          onCloseModal={onClose}
        />
      )}

      {nodeType.allowPayload && (
        <SetPayloadModal
          node={node}
          nodeType={nodeType}
          open={isShowPayload}
          onClose={() => setIsShowPayload(false)}
        />
      )}
    </>
  );
};
export default NodeMenu;
