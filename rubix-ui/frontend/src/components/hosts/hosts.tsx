import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  GetHostNetworks,
  GetHosts,
  GetHostSchema,
} from "../../../wailsjs/go/main/App";
import { isObjectEmpty } from "../../utils/utils";
import { AddButton, CreateEditModal } from "./views/create";
import { HostsTable } from "./views/table";
import { Tabs } from "antd";
import { ApartmentOutlined, RedoOutlined } from "@ant-design/icons";
import { PcScanner } from "../pc/scanner/table";
import { assistmodel } from "../../../wailsjs/go/models";

export const Hosts = () => {
  const { TabPane } = Tabs;
  let { netUUID } = useParams();
  const location = useLocation() as any;
  const connUUID = location.state.connUUID ?? "";
  const [hosts, setHosts] = useState([] as assistmodel.Host[]);
  const [networks, setNetworks] = useState([] as assistmodel.Network[]);
  const [currentHost, setCurrentHost] = useState({} as assistmodel.Host);
  const [hostSchema, setHostSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  useEffect(() => {
    if (networks.length === 0) {
      fetchNetworks();
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [netUUID]);

  const fetchList = async () => {
    try {
      setIsFetching(true);
      const res = (await GetHosts(connUUID))
        .filter((h) => h.network_uuid === netUUID)
        .map((h) => {
          h.enable = !h.enable ? false : h.enable;
          return h;
        });
      setHosts(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchNetworks = async () => {
    const res = await GetHostNetworks(connUUID);
    setNetworks(res);
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await GetHostSchema(connUUID);
    res.properties = {
      ...res.properties,
      network_uuid: {
        title: "network",
        type: "string",
        anyOf: networks.map((n: assistmodel.Network) => {
          return { type: "string", enum: [n.uuid], title: n.name };
        }),
        default: netUUID,
      },
    };
    setHostSchema(res);
    setIsLoadingForm(false);
  };

  const refreshList = () => {
    fetchList();
  };

  const showModal = (host: assistmodel.Host) => {
    setCurrentHost(host);
    setIsModalVisible(true);
    if (isObjectEmpty(hostSchema)) {
      getSchema();
    }
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
    setCurrentHost({} as assistmodel.Host);
  };

  return (
    <>
      <h2>Hosts</h2>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <ApartmentOutlined />
              Hosts
            </span>
          }
          key="1"
        >
          <AddButton showModal={showModal} />
          <CreateEditModal
            hosts={hosts}
            currentHost={currentHost}
            hostSchema={hostSchema}
            isModalVisible={isModalVisible}
            isLoadingForm={isLoadingForm}
            connUUID={connUUID}
            refreshList={refreshList}
            onCloseModal={onCloseModal}
          />
          <HostsTable
            hosts={hosts}
            networks={networks}
            isFetching={isFetching}
            refreshList={refreshList}
            showModal={showModal}
            connUUID={connUUID}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <RedoOutlined />
              Discover
            </span>
          }
          key="2"
        >
          <PcScanner />
        </TabPane>
      </Tabs>
    </>
  );
};
