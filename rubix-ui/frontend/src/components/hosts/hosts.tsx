import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { GetHostNetworks, GetHosts } from "../../../wailsjs/go/main/App";
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
  const [isFetching, setIsFetching] = useState(true);

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

  const refreshList = () => {
    fetchList();
  };

  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <ApartmentOutlined />
              HOSTS
            </span>
          }
          key="1"
        >
          <HostsTable
            hosts={hosts}
            networks={networks}
            isFetching={isFetching}
            connUUID={connUUID}
            netUUID={netUUID}
            refreshList={refreshList}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <RedoOutlined />
              DISCOVER
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
