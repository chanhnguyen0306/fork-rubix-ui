import { useState } from "react";
import {
  NodeProps as FlowNodeProps,
  useEdges,
  useReactFlow,
} from "react-flow-renderer/nocss";

import { useChangeNodeData } from "../hooks/useChangeNodeData";
import { isHandleConnected } from "../util/isHandleConnected";
import { NodeInterface } from "../lib/Nodes/NodeInterface";
import { NodeSpecJSON } from "../lib";
import { NodeContainer } from "./NodeContainer";
import { InputSocket } from "./InputSocket";
import { OutputSocket } from "./OutputSocket";
import { SettingsModal } from "./SettingsModal";
import { useNodesSpec } from "../use-nodes-spec";

type NodeProps = FlowNodeProps & {
  spec: NodeSpecJSON;
};

const getTitle = (type: string) => {
  const end = type.substring(type.lastIndexOf("/") + 1);
  const spaces = end.replace(/([A-Z])/g, " $1");
  return spaces.toUpperCase();
};

const getPairs = <T, U>(arr1: T[], arr2: U[]) => {
  const max = Math.max(arr1.length, arr2.length);
  const pairs = [];
  for (let i = 0; i < max; i++) {
    const pair: [T | undefined, U | undefined] = [arr1[i], arr2[i]];
    pairs.push(pair);
  }
  return pairs;
};

export const Node = (props: NodeProps) => {
  const { id, data, spec, selected } = props;
  const instance = useReactFlow();
  const edges = useEdges();
  const [nodesSpec] = useNodesSpec();
  const handleChange = useChangeNodeData(id);
  const [widthInput, setWidthInput] = useState(-1);
  const [widthOutput, setWidthOutput] = useState(-1);
  const [isSettingModal, setIsSettingModal] = useState(false);

  const pairs = getPairs(spec.inputs || [], spec.outputs || []);
  const node = instance.getNode(id) as NodeInterface;

  const handleSetWidthInput = (width: number) => {
    setWidthInput((prev: number) => Math.max(prev, width));
  };

  const handleSetWidthOutput = (width: number) => {
    setWidthOutput((prev: number) => Math.max(prev, width));
  };

  const handleDbClickTitle = () => {
    const nodeType = (nodesSpec as NodeSpecJSON[]).find(
      (item) => item.type === node.type
    );
    const isAllowSetting = nodeType?.allowSettings || false;

    if (isAllowSetting) setIsSettingModal(true);
  };

  const handleCloseModalSetting = () => {
    setIsSettingModal(false);
  };

  return (
    <NodeContainer
      title={getTitle(spec.type)}
      icon={spec?.info?.icon || ""}
      category={spec.category}
      selected={selected}
      height={node?.height ?? 30}
      hasChild={node?.style?.height ? true : false}
      status={node.status}
      onDbClickTitle={handleDbClickTitle}
    >
      {pairs.map(([input, output], ix) => {
        if (
          input &&
          !data[input.name] &&
          data[input.name] !== null &&
          ((input.valueType === "number" && data[input.name] !== 0) ||
            input.valueType === "boolean")
        ) {
          data[input.name] = input.defaultValue;
        }

        const borderB =
          ix === pairs.length - 1 && node.style?.height
            ? "border-b pb-3 border-gray-500"
            : "";

        return (
          <div
            key={ix}
            className={`flex flex-row justify-between gap-8 relative px-4 my-2 ${borderB}`}
          >
            {input && (
              <InputSocket
                {...input}
                value={data[input.name]}
                onChange={handleChange}
                connected={isHandleConnected(edges, id, input.name, "target")}
                minWidth={widthInput}
                onSetWidthInput={handleSetWidthInput}
                dataInput={data.inputs}
              />
            )}
            {output && (
              <OutputSocket
                {...output}
                minWidth={widthOutput}
                dataOut={data.out}
                onSetWidthInput={handleSetWidthOutput}
                connected={isHandleConnected(edges, id, output.name, "source")}
              />
            )}
          </div>
        );
      })}
      <SettingsModal
        node={node}
        isModalVisible={isSettingModal}
        onCloseModal={handleCloseModalSetting}
      />
    </NodeContainer>
  );
};
