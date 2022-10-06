import { useState } from "react";
import { useReactFlow, XYPosition } from "react-flow-renderer/nocss";
import { useOnPressKey } from "../hooks/useOnPressKey";
import { NodeSpecJSON } from "../lib";
import { useNodesSpec } from "../use-nodes-spec";

export type NodePickerFilters = {
  handleType: "source" | "target";
  valueType: string;
};

type NodePickerProps = {
  position: XYPosition;
  filters?: NodePickerFilters;
  onPickNode: (
    isParent: boolean,
    style: any,
    type: string,
    position: XYPosition
  ) => void;
  onClose: () => void;
};

const NodePicker = ({
  position,
  onPickNode,
  onClose,
  filters,
}: NodePickerProps) => {
  const [search, setSearch] = useState("");
  const [nodesSpec] = useNodesSpec();
  const instance = useReactFlow();
  const mousePosition = { x: position.x - 125, y: position.y - 20 };

  useOnPressKey("Escape", onClose);

  let filtered = nodesSpec as NodeSpecJSON[];
  if (filters !== undefined) {
    filtered = filtered.filter((node) => {
      const inputs = node.inputs ?? [];
      const outputs = node.outputs ?? [];
      const sockets = filters?.handleType === "source" ? outputs : inputs;
      return sockets.some((socket) => socket.valueType === filters?.valueType);
    });
  }

  filtered = filtered.filter((node) => {
    const term = search.toLowerCase();
    return node.type.toLowerCase().includes(term);
  });

  return (
    <div
      className="node-picker absolute z-10 text-white bg-gray-800 border rounded border-gray-500"
      style={{ top: mousePosition.y, left: mousePosition.x }}
    >
      <div className="bg-gray-500 p-2">Add Node</div>
      <div className="p-2">
        <input
          type="text"
          autoFocus
          placeholder="Type to filter"
          className=" bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-y-scroll" style={{ maxHeight: "23rem" }}>
        {filtered.map(({ type, isParent, style }) => (
          <div
            key={type}
            className="p-2 cursor-pointer border-b border-gray-600"
            onClick={() =>
              onPickNode(
                isParent ?? false,
                style ?? {},
                type,
                instance.project({ x: mousePosition.x, y: mousePosition.y })
              )
            }
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  );
};
export default NodePicker;
