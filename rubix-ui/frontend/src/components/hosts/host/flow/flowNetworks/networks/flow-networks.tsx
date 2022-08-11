import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FlowFrameworkNetworkFactory } from "./factory";
import { model } from "../../../../../../../wailsjs/go/models";
import { ROUTES } from "../../../../../../constants/routes";
import RbxBreadcrumb from "../../../../../breadcrumbs/breadcrumbs";
import { FlowNetworksTable } from "./views/table";

import FlowNetwork = model.FlowNetwork;

export const FlowNetworks = () => {
  const {
    connUUID = "",
    locUUID = "",
    netUUID = "",
    hostUUID = "",
    flNetworkUUID = "",
  } = useParams();
  const [networks, setNetworks] = useState([] as FlowNetwork[]);
  const [isFetching, setIsFetching] = useState(false);

  let factory = new FlowFrameworkNetworkFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  //   const routes = [
  //     {
  //       path: ROUTES.CONNECTIONS,
  //       breadcrumbName: "Connections",
  //     },
  //     {
  //       path: ROUTES.LOCATIONS.replace(":connUUID", connUUID || ""),
  //       breadcrumbName: "Location",
  //     },
  //     {
  //       path: ROUTES.LOCATION_NETWORKS.replace(
  //         ":connUUID",
  //         connUUID || ""
  //       ).replace(":locUUID", locUUID || ""),
  //       breadcrumbName: "Location Network",
  //     },
  //     {
  //       path: ROUTES.LOCATION_NETWORK_HOSTS.replace(":connUUID", connUUID || "")
  //         .replace(":locUUID", locUUID || "")
  //         .replace(":netUUID", netUUID),
  //       breadcrumbName: "Hosts",
  //     },
  //     {
  //       path: ROUTES.HOST.replace(":connUUID", connUUID || "")
  //         .replace(":locUUID", locUUID || "")
  //         .replace(":netUUID", netUUID || "")
  //         .replace(":hostUUID", hostUUID || ""),
  //       breadcrumbName: "Flow Networks",
  //     },
  //     {
  //       breadcrumbName: "Streams",
  //     },
  //   ];

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsFetching(false);
      let res = await factory.GetAll(true);
      setNetworks(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      {/* <RbxBreadcrumb routes={routes} /> */}

      <FlowNetworksTable
        data={networks}
        isFetching={isFetching}
        refreshList={fetch}
      />
    </>
  );
};
