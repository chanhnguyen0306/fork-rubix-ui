import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { GetHostNetworks, GetHosts } from "../../../wailsjs/go/main/App";
import { HostsTable } from "./views/table";
import { Tabs, Typography, Card } from "antd";
import { ApartmentOutlined, RedoOutlined } from "@ant-design/icons";
import { PcScanner } from "../pc/scanner/table";
import { assistmodel } from "../../../wailsjs/go/models";
import RbxBreadcrumb from "../breadcrumbs/breadcrumbs";
import { ROUTES } from "../../constants/routes";

const { Title } = Typography;

export const Hosts = () => {
  const { TabPane } = Tabs;
  let { connUUID = "", netUUID = "", locUUID = "" } = useParams();
  const location = useLocation() as any;
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
  ];

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Hosts
      </Title>
      <Card bordered={false}>
        <RbxBreadcrumb routes={routes} />
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
      </Card>
    </>
  );
};
