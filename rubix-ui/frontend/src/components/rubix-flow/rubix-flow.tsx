import { MouseEvent as ReactMouseEvent, useCallback, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  NodeTypes,
  OnConnectStartParams,
  useEdgesState,
  useNodesState,
  XYPosition,
} from "react-flow-renderer/nocss";
import BehaveControls from "./components/Controls";
import NodePicker from "./components/NodePicker";
import { Node as NodePanel } from "./components/Node";
import { calculateNewEdge } from "./util/calculateNewEdge";
import { getNodePickerFilters } from "./util/getPickerFilters";
import { CustomEdge } from "./components/CustomEdge";
import { generateUuid } from "./lib/generateUuid";
import { ReactFlowProvider } from "react-flow-renderer";
import { useNodesSpec } from "./use-nodes-spec";
import { Spin } from "antd";
import { Node, NodeSpecJSON } from "./lib";

const edgeTypes = {
  default: CustomEdge,
};

const Flow = (props: any) => {
  const { customNodeTypes } = props;
  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges, , onEdgesChange] = useEdgesState([]);
  const [nodePickerVisibility, setNodePickerVisibility] =
    useState<XYPosition>();
  const [nodePanelVisibility, setNodePanelVisibility] = useState<XYPosition>();
  const [lastConnectStart, setLastConnectStart] =
    useState<OnConnectStartParams>();

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source === null) return;
      if (connection.target === null) return;

      const newEdge = {
        id: generateUuid(),
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
      };
      onEdgesChange([
        {
          type: "add",
          item: newEdge,
        },
      ]);
    },
    [onEdgesChange]
  );

  const handleAddNode = useCallback(
    (nodeType: string, position: XYPosition) => {
      closeNodePicker();
      const newNode = {
        id: generateUuid(),
        type: nodeType,
        position,
        data: {},
      };
      onNodesChange([
        {
          type: "add",
          item: newNode,
        },
      ]);

      if (lastConnectStart === undefined) return;

      // add an edge if we started on a socket
      const originNode = nodes.find(
        (node) => node.id === lastConnectStart.nodeId
      );
      if (originNode === undefined) return;
      onEdgesChange([
        {
          type: "add",
          item: calculateNewEdge(
            originNode,
            nodeType,
            newNode.id,
            lastConnectStart
          ),
        },
      ]);
    },
    [lastConnectStart, nodes, onEdgesChange, onNodesChange]
  );

  const handleStartConnect = (
    e: ReactMouseEvent,
    params: OnConnectStartParams
  ) => {
    setLastConnectStart(params);
  };

  const handleStopConnect = (e: MouseEvent) => {
    const element = e.target as HTMLElement;
    if (element.classList.contains("react-flow__pane")) {
      setNodePickerVisibility({ x: e.clientX, y: e.clientY });
    } else {
      setLastConnectStart(undefined);
    }
  };

  const closeNodePicker = () => {
    setLastConnectStart(undefined);
    setNodePickerVisibility(undefined);
  };

  const handlePaneClick = () => closeNodePicker();

  const handlePaneContextMenu = (e: ReactMouseEvent) => {
    e.preventDefault();
    setNodePickerVisibility({ x: e.clientX, y: e.clientY });
  };

  const handleNodeContextMenu = (e: ReactMouseEvent, node: Node) => {
    e.preventDefault();
    setNodePanelVisibility({ x: e.clientX, y: e.clientY });
  };

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodeTypes={customNodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={handleStartConnect}
        onConnectStop={handleStopConnect}
        onPaneClick={handlePaneClick}
        onPaneContextMenu={handlePaneContextMenu}
        onNodeContextMenu={(e, node: any) => handleNodeContextMenu(e, node)}
        fitViewOptions={{ maxZoom: 1 }}
        deleteKeyCode={["Delete"]}
      >
        <Controls />
        <Background
          variant={BackgroundVariant.Lines}
          color="#353639"
          style={{ backgroundColor: "#1E1F22" }}
        />
        <BehaveControls />
        {nodePickerVisibility && (
          <NodePicker
            position={nodePickerVisibility}
            filters={getNodePickerFilters(nodes, lastConnectStart)}
            onPickNode={handleAddNode}
            onClose={closeNodePicker}
          />
        )}
        {nodePanelVisibility && (
          <div
            className="node-picker absolute z-10 text-white bg-gray-800 border rounded border-gray-500"
            style={{
              top: nodePanelVisibility.y - 20,
              left: nodePanelVisibility.x - 125,
            }}
          >
            <div className="bg-gray-500 p-2">Node Settings</div>
            <div className="p-2">aaaaaaaa</div>
          </div>
        )}
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export const RubixFlow = () => {
  const [nodesSpec] = useNodesSpec();

  const customNodeTypes = (nodesSpec as NodeSpecJSON[]).reduce(
    (nodes, node) => {
      nodes[node.type] = (props: any) => <NodePanel {...props} spec={node} />;
      return nodes;
    },
    {} as NodeTypes
  );

  return (
    <>
      {nodesSpec.length > 0 ? (
        <Flow customNodeTypes={customNodeTypes} />
      ) : (
        <Spin />
      )}
    </>
  );
};

export default RubixFlow;
