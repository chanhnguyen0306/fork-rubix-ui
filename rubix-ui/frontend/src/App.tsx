import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import {
  LinkOutlined,
  HistoryOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { model, storage } from "../wailsjs/go/models";
import { Hosts } from "./components/hosts/hosts";
import { Locations } from "./components/locations/locations";
import { Networks } from "./components/networks/networks";
import { Connections } from "./components/connections/connections";
import { Logs } from "./components/logs/logs";
import { PcScanner } from "./components/pc/scanner/table";
import { PcNetworking } from "./components/pc/networking/networking";
import Iframe from "./components/iframe/iframe";
import { ConnectionFactory } from "./components/connections/factory";
import { LocationFactory } from "./components/locations/factory";

// import RubixConnection = storage.RubixConnection;
import Location = model.Location;
import Network = model.Network;

import "./App.css";

const { Content, Sider } = Layout;

const sidebarItems = [
  { name: "Connections", icon: ApartmentOutlined, link: "/" },
  { name: "Logs", icon: HistoryOutlined, link: "/logs" },
  { name: "iframe", icon: LinkOutlined, link: "/iframe" },
  { name: "scanner", icon: LinkOutlined, link: "/scanner" },
  { name: "networking", icon: LinkOutlined, link: "/networking" },
];

const App: React.FC = () => {
  let locationFactory = new LocationFactory();
  let connectionFactory = new ConnectionFactory();

  // const location = useLocation();
  // const { pathname } = location;
  let navigate = useNavigate();

  const [connections, setConnections] = useState([] as any[]);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    let connections = await connectionFactory.GetAll();
    console.log(connections);
    if (!connections) return setConnections([]);
    connections.forEach(async (c: any) => {
      let locations = [];
      locations = await getLocations(c.uuid);
      c.locations = locations as any;
    });
    setConnections(connections);
  };

  const getLocations = async (connUUID: string) => {
    let res = [] as Location[];
    try {
      locationFactory.connectionUUID = connUUID;
      res = await locationFactory.GetAll();
    } catch (error) {
      res = [];
    }
    return res;
  };

  const onClickMenu = (e: any, link: string, state?: any) => {
    e.stopPropagation();
    navigate(link, state);
  };

  const getSubMenuConnections = () => {
    return connections.length === 0
      ? null
      : connections.map((c: any) => {
          return {
            key: c.uuid,
            label: (
              <div onClick={(e) => onClickMenu(e, `/locations/${c.uuid}`)}>
                {c.name}
              </div>
            ),
            children: getSubMenuLocations(c.locations, c.uuid),
          };
        });
  };

  const getSubMenuLocations = (locations: any, connUUID: string) => {
    return !locations
      ? null
      : locations.map((location: Location) => {
          return {
            key: location.uuid,
            label: (
              <div
                onClick={(e) =>
                  onClickMenu(e, `/networks/${location.uuid}`, {
                    state: { connUUID: connUUID },
                  })
                }
              >
                {location.name}
              </div>
            ),
            children:
              location.networks.length === 0
                ? null
                : location.networks.map((network: Network) => {
                    return {
                      key: network.uuid,
                      label: (
                        <div
                          onClick={(e) =>
                            onClickMenu(e, `/hosts/${network.uuid}`, {
                              state: { connUUID: connUUID },
                            })
                          }
                        >
                          {network.name}
                        </div>
                      ),
                    };
                  }),
          };
        });
  };

  const menuItems: MenuProps["items"] = sidebarItems.map((item) => {
    const { name, icon, link } = item;
    if (name === "Connections") {
      return {
        key: link,
        icon: React.createElement(icon),
        label: <div onClick={(e) => onClickMenu(e, link)}>{name}</div>,
        children: getSubMenuConnections(),
      };
    }

    return {
      key: link,
      icon: React.createElement(icon),
      label: <div onClick={(e) => onClickMenu(e, link)}>{name}</div>,
    };
  });

  return (
    <Layout>
      <Sider width={200} style={{ height: "100vh" }}>
        <Menu
          mode="inline"
          theme="dark"
          items={menuItems}
          // selectedKeys={[location.pathname]}
        />
        ;
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Routes>
            <Route path="/" element={<Connections />} />
            <Route path="/locations/:connUUID" element={<Locations />} />
            <Route path="/networks/:locUUID" element={<Networks />} />
            <Route path="/hosts/:netUUID" element={<Hosts />} />

            <Route path="/logs" element={<Logs />} />
            <Route path="/scanner" element={<PcScanner />} />
            <Route path="/networking" element={<PcNetworking />} />
            <Route
              path="/iframe"
              element={<Iframe source={"https://nube-io.com/"} />}
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
