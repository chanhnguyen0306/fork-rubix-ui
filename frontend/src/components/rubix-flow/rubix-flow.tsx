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
  NodeTypes,
  OnConnectStartParams,
  useEdgesState,
  useNodesState,
  XYPosition,
  Node as FlowNode,
} from "react-flow-renderer/nocss";
import useUndoable from "use-undoable";

import BehaveControls from "./components/Controls";
import NodePicker from "./components/NodePicker";
import NodeMenu from "./components/NodeMenu";
import { Node as NodePanel } from "./components/Node";
import { calculateNewEdge } from "./util/calculateNewEdge";
import { getNodePickerFilters } from "./util/getPickerFilters";
import { CustomEdge } from "./components/CustomEdge";
import { generateUuid } from "./lib/generateUuid";
import { ReactFlowProvider } from "react-flow-renderer";
import { useNodesSpec } from "./use-nodes-spec";
import { Spin } from "antd";
import { NodeSpecJSON } from "./lib";
import { FlowFactory } from "./factory";
import { behaveToFlow } from "./transformers/behaveToFlow";
import ControlUndoable from "./components/ControlUndoable";
import { NodeInterface } from "./lib/Nodes/NodeInterface";

const edgeTypes = {
  default: CustomEdge,
};

const Flow = (props: any) => {
  const { customNodeTypes } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState({} as any);
  const [nodePickerVisibility, setNodePickerVisibility] =
    useState<XYPosition>();
  const [nodeMenuVisibility, setNodeMenuVisibility] = useState<XYPosition>();
  const [lastConnectStart, setLastConnectStart] =
    useState<OnConnectStartParams>();
  const [undoable, setUndoable, { past, undo, canUndo, redo, canRedo }] =
    useUndoable({ nodes: nodes, edges: edges });
  const [isDoubleClick, setIsDoubleClick] = useState(false);

  const factory = new FlowFactory();

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

  const handleGetSettingType = async (nodeType: string) => {
    const nodeSettings: any = {};
    const type = nodeType.split("/")[1];

    const nodeSchema = (await factory.NodeSchema(type)) || {};
    const properties = Object.entries(nodeSchema?.schema?.properties || {});

    if (Object.entries(properties).length === 0) return nodeSettings;

    for (const [key, item] of properties as [string, any]) {
      nodeSettings[key] = item.default;
    }

    return nodeSettings;
  };

  const handleAddNode = useCallback(
    async (
      isParent: boolean,
      style: any,
      nodeType: string,
      position: XYPosition
    ) => {
      closeNodePicker();
      const nodeSettings = await handleGetSettingType(nodeType);
      const newNode = {
        id: generateUuid(),
        isParent,
        style,
        type: nodeType,
        position,
        data: {},
        settings: nodeSettings,
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
    setNodeMenuVisibility(undefined);
    setIsDoubleClick(false);
  };

  const handlePaneClick = () => closeNodePicker();

  const handlePaneContextMenu = (e: ReactMouseEvent) => {
    e.preventDefault();
    setNodePickerVisibility({ x: e.clientX, y: e.clientY });
  };

  const handleNodeContextMenu = (e: ReactMouseEvent, node: NodeInterface) => {
    e.preventDefault();
    setNodeMenuVisibility({ x: e.clientX, y: e.clientY });
    setSelectedNode(node);
  };

  const fetchOutput = async () => {
    try {
      return (await factory.NodeValues()) || [];
    } catch (error) {
      console.log(error);
    }
  };

  const addOutputToNodes = (outputNodes: Array<any>, prevNodes: Array<any>) => {
    if (outputNodes.length === 0) return prevNodes;

    return prevNodes.map((node) => {
      const index = outputNodes.findIndex((item) => item.nodeId === node.id);

      if (index !== -1) {
        node.settings = {
          ...node.settings,
          ...outputNodes[index]?.settings,
        };
      }

      node.data.out = outputNodes[index]?.outputs;

      return node;
    });
  };

  const handleNodeDragStop = (e: React.MouseEvent, node: any) => {
    const newNodes = nodes.map((item) => {
      if (item.id === node.id) {
        item.position = node.position;
      }

      return item;
    });

    setUndoable({
      nodes: newNodes,
      edges: edges,
    });
  };

  const handleRedo = () => {
    redo();
    if (undoable.nodes.length === 0) redo();
  };

  const handleDeleteEdges = (_nodes: any, _edges: any) => {
    setUndoable({
      nodes: _nodes,
      edges: _edges,
    });
  };

  const handleCopyNodes = (_copied: { nodes: any; edges: any }) => {
    /* Unselected nodes, edges */
    nodes.forEach((item) => (item.selected = false));
    edges.forEach((item) => (item.selected = false));

    /* Generate new id of nodes copied */
    _copied.nodes = _copied.nodes.map((item: any) => {
      const __newNodeId = generateUuid();

      /*
       * Generate new id of edges copied
       * Add new id source and target of edges copied
       */
      _copied.edges = _copied.edges.map((edge: any) => ({
        ...edge,
        id: generateUuid(),
        source: edge.source === item.id ? __newNodeId : edge.source,
        target: edge.target === item.id ? __newNodeId : edge.target,
        selected: true,
      }));

      return {
        ...item,
        id: __newNodeId,
        position: { x: item.position.x + 10, y: item.position.y - 10 },
        selected: true,
      };
    });

    const _nodes = [...nodes, ..._copied.nodes];
    const _edges = [...edges, ..._copied.edges];
    setNodes(_nodes);
    setEdges(_edges);
    setUndoable({ edges: _edges, nodes: _nodes });
  };

  const handleNodeDoubleClick = (e: ReactMouseEvent, node: FlowNode) => {
    e.preventDefault();
    setSelectedNode(node);
    setIsDoubleClick(true);
    setNodeMenuVisibility({ x: e.clientX, y: e.clientY });
  };

  const handleNodesEmptySettings = async (_nodes: NodeInterface[]) => {
    return Promise.all(
      await _nodes.map(async (node) => {
        const newNode: NodeInterface = node;

        if (newNode.settings && "selected" in newNode.settings) {
          delete newNode.settings.selected;
        }

        if (
          newNode.type &&
          (!newNode.settings || Object.entries(newNode.settings).length === 0)
        ) {
          node.settings = {
            ...node.settings,
            ...(await handleGetSettingType(newNode.type)),
          };
        }

        return node;
      })
    );
  };

  useEffect(() => {
    factory
      .GetFlow()
      .then(async (res) => {
        const [_nodes, _edges] = behaveToFlow(res);
        const newNodes = await handleNodesEmptySettings(_nodes);
        
        setNodes(newNodes);
        setEdges(_edges);
        setUndoable({
          nodes: newNodes,
          edges: _edges,
        });
      })
      .catch(() => {});

    const ivlFetchOutput = setInterval(async () => {
      const _outputNodes = (await fetchOutput()) || [];
      setNodes((prevNodes) => addOutputToNodes(_outputNodes, prevNodes));
    }, 5000);

    return () => {
      clearInterval(ivlFetchOutput);
    };
  }, []);

  useEffect(() => {
    if (past.length !== 0 && undoable.nodes.length > 0) {
      setNodes(undoable.nodes);
      setEdges(undoable.edges);
    }
  }, [undoable]);

  useEffect(() => {
    //When deleting a container, will also delete the nodes that belong to it
    const subNodes = nodes.filter((n: any) => n.parentId) as any[];
    if (subNodes.length === 0) return;

    const allNodeIds = nodes.map((n) => n.id);
    let newNodes = nodes;
    for (const subNode of subNodes) {
      if (!allNodeIds.includes(subNode.parentId)) {
        newNodes = nodes.filter((n) => n.id !== subNode.id);
      }
    }
    setNodes(newNodes);
  }, [nodes]);

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
        onNodeDragStop={handleNodeDragStop}
        onNodeDoubleClick={handleNodeDoubleClick}
      >
        <ControlUndoable
          canUndo={canUndo && past.length !== 0}
          onUndo={undo}
          canRedo={canRedo}
          onRedo={handleRedo}
        />
        <Controls />
        <Background
          variant={BackgroundVariant.Lines}
          color="#353639"
          style={{ backgroundColor: "#1E1F22" }}
        />
        <BehaveControls
          onDeleteEdges={handleDeleteEdges}
          onCopyNodes={handleCopyNodes}
          onUndo={undo}
          onRedo={handleRedo}
        />
        {nodePickerVisibility && (
          <NodePicker
            position={nodePickerVisibility}
            filters={getNodePickerFilters(nodes, lastConnectStart)}
            onPickNode={handleAddNode}
            onClose={closeNodePicker}
          />
        )}
        {nodeMenuVisibility && (
          <NodeMenu
            position={nodeMenuVisibility}
            node={selectedNode}
            onClose={closeNodePicker}
            isDoubleClick={isDoubleClick}
          />
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
