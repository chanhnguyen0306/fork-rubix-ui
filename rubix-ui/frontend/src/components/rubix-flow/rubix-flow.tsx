import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  OnConnectStartParams,
  useEdgesState,
  useNodesState,
  XYPosition,
} from "react-flow-renderer/nocss";
import BehaveControls from "./components/Controls";
import NodePicker from "./components/NodePicker";
import { calculateNewEdge } from "./util/calculateNewEdge";
import { customNodeTypes } from "./util/customNodeTypes";
import { getNodePickerFilters } from "./util/getPickerFilters";
import { NodeSpecJSON } from "./lib";
import { CustomEdge } from "./components/CustomEdge";
import { generateUuid } from "./lib/generateUuid";
import { ReactFlowProvider } from "react-flow-renderer";
import { useNodesSpec } from "./use-nodes-spec";

const edgeTypes = {
  default: CustomEdge,
};

export const RubixFlow = () => {
  const [nodesSpec] = useNodesSpec();
  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges, , onEdgesChange] = useEdgesState([]);
  const [nodePickerVisibility, setNodePickerVisibility] =
    useState<XYPosition>();
  const [lastConnectStart, setLastConnectStart] =
    useState<OnConnectStartParams>();
  const [specJSON, setSpecJSON] = useState([] as NodeSpecJSON[]);

  useEffect(() => {
    let specJSON = [];
    if (nodesSpec.length > 0) {
      specJSON = (nodesSpec as any).map((node: NodeSpecJSON) => {
        if (node.inputs && node.inputs.length > 0) {
          node.inputs = node.inputs.map((input) => {
            let defaultValue = null;
            switch (input?.valueType) {
              case "number":
                defaultValue = 0;
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
              defaultValue: defaultValue as any,
              valueType: input.valueType,
            };
          });
        }
        return node;
      });
      setSpecJSON(specJSON);
    }
  }, [nodesSpec.length]);

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
        fitViewOptions={{ maxZoom: 1 }}
        fitView
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
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default RubixFlow;
