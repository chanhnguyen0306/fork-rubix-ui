import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { MenuProps, Spin } from "antd";
import { Layout, Menu } from "antd";
import {
  LinkOutlined,
  HistoryOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import {assistmodel, model, storage} from "../wailsjs/go/models";
import { Hosts } from "./components/hosts/hosts";
import { Locations } from "./components/locations/locations";
import { Connections } from "./components/connections/connections";
import { Logs } from "./components/logs/logs";
import { PcScanner } from "./components/pc/scanner/table";
import { PcNetworking } from "./components/pc/networking/networking";
import Iframe from "./components/iframe/iframe";
import { ConnectionFactory } from "./components/connections/factory";
import { LocationFactory } from "./components/locations/factory";


import Location = assistmodel.Location;
import Network = assistmodel.Network;

import "./App.css";
import Upload from "./components/file";
import {Backups} from "./components/backups/backups";
import {BackupFactory} from "./components/backups/factory";
import {Host} from "./components/hosts/host/host";
import {FlowDevices} from "./components/hosts/host/flow/devices/flowDevices";
import {FlowPoints} from "./components/hosts/host/flow/points/flowPoints";
import {Networks} from "./components/hostNetworks/networks";

const { Content, Sider } = Layout;



const sidebarItems = [
  { name: "Connections", icon: ApartmentOutlined, link: "/" },
  { name: "Backups", icon: HistoryOutlined, link: "/backups" },
  { name: "Logs", icon: HistoryOutlined, link: "/logs" },
  { name: "iframe", icon: LinkOutlined, link: "/iframe" },
  { name: "scanner", icon: LinkOutlined, link: "/scanner" },
  { name: "networking", icon: LinkOutlined, link: "/networking" },
];

const App: React.FC = () => {
  let locationFactory = new LocationFactory();
  let connectionFactory = new ConnectionFactory();


  // backups test
  // let back = new BackupFactory();
  // back.connectionUUID = "cloud";
  // back.hostUUID = "rc";
  // back.application = "RubixWires"
  // back.uuid = "bac_0EF8BBF1894E"; //change this as needed
  // back.GetBackupsRubixWires().then(r => console.log("GetBackupsRubixWires", r))
  // back.WiresBackup().then(r => console.log("WiresBackup", r))
  // back.WiresRestore().then(r => console.log("WiresRestore", r))

  // const location = useLocation();
  // const { pathname } = location;
  let navigate = useNavigate();

  const [connections, setConnections] = useState([] as any[]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setIsFetching(true);
      let connections = (await connectionFactory.GetAll()) as any;
      if (!connections) return setConnections([]);
      for (const c of connections) {
        let locations = [];
        locations = await getLocations(c.uuid);
        c.locations = locations;
      }
      setConnections(connections);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
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
    return !locations || locations.length === 0
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
      <Sider width={250} style={{ height: "100vh" }}>
        {isFetching ? (
          <Spin />
        ) : (
          <Menu
            mode="inline"
            theme="dark"
            items={menuItems}
            selectedKeys={[location.pathname]}
          />
        )}
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
            <Route path="/host/:hostUUID" element={<Host />} /> / open flow networks
            <Route path="/flow/networks/:networkUUID" element={<FlowDevices />} />  // open flow devices
            <Route path="/flow/devices/:deviceUUID" element={<FlowPoints />} />  // open flow network points
            <Route path="/logs" element={<Logs />} />
            <Route path="/backups" element={<Backups />} />
            <Route path="/scanner" element={<PcScanner />} />
            <Route path="/networking" element={<PcNetworking />} />
            <Route
              path="/iframe"
              element={<Upload/>}
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
