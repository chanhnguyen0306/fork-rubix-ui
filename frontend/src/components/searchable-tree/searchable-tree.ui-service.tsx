import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

let ObjectType = {
  CONNECTIONS: "Connections",
  LOCATIONS: "locations",
  NETWORKS: "networks",
  HOSTS: "hosts",
  RUBIX_FLOW_REMOTE: "rubix-flow",
  WIRES_CONNECTIONS_REMOTE: "wires-connections",
};

interface ObjectTypeRoute {
  [objectType: string]: (
    connUUID?: string,
    locUUID?: string,
    netUUID?: string,
    hostUUID?: string
  ) => string;
}

let ObjectTypesToRoutes: ObjectTypeRoute = {
  [ObjectType.CONNECTIONS]: (connUUID: string = "") =>
    ROUTES.LOCATIONS.replace(":connUUID", connUUID),
  [ObjectType.LOCATIONS]: (connUUID: string = "", locUUID: string = "") =>
    ROUTES.LOCATION_NETWORKS.replace(":connUUID", connUUID).replace(
      ":locUUID",
      locUUID
    ),
  [ObjectType.NETWORKS]: (
    connUUID: string = "",
    locUUID: string = "",
    netUUID: string = ""
  ) =>
    ROUTES.LOCATION_NETWORK_HOSTS.replace(":connUUID", connUUID)
      .replace(":locUUID", locUUID)
      .replace(":netUUID", netUUID),
  [ObjectType.HOSTS]: (
    connUUID: string = "",
    locUUID: string = "",
    netUUID: string = "",
    hostUUID: string = ""
  ) =>
    ROUTES.HOST.replace(":connUUID", connUUID)
      .replace(":locUUID", locUUID)
      .replace(":netUUID", netUUID)
      .replace(":hostUUID", hostUUID),
  [ObjectType.RUBIX_FLOW_REMOTE]: (
    connUUID: string = "",
    hostUUID: string = ""
  ) =>
    ROUTES.RUBIX_FLOW_REMOTE.replace(":connUUID", connUUID).replace(
      ":hostUUID",
      hostUUID
    ),
  [ObjectType.WIRES_CONNECTIONS_REMOTE]: (
    connUUID: string = "",
    hostUUID: string = ""
  ) =>
    ROUTES.WIRES_CONNECTIONS_REMOTE.replace(":connUUID", connUUID).replace(
      ":hostUUID",
      hostUUID
    ),
};

function getItemValue(item: any, type: string) {
  let itemC = { ...item };
  let deleteProp = "";
  switch (type) {
    case ObjectType.CONNECTIONS:
      deleteProp = ObjectType.LOCATIONS;
      break;
    case ObjectType.LOCATIONS:
      deleteProp = ObjectType.NETWORKS;
      break;
    case ObjectType.HOSTS:
    case ObjectType.RUBIX_FLOW_REMOTE:
    case ObjectType.WIRES_CONNECTIONS_REMOTE:
    default:
      deleteProp = "";
      break;
  }
  if (deleteProp) delete itemC[deleteProp];

  return itemC;
}

interface RubixObjectI {
  name: string;
  uuid: string;
  connections?: any;
  locations?: any;
  networks?: any;
  hosts?: any;
}

const getTreeObject = (item: any, next: string, prependName?: string) => {
  return {
    name: item.name,
    label: (
      <NavLink to={next} style={{ color: "unset" }}>
        <span style={{ padding: "10px 0" }}>
          <span style={{ fontWeight: 200, fontSize: 12, paddingRight: 5 }}>
            {prependName}
          </span>
          {item.name}
        </span>
      </NavLink>
    ),
    key: next,
  };
};
export const getTreeDataIterative = (connections: any) => {
  return [
    {
      ...getTreeObject(
        { name: "Supervisors", uuid: "connections" },
        ROUTES.CONNECTIONS,
        ""
      ),
      next: ROUTES.CONNECTIONS,
      children: connections.map((connection: RubixObjectI) => ({
        ...getTreeObject(
          connection,
          ObjectTypesToRoutes[ObjectType.CONNECTIONS](connection.uuid),
          ""
        ),
        next: ObjectTypesToRoutes[ObjectType.CONNECTIONS](connection.uuid),
        value: getItemValue(connection, ObjectType.CONNECTIONS),
        children: (connection.locations || []).map(
          (location: RubixObjectI) => ({
            ...getTreeObject(
              location,
              ObjectTypesToRoutes[ObjectType.LOCATIONS](
                connection.uuid,
                location.uuid
              ),
              ""
            ),
            next: ObjectTypesToRoutes[ObjectType.LOCATIONS](
              connection.uuid,
              location.uuid
            ),
            value: getItemValue(location, ObjectType.LOCATIONS),
            children: (location.networks || []).map(
              (network: RubixObjectI) => ({
                ...getTreeObject(
                  network,
                  ObjectTypesToRoutes[ObjectType.NETWORKS](
                    connection.uuid,
                    location.uuid,
                    network.uuid
                  ),
                  ""
                ),
                next: ObjectTypesToRoutes[ObjectType.NETWORKS](
                  connection.uuid,
                  location.uuid,
                  network.uuid
                ),
                value: getItemValue(network, ObjectType.NETWORKS),
                children: (network.hosts || []).map((host: RubixObjectI) => ({
                  ...getTreeObject(
                    host,
                    ObjectTypesToRoutes[ObjectType.HOSTS](
                      connection.uuid,
                      location.uuid,
                      network.uuid,
                      host.uuid
                    ),
                    ""
                  ),
                  next: ObjectTypesToRoutes[ObjectType.HOSTS](
                    connection.uuid,
                    location.uuid,
                    network.uuid,
                    host.uuid
                  ),
                  value: getItemValue(host, ObjectType.HOSTS),
                  children: [
                    {
                      ...getTreeObject(
                        { name: "wires editor", uuid: "flow_" + host.uuid },
                        ObjectTypesToRoutes[ObjectType.RUBIX_FLOW_REMOTE](
                          connection.uuid,
                          host.uuid
                        ),
                        ""
                      ),
                      next: ObjectTypesToRoutes[ObjectType.RUBIX_FLOW_REMOTE](
                        connection.uuid,
                        host.uuid
                      ),
                      value: getItemValue(host, ObjectType.RUBIX_FLOW_REMOTE),
                      children: null,
                    },
                    {
                      ...getTreeObject(
                        {
                          name: "wires connections",
                          uuid: "wires_" + host.uuid,
                        },
                        ObjectTypesToRoutes[
                          ObjectType.WIRES_CONNECTIONS_REMOTE
                        ](connection.uuid, host.uuid),
                        ""
                      ),
                      next: ObjectTypesToRoutes[
                        ObjectType.WIRES_CONNECTIONS_REMOTE
                      ](connection.uuid, host.uuid),
                      value: getItemValue(
                        host,
                        ObjectType.WIRES_CONNECTIONS_REMOTE
                      ),
                      children: null,
                    },
                  ],
                })),
              })
            ),
          })
        ),
      })),
    },
  ];
};
