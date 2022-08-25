import { Tabs, Typography, Card } from "antd";
import { ApartmentOutlined, RedoOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GetHosts, GetHostNetworks } from "../../../wailsjs/go/main/App";
import { assistmodel } from "../../../wailsjs/go/models";
import { ROUTES } from "../../constants/routes";
import RbxBreadcrumb from "../breadcrumbs/breadcrumbs";
import { PcScanner } from "../pc/scanner/table";
import { HostsTable } from "./views/table";

const { TabPane } = Tabs;
const { Title } = Typography;

const HostsTab = () => {
  return (
    <span>
      <ApartmentOutlined />
      HOSTS
    </span>
  );
};

const DiscoverTab = () => {
  return (
    <span>
      <RedoOutlined />
      DISCOVER
    </span>
  );
};

export const Hosts = () => {
  let { connUUID = "", netUUID = "", locUUID = "" } = useParams();
  const [hosts, setHosts] = useState([] as assistmodel.Host[]);
  const [networks, setNetworks] = useState([] as assistmodel.Network[]);
  const [isFetching, setIsFetching] = useState(false);

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

  const routes = [
    {
      path: ROUTES.CONNECTIONS,
      breadcrumbName: "Supervisors",
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
  ];

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Hosts
      </Title>
      <Card bordered={false}>
        <RbxBreadcrumb routes={routes} />
        <Tabs defaultActiveKey="1">
          <TabPane tab={HostsTab()} key="1">
            <HostsTable
              hosts={hosts}
              networks={networks}
              isFetching={isFetching}
              refreshList={refreshList}
            />
          </TabPane>
          <TabPane tab={DiscoverTab()} key="2">
            <PcScanner />
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
};
