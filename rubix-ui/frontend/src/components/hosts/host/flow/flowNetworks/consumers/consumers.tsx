import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FlowConsumerFactory } from "./factory";
import { model } from "../../../../../../../wailsjs/go/models";
import { ROUTES } from "../../../../../../constants/routes";
import RbxBreadcrumb from "../../../../../breadcrumbs/breadcrumbs";
import { ConsumersTable } from "./views/table";

import Consumer = model.Consumer;

export const Consumers = () => {
  const {
    connUUID = "",
    locUUID = "",
    netUUID = "",
    hostUUID = "",
    flNetworkUUID = "",
  } = useParams();
  const [consumers, setConsumers] = useState([] as Consumer[]);
  const [isFetching, setIsFetching] = useState(false);

  let factory = new FlowConsumerFactory();
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
      breadcrumbName: "Consumers",
    },
  ];

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsFetching(true);
      const res = await factory.GetAll(false);
      setConsumers(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <RbxBreadcrumb routes={routes} />
      <ConsumersTable
        data={consumers}
        isFetching={isFetching}
        refreshList={fetch}
      />
    </>
  );
};
