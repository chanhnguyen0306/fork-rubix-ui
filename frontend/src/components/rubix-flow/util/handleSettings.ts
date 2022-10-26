import { FlowFactory } from "../factory";
import { NodeInterface } from "../lib/Nodes/NodeInterface";

const factory = new FlowFactory();

export const handleNodesEmptySettings = async (
  connUUID: string,
  hostUUID: string,
  isRemote: boolean,
  _nodes: NodeInterface[]
) => {
  return Promise.all(
    await _nodes.map(async (node) => {
      const newNode: NodeInterface = node;
      if (
        newNode.type &&
        (!newNode.settings || Object.entries(newNode.settings).length === 0)
      ) {
        node.settings = {
          ...node.settings,
          ...(await handleGetSettingType(
            connUUID,
            hostUUID,
            isRemote,
            newNode.type
          )),
        };
      }

      return node;
    })
  );
};

export const handleGetSettingType = async (
  connUUID: string,
  hostUUID: string,
  isRemote: boolean,
  nodeType: string
) => {
  const nodeSettings: any = {};
  const type = nodeType.split("/")[1];

  const nodeSchema =
    (await factory.NodeSchema(connUUID, hostUUID, isRemote, type)) || {};
  const properties = Object.entries(nodeSchema?.schema?.properties || {});

  if (Object.entries(properties).length === 0) return nodeSettings;

  for (const [key, item] of properties as [string, any]) {
    nodeSettings[key] = item.default;
  }

  return nodeSettings;
};
