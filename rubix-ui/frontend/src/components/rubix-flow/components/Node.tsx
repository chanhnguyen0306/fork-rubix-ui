import {
  NodeProps as FlowNodeProps,
  useEdges,
  useReactFlow,
} from "react-flow-renderer/nocss";

import { useChangeNodeData } from "../hooks/useChangeNodeData";
import { isHandleConnected } from "../util/isHandleConnected";
import { NodeExtend, NodeSpecJSON } from "../lib";
import { NodeContainer } from "./NodeContainer";
import { InputSocket } from "./InputSocket";
import { OutputSocket } from "./OutputSocket";

type NodeProps = FlowNodeProps & {
  spec: NodeSpecJSON;
};

const getTitle = (type: string) => {
  const end = type.substring(type.lastIndexOf("/") + 1);
  const spaces = end.replace(/([A-Z])/g, " $1");
  return spaces.charAt(0).toUpperCase() + spaces.slice(1);
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
  const handleChange = useChangeNodeData(id);
  const pairs = getPairs(spec.inputs || [], spec.outputs || []);
  const node = instance.getNode(id) as NodeExtend;

  return (
    <NodeContainer
      title={getTitle(spec.type)}
      category={spec.category}
      selected={selected}
      height={node?.height ?? 30}
    >
      {pairs.map(([input, output], ix) => {
        if (input && !data[input.name] && data[input.name] !== null) {
          data[input.name] = input.defaultValue;
        }
        const borderB =
          node.isParent && ix === pairs.length - 1 ? "border-b pb-3" : "";
        return (
          <div
            key={ix}
            className={`flex flex-row justify-between gap-8 relative px-2 ${borderB}`}
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
              <OutputSocket
                {...output}
                connected={isHandleConnected(edges, id, output.name, "source")}
              />
            )}
          </div>
        );
      })}
    </NodeContainer>
  );
};
