import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { model } from "../../../../../../../wailsjs/go/models";
import { FlowProducerFactory } from "./factory";
import { ROUTES } from "../../../../../../constants/routes";
import RbxBreadcrumb from "../../../../../breadcrumbs/breadcrumbs";
import { ProducersTable } from "./views/table";

import Producer = model.Producer;

export const Producers = () => {
  const {
    connUUID = "",
    locUUID = "",
    netUUID = "",
    hostUUID = "",
    flNetworkUUID = "",
  } = useParams();
  const [producers, setProducers] = useState([] as Producer[]);
  const [isFetching, setIsFetching] = useState(false);

  let factory = new FlowProducerFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const routes = [
    {
      path: ROUTES.CONNECTIONS,
      breadcrumbName: "Connections",
    },
    {
      path: ROUTES.LOCATIONS.replace(":connUUID", connUUID || ""),
      breadcrumbName: "Location",
    },
    {
      path: ROUTES.LOCATION_NETWORKS.replace(
        ":connUUID",
        connUUID || ""
      ).replace(":locUUID", locUUID || ""),
      breadcrumbName: "Location Network",
    },
    {
      path: ROUTES.LOCATION_NETWORK_HOSTS.replace(":connUUID", connUUID || "")
        .replace(":locUUID", locUUID || "")
        .replace(":netUUID", netUUID),
      breadcrumbName: "Hosts",
    },
    {
      path: ROUTES.HOST.replace(":connUUID", connUUID || "")
        .replace(":locUUID", locUUID || "")
        .replace(":netUUID", netUUID || "")
        .replace(":hostUUID", hostUUID || ""),
      breadcrumbName: "Flow Networks",
    },
    {
      path: ROUTES.STREAMS.replace(":connUUID", connUUID || "")
        .replace(":locUUID", locUUID || "")
        .replace(":netUUID", netUUID || "")
        .replace(":hostUUID", hostUUID || "")
        .replace(":flNetworkUUID", flNetworkUUID || ""),
      breadcrumbName: "Streams",
    },
    {
      breadcrumbName: "Producers",
    },
  ];

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsFetching(true);
      const res = await factory.GetAll();
      setProducers(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <RbxBreadcrumb routes={routes} />
      <ProducersTable
        data={producers}
        isFetching={isFetching}
        refreshList={fetch}
      />
    </>
  );
};
