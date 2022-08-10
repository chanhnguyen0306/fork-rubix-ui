import React from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

let ObjectType = {
  CONNECTIONS: "connection",
  LOCATIONS: "locations",
  NETWORKS: "networks",
  HOSTS: "hosts",
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

function getTreeObject(item: any, next: string, prependName?: string) {
  return {
    name: item.name,
    title: (
      <NavLink to={next}>
        <span>{item.name}</span>
      </NavLink>
    ),
    label: (
      <NavLink to={next}>
        <span style={{ padding: "10px 0" }}>
          <span style={{ fontWeight: 200, fontSize: 12, paddingRight: 5 }}>
            {prependName}
          </span>
          {item.name}
        </span>
      </NavLink>
    ),
    uuid: item.uuid,
    key: item.uuid,
  };
}

export function getTreeDataIterative(connections: any) {
  return [
    {
      ...getTreeObject(
        { name: "Connections", uuid: "connections" },
        ROUTES.CONNECTIONS,
        ""
      ),
      next: ROUTES.CONNECTIONS,
      children: connections.map((connection: RubixObjectI) => ({
        ...getTreeObject(
          connection,
          ObjectTypesToRoutes[ObjectType.CONNECTIONS](connection.uuid),
          "Loc"
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
              "Nets"
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
                  "Loc Nets"
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
                    "Host"
                  ),
                  next: ObjectTypesToRoutes[ObjectType.HOSTS](
                    connection.uuid,
                    location.uuid,
                    network.uuid,
                    host.uuid
                  ),
                  value: getItemValue(host, ObjectType.HOSTS),
                  children: null,
                })),
              })
            ),
          })
        ),
      })),
    },
  ];
}
