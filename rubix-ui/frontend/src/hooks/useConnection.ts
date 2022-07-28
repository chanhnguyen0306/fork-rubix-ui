import { DataNode } from "antd/lib/tree";
import { useEffect, useState } from "react";
import { ConnectionFactory } from "../components/connections/factory";
import { LocationFactory } from "../components/locations/factory";
import { getTreeDataIterative } from "../components/searchable-tree/searchable-tree.ui-service";

interface TDataNode extends DataNode {
  name?: string;
}

interface DataNodeListItem {
  key: React.Key;
  title: string;
}

let locationFactory = new LocationFactory();
let connectionFactory = new ConnectionFactory();

export const useConnections = () => {
  const [connections, setConnections] = useState([] as any[]);
  const [routeData, updateRouteData] = useState([] as TDataNode[]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  const getLocations = async (connUUID: string) => {
    locationFactory.connectionUUID = connUUID;
    try {
      return await locationFactory.GetAll();
    } catch (err) {
      return [];
    }
  };

  const fetchConnections = async () => {
    try {
      setIsFetching(true);
      let connections = (await connectionFactory.GetAll()) as any;
      if (!connections) return setConnections([]);
      for (const c of connections) {
        let locations = [];
        locations = await getLocations(c.uuid);
        c.locations = locations;
      }
      setConnections(connections);
      updateRouteData(getTreeDataIterative(connections));
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };

  return { connections, routeData, isFetching };
};
