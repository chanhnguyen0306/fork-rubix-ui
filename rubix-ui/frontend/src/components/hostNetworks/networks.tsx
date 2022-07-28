import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  GetHostNetworks,
  GetLocations,
  GetNetworkSchema,
} from "../../../wailsjs/go/main/App";
import { Card, Typography } from "antd";
import { isObjectEmpty } from "../../utils/utils";
import { AddButton, CreateEditModal } from "./views/create";
import { NetworksTable } from "./views/table";
import { assistmodel } from "../../../wailsjs/go/models";
import RbxBreadcrumb from "../breadcrumbs/breadcrumbs";
import { ROUTES } from "../../constants/routes";

const { Title } = Typography;

export const Networks = () => {
  const [networks, setNetworks] = useState([] as assistmodel.Network[]);
  const [locations, setLocations] = useState([] as assistmodel.Location[]);
  const [currentNetwork, setCurrentNetwork] = useState(
    {} as assistmodel.Network
  );
  const [networkSchema, setNetworkSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  let { locUUID, connUUID = "" } = useParams();

  useEffect(() => {
    if (locations.length === 0) {
      fetchLocations();
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [locUUID, connUUID]);

  const fetchList = async () => {
    try {
      setIsFetching(true);
      const res = await GetHostNetworks(connUUID);
      const networksByLocUUID = res.filter((n) => n.location_uuid === locUUID);
      setNetworks(networksByLocUUID);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchLocations = async () => {
    const res = await GetLocations(connUUID);
    setLocations(res);
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await GetNetworkSchema(connUUID);
    res.properties = {
      ...res.properties,
      location_uuid: {
        title: "location",
        type: "string",
        anyOf: locations.map((l: assistmodel.Location) => {
          return { type: "string", enum: [l.uuid], title: l.name };
        }),
        default: locUUID,
      },
    };
    setNetworkSchema(res);
    setIsLoadingForm(false);
  };

  const refreshList = () => {
    fetchList();
  };

  const showModal = (network: assistmodel.Network) => {
    setCurrentNetwork(network);
    setIsModalVisible(true);
    if (isObjectEmpty(networkSchema)) {
      getSchema();
    }
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
    setCurrentNetwork({} as assistmodel.Network);
  };

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
      breadcrumbName: 'Location Network'
    },
  ];

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Networks
      </Title>
      <Card bordered={false}>
        <RbxBreadcrumb routes={routes} />
        <AddButton showModal={showModal} />
        <CreateEditModal
          networks={networks}
          currentNetwork={currentNetwork}
          networkSchema={networkSchema}
          isModalVisible={isModalVisible}
          isLoadingForm={isLoadingForm}
          connUUID={connUUID}
          locUUID={locUUID}
          onCloseModal={onCloseModal}
          refreshList={refreshList}
        />
        <NetworksTable
          networks={networks}
          locations={locations}
          isFetching={isFetching}
          showModal={showModal}
          refreshList={refreshList}
          connUUID={connUUID}
          locUUID={locUUID}
        />
      </Card>
    </>
  );
};
