import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  GetHostNetworks,
  GetLocations,
  GetNetworkSchema,
} from "../../../wailsjs/go/main/App";
import { isObjectEmpty } from "../../utils/utils";
import { AddButton, CreateEditModal } from "./views/create";
import { NetworksTable } from "./views/table";
import {assistmodel} from "../../../wailsjs/go/models";

export const Networks = () => {
  const [networks, setNetworks] = useState([] as assistmodel.Network[]);
  const [locations, setLocations] = useState([] as assistmodel.Location[]);
  const [currentNetwork, setCurrentNetwork] = useState({} as assistmodel.Network);
  const [networkSchema, setNetworkSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  let { locUUID } = useParams();
  const location = useLocation() as any;
  const connUUID = location.state.connUUID ?? "";

  useEffect(() => {
    if (locations.length === 0) {
      fetchLocations();
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [locUUID]);

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
  };

  return (
    <>
      <h1>Networks</h1>

      <AddButton showModal={showModal} />
      <CreateEditModal
        networks={networks}
        currentNetwork={currentNetwork}
        networkSchema={networkSchema}
        isModalVisible={isModalVisible}
        isLoadingForm={isLoadingForm}
        onCloseModal={onCloseModal}
        refreshList={refreshList}
        connUUID={connUUID}
      />
      <NetworksTable
        networks={networks}
        locations={locations}
        isFetching={isFetching}
        showModal={showModal}
        refreshList={refreshList}
        connUUID={connUUID}
      />
    </>
  );
};
