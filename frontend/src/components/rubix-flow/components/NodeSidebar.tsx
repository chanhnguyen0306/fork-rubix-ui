import { ChangeEvent, useEffect, useState } from "react";
import { Collapse } from "antd";

import { NodeSpecJSON } from "../lib";
import { useNodesSpec } from "../use-nodes-spec";

const { Panel } = Collapse;

export const NodeSideBar = () => {
  const [nodesSpec] = useNodesSpec();
  const [search, setSearch] = useState("");
  const [nodes, setNodes] = useState<{ [key: string]: NodeSpecJSON[] }>({});
  const [activeKeyPanel, setActiveKeyPanel] = useState<string[]>([]);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onChangeOpenPanels = (key: string | string[]) => {
    setActiveKeyPanel(typeof key === "string" ? [key] : key);
  };

  const onDragStart = (event: any, isParent: any, nodeType: string) => {
    const data = { isParent, nodeType };
    event.dataTransfer.setData("from-node-sidebar", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  };

  useEffect(() => {
    const key = search.toLowerCase().trim();
    const items = nodesSpec as NodeSpecJSON[];
    const types = {} as { [key: string]: NodeSpecJSON[] };
    const filtered =
      key.length > 0
        ? items.filter((node) => node.type.toLowerCase().includes(key))
        : items;

    filtered.forEach((item) => {
      if (types[item.category]) {
        types[item.category].push(item);
      } else {
        types[item.category] = [item];
      }
    });

    setActiveKeyPanel(key.length > 0 ? Object.keys(types) : []);
    setNodes(types);
  }, [search, nodesSpec]);

  return (
    <div className="rubix-flow__node-sidebar node-picker z-10 text-white bg-gray-800 border border-gray-500">
      <div className="bg-gray-500 p-2">Add Node</div>
      <div className="p-2">
        <input
          type="text"
          autoFocus
          placeholder="Type to filter"
          className=" bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2"
          value={search}
          onChange={onChangeSearch}
        />
      </div>
      <div
        className="overflow-y-scroll"
        style={{ height: "calc(100vh - 70px)" }}
      >
        <Collapse
          activeKey={activeKeyPanel}
          expandIconPosition="right"
          onChange={onChangeOpenPanels}
        >
          {Object.keys(nodes).map((category) => (
            <Panel
              key={category}
              header={category}
              className="panel-no-padding"
            >
              {nodes[category].map(({ type, isParent }) => (
                <div
                  key={type}
                  className="py-2 cursor-pointer border-b border-gray-600 text-left"
                  onDragStart={(event) => onDragStart(event, isParent, type)}
                  draggable
                  style={{ paddingLeft: 24 }}
                >
                  {type.split("/")[1]}
                </div>
              ))}
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};
