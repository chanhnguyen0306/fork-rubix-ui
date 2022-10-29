import { useState } from "react";
import { useReactFlow } from "react-flow-renderer";
import { NodeSpecJSON } from "../lib";
import { useNodesSpec } from "../use-nodes-spec";

export const NodeSideBar = (props: any) => {
  const [search, setSearch] = useState("");
  const [nodesSpec] = useNodesSpec();

  let filtered = nodesSpec as NodeSpecJSON[];
  filtered = filtered.filter((node) => {
    const term = search.toLowerCase();
    return node.type.toLowerCase().includes(term);
  });

  const onDragStart = (event: any, isParent: any, nodeType: string) => {
    const data = { isParent, nodeType };
    event.dataTransfer.setData("from-node-sidebar", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="rubix-flow__node-sidebar node-picker z-10 text-white bg-gray-800 border rounded border-gray-500">
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
      <div className="overflow-y-scroll" style={{ maxHeight: "90vh" }}>
        {filtered.map(({ type, isParent }) => (
          <div
            key={type}
            className="p-2 cursor-pointer border-b border-gray-600"
            onDragStart={(event) => onDragStart(event, isParent, type)}
            draggable
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  );
};
