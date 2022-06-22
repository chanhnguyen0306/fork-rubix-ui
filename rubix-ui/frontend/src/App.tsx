import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import {
  LinkOutlined,
  HistoryOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Locations } from "./routes/locations";
import { Networks } from "./routes/networks";
import { Hosts } from "./routes/hosts";
import { model, storage } from "../wailsjs/go/models";
import { Connections } from "./components/connections/connections";
import Iframe from "./components/iframe/iframe";
import { Logs } from "./components/logs/logs";
import { LocationFactory } from "./components/locations/locations";
import { ConnectionFactory } from "./components/connections/factory";
import RubixConnection = storage.RubixConnection;
import Location = model.Location;
import Network = model.Network;

import { GetLocations } from "../wailsjs/go/main/App";
import "./App.css";
import { PcScanner } from "./components/pc/scanner/table";

const { Content, Sider } = Layout;

const sidebarItems = [
  { name: "Connections", icon: ApartmentOutlined, link: "/" },
  { name: "Logs", icon: HistoryOutlined, link: "/logs" },
  { name: "iframe", icon: LinkOutlined, link: "/iframe" },
  { name: "table", icon: LinkOutlined, link: "/table" },
];

const App: React.FC = () => {
  const [connections, setConnections] = useState([] as RubixConnection[]);
  const [locations, setLocations] = useState([] as Location[]);

  const location = useLocation();
  const { pathname } = location;
  let navigate = useNavigate();
  let locationFactory = new LocationFactory();
  let connectionFactory = new ConnectionFactory();

  useEffect(() => {
    fetchConnections();
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    let res = await GetLocations("con_016470BF4CA7");
    setLocations(res);
  };

  const fetchConnections = async () => {
    let res = await connectionFactory.GetAll();
    setConnections(res);
  };

  const onClickMenu = (e: any, link: string, state?: any) => {
    e.stopPropagation();
    navigate(link, state);
  };

  const menuItems: MenuProps["items"] = sidebarItems.map((item) => {
    const { name, icon, link } = item;
    console.log(locations);

    if (name === "Connections") {
      return {
        key: link,
        icon: React.createElement(icon),
        label: <span onClick={(e) => onClickMenu(e, link)}>{name}</span>,
        children:
          connections.length === 0
            ? null
            : connections.map((c: RubixConnection) => {
                return {
                  key: c.uuid,
                  label: (
                    <span
                      onClick={(e) => onClickMenu(e, `/locations/${c.uuid}`)}
                    >
                      {c.name}
                    </span>
                  ),
                  children: locations.map((location: Location) => {
                    return {
                      key: location.uuid,
                      label: (
                        <span
                          onClick={(e) =>
                            onClickMenu(e, `/networks/${location.uuid}`, {
                              state: { connUUID: c.uuid },
                            })
                          }
                        >
                          {location.name}
                        </span>
                      ),
                      children: location.networks.map((network: Network) => {
                        return {
                          key: network.uuid,
                          label: (
                            <span
                              onClick={(e) =>
                                onClickMenu(e, `/hosts/${network.uuid}`, {
                                  state: { connUUID: c.uuid },
                                })
                              }
                            >
                              {network.name}
                            </span>
                          ),
                        };
                      }),
                    };
                  }),
                };
              }),
      };
    }

    return {
      key: link,
      icon: React.createElement(icon),
      label: <span onClick={(e) => onClickMenu(e, link)}>{name}</span>,
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
            <Route path="/logs" element={<Logs />} />
            <Route path="/table" element={<PcScanner />} />
            <Route
              path="/iframe"
              element={<Iframe source={"https://nube-io.com/"} />}
            />
            <Route path="/locations/:connUUID" element={<Locations />} />
            <Route path="/networks/:locUUID" element={<Networks />} />
            <Route path="/hosts/:netUUID" element={<Hosts />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
