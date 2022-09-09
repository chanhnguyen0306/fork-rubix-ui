// import { useCallback } from "react";
// import ReactFlow, {
//   addEdge,
//   Background,
//   Controls,
//   EdgeChange,
//   MarkerType,
//   MiniMap,
//   NodeChange,
//   useEdgesState,
//   useNodesState,
// } from "react-flow-renderer";

// const initialNodes = [
//   {
//     id: "edges-1",
//     type: "input",
//     data: { label: "Input 1" },
//     position: { x: 250, y: 0 },
//   },
//   { id: "edges-2", data: { label: "Node 2" }, position: { x: 150, y: 100 } },
//   { id: "edges-2a", data: { label: "Node 2a" }, position: { x: 0, y: 180 } },
//   { id: "edges-3", data: { label: "Node 3" }, position: { x: 250, y: 200 } },
//   { id: "edges-4", data: { label: "Node 4" }, position: { x: 400, y: 300 } },
//   { id: "edges-3a", data: { label: "Node 3a" }, position: { x: 150, y: 300 } },
//   { id: "edges-5", data: { label: "Node 5" }, position: { x: 250, y: 400 } },
//   {
//     id: "edges-6",
//     type: "output",
//     data: { label: "Output 6" },
//     position: { x: 50, y: 550 },
//   },
//   {
//     id: "edges-7",
//     type: "output",
//     data: { label: "Output 7" },
//     position: { x: 250, y: 550 },
//   },
// ];

// const initialEdges = [
//   { id: "e1-2", source: "1", target: "2", label: "this is an edge label" },
//   { id: "e1-3", source: "1", target: "3" },
//   {
//     id: "e3-4",
//     source: "3",
//     target: "4",
//     animated: true,
//     label: "animated edge",
//   },
//   {
//     id: "e4-5",
//     source: "4",
//     target: "5",
//     label: "edge with arrow head",
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: "e5-6",
//     source: "5",
//     target: "6",
//     type: "smoothstep",
//     label: "smooth step edge",
//   },
//   {
//     id: "e5-7",
//     source: "5",
//     target: "7",
//     type: "step",
//     style: { stroke: "#f6ab6c" },
//     label: "a step edge",
//     animated: true,
//     labelStyle: { fill: "#f6ab6c", fontWeight: 700 },
//   },
// ];

// export const RubixFlow = (props: any) => {
//   const [nodes, , onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onConnect = useCallback(
//     (params: any) => setEdges((eds) => addEdge(params, eds)),
//     []
//   );

//   const onInit = (reactFlowInstance: any) => {
//     console.log("flow loaded:", reactFlowInstance);
//   };

//   const handleNodesChange = (e: NodeChange[]) => {
//     console.log("handleNodesChange", e);
//     onNodesChange(e);
//   };

//   const handleEdgesChange = (e: EdgeChange[]) => {
//     console.log("EdgesChange", e);
//     onEdgesChange(e);
//   };

//   return (
//     <>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={(e) => handleNodesChange(e)}
//         onEdgesChange={(e) => handleEdgesChange(e)}
//         onConnect={onConnect}
//         onInit={onInit}
//         fitView
//         attributionPosition="bottom-right"
//       >
//         <Controls />
//         <Background color="#aaa" gap={16} />
//       </ReactFlow>
//     </>
//   );
// };

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
import rawGraphJSON from "./graph.json";
import NodePicker from "./components/NodePicker";
import { behaveToFlow } from "./transformers/behaveToFlow";
import { calculateNewEdge } from "./util/calculateNewEdge";
import { customNodeTypes } from "./util/customNodeTypes";
import { getNodePickerFilters } from "./util/getPickerFilters";
import { GraphJSON } from "./lib";
import { CustomEdge } from "./components/CustomEdge";
import { generateUuid } from "./lib/generateUuid";
import { MiniMap, ReactFlowProvider } from "react-flow-renderer";

const graphJSON = rawGraphJSON as GraphJSON;

const [initialNodes, initialEdges] = behaveToFlow(graphJSON);

const edgeTypes = {
  default: CustomEdge,
};

export const RubixFlow = () => {
  const [nodePickerVisibility, setNodePickerVisibility] =
    useState<XYPosition>();
  const [lastConnectStart, setLastConnectStart] =
    useState<OnConnectStartParams>();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

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
        fitViewOptions={{ maxZoom: 1 }}
        onPaneClick={handlePaneClick}
        onPaneContextMenu={handlePaneContextMenu}
        fitView
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
