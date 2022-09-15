import { useEffect, useState } from "react";
import { useReactFlow, XYPosition } from "react-flow-renderer/nocss";
import { NodePallet } from "../../../../wailsjs/go/main/App";
import { nodes } from "../../../../wailsjs/go/models";
import { FlowFactory } from "../factory";
import { useOnPressKey } from "../hooks/useOnPressKey";
import { NodeSpecJSON } from "../lib";
import specJson from "../lib/node-spec.json";

// const specJSON = specJson as NodeSpecJSON[];

export type NodePickerFilters = {
  handleType: "source" | "target";
  valueType: string;
};

type NodePickerProps = {
  position: XYPosition;
  filters?: NodePickerFilters;
  onPickNode: (type: string, position: XYPosition) => void;
  onClose: () => void;
};

const NodePicker = ({
  position,
  onPickNode,
  onClose,
  filters,
}: NodePickerProps) => {
  const [search, setSearch] = useState("");
  const [nodes, setNodes] = useState([] as NodeSpecJSON[]);
  const instance = useReactFlow();
  const mousePosition = { x: position.x - 125, y: position.y - 20 };

  const factory = new FlowFactory();

  useOnPressKey("Escape", onClose);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const res = (await factory.NodePallet()) as NodeSpecJSON[];
    setNodes(res);
  };

  let filtered = nodes;
  if (filters !== undefined) {
    filtered = filtered.filter((node) => {
      const sockets =
        filters?.handleType === "source" ? node.outputs : node.inputs;
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
        {filtered.map(({ type }) => (
          <div
            key={type}
            className="p-2 cursor-pointer border-b border-gray-600"
            onClick={() =>
              onPickNode(
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
