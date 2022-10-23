import { FlowFactory } from "../factory";
import { NodeInterface } from "../lib/Nodes/NodeInterface";

const factory = new FlowFactory();

export const handleNodesEmptySettings = async (_nodes: NodeInterface[]) => {
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

export const handleGetSettingType = async (nodeType: string) => {
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
