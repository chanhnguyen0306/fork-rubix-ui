import {
  NodeProps as FlowNodeProps,
  useEdges,
} from "react-flow-renderer/nocss";

import { useChangeNodeData } from "../hooks/useChangeNodeData";
import { isHandleConnected } from "../util/isHandleConnected";
import { NodeSpecJSON } from "../lib";
import { NodeContainer } from "./NodeContainer";
import { InputSocket } from "./InputSocket";
import { OutputSocket } from "./OutputSocket";
import { AutoSizeInput } from "./AutoSizeInput";

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

const getValueOptions = (value: boolean | null) => {
  switch (value) {
    case true:
    case false:
      return `${value}`;
    case null:
      return "null";
    default:
      return "";
  }
};

export const Node = ({ id, data, spec, selected }: NodeProps) => {
  const edges = useEdges();
  const handleChange = useChangeNodeData(id);
  const pairs = getPairs(spec.inputs || [], spec.outputs || []);

  const getValueOutput = (outputName: string) =>
    data.out &&
    data.out.find((item: { pin: string }) => item.pin === outputName).value;

  return (
    <NodeContainer
      title={getTitle(spec.type)}
      category={spec.category}
      selected={selected}
    >
      {pairs.map(([input, output], ix) => {
        if (input && !data[input.name] && data[input.name] !== null) {
          data[input.name] = input.defaultValue;
        }
        return (
          <div
            key={ix}
            className="flex flex-row justify-between gap-8 relative px-2"
          >
            {input && (
              <InputSocket
                {...input}
                value={data[input.name]}
                onChange={handleChange}
                connected={isHandleConnected(edges, id, input.name, "target")}
              />
            )}
            {output && (
              <div className="flex grow items-center justify-end h-7">
                <AutoSizeInput
                  type="text"
                  className="bg-gray-600 disabled:bg-gray-700 py-1 px-2 mr-2 nodrag"
                  value={
                    (output.valueType === "boolean"
                      ? getValueOptions(getValueOutput(output?.name))
                      : getValueOutput(output?.name)) || ""
                  }
                  minWidth={40}
                  disabled
                />
                <OutputSocket
                  {...output}
                connected={isHandleConnected(edges, id, output.name, "source")}
                />
              </div>
            )}
          </div>
        );
      })}
    </NodeContainer>
  );
};
