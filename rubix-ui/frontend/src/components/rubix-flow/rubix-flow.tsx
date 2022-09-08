import { useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MarkerType,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "react-flow-renderer";

const initialNodes = [
  {
    id: "edges-1",
    type: "input",
    data: { label: "Input 1" },
    position: { x: 250, y: 0 },
  },
  { id: "edges-2", data: { label: "Node 2" }, position: { x: 150, y: 100 } },
  { id: "edges-2a", data: { label: "Node 2a" }, position: { x: 0, y: 180 } },
  { id: "edges-3", data: { label: "Node 3" }, position: { x: 250, y: 200 } },
  { id: "edges-4", data: { label: "Node 4" }, position: { x: 400, y: 300 } },
  { id: "edges-3a", data: { label: "Node 3a" }, position: { x: 150, y: 300 } },
  { id: "edges-5", data: { label: "Node 5" }, position: { x: 250, y: 400 } },
  {
    id: "edges-6",
    type: "output",
    data: { label: "Output 6" },
    position: { x: 50, y: 550 },
  },
  {
    id: "edges-7",
    type: "output",
    data: { label: "Output 7" },
    position: { x: 250, y: 550 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", label: "this is an edge label" },
  { id: "e1-3", source: "1", target: "3" },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
    label: "animated edge",
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    label: "edge with arrow head",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    type: "smoothstep",
    label: "smooth step edge",
  },
  {
    id: "e5-7",
    source: "5",
    target: "7",
    type: "step",
    style: { stroke: "#f6ab6c" },
    label: "a step edge",
    animated: true,
    labelStyle: { fill: "#f6ab6c", fontWeight: 700 },
  },
];

export const RubixFlow = (props: any) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onInit = (reactFlowInstance: any) =>
    console.log("flow loaded:", reactFlowInstance);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        attributionPosition="top-right"
      >
        <MiniMap
          nodeStrokeColor={(n: any) => {
            if (n.style?.background) return n.style.background;
            if (n.type === "input") return "#0041d0";
            if (n.type === "output") return "#ff0072";
            if (n.type === "default") return "#1a192b";

            return "#eee";
          }}
          nodeColor={(n: any) => {
            if (n.style?.background) return n.style.background;

            return "#fff";
          }}
          nodeBorderRadius={2}
        />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </>
  );
};
