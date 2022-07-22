import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { MenuProps, Spin, Switch, Image, Row, Divider } from "antd";
import { Layout, Menu } from "antd";
import {
  ApartmentOutlined,
  FileSearchOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { assistmodel } from "../wailsjs/go/models";
import { EventsOn } from "../wailsjs/runtime";
import AppRoutes from "./AppRoutes";
import { ThemeProvider } from "./themes/theme-provider";
import { useTheme } from "./themes/use-theme";
import { openNotificationWithIcon } from "./utils/utils";
import { ConnectionFactory } from "./components/connections/factory";
import { LocationFactory } from "./components/locations/factory";
import logo from "./assets/images/nube-frog-green.png";
import "./App.css";

import Location = assistmodel.Location;
import Network = assistmodel.Network;

const { Content, Sider } = Layout;

const sidebarItems = [
  { name: "Connections", icon: ApartmentOutlined, link: "/" },
  { name: "Tools", icon: ToolOutlined, link: "" },
  { name: "Documentation", icon: FileSearchOutlined, link: "" },
];

let loadCount = 0;

const AppContainer = (props: any) => {
  const { isFetching, menuItems } = props;
  const [darkMode, setDarkMode] = useTheme();

  return (
    <Layout>
      <Sider width={250} style={{ minHeight: "100vh" }}>
        {isFetching ? (
          <Spin />
        ) : (
          <>
            <Row className="logo">
              <Image width={36} src={logo} preview={false} />
              <h4 className="title">Rubix Platform</h4>
            </Row>
            <Divider
              style={{ borderTop: "1px solid rgba(255, 255, 255, 0.12)" }}
            />
            <Menu mode="inline" theme="dark" items={menuItems} />
            <Switch
              className="menu-toggle"
              checkedChildren="🌙"
              unCheckedChildren="☀"
              checked={darkMode}
              onChange={setDarkMode}
            />
          </>
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
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  let locationFactory = new LocationFactory();
  let connectionFactory = new ConnectionFactory();

  if (loadCount == 0) {
    // main app loads a few time, I don't know why Aidan
    EventsOn("ok", (val) => {
      console.log(val, "networks");
      openNotificationWithIcon("success", val);
    });

    EventsOn("err", (val) => {
      console.log(val, "networks");
      openNotificationWithIcon("error", val);
    });
  }
  loadCount++;

  let navigate = useNavigate();
  const location = useLocation() as any;

  const [connections, setConnections] = useState([] as any[]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  const onClickMenu = (e: any, link: string, state?: any) => {
    e.stopPropagation();
    navigate(link, state);
  };

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

  const getSubMenuConnections = () => {
    return connections.length === 0
      ? null
      : connections.map((c: any) => {
          return {
            key: c.uuid,
            label: (
              <div
                onClick={(e) => onClickMenu(e, `/locations/${c.uuid}`)}
                className={getActiveClass(`/locations/${c.uuid}`)}
              >
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
                className={getActiveClass(`/networks/${location.uuid}`)}
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
                          className={getActiveClass(`/hosts/${network.uuid}`)}
                        >
                          {network.name}
                        </div>
                      ),
                    };
                  }),
          };
        });
  };

  const getActiveClass = (link: string) => {
    return location.pathname === link ? "active" : "";
  };

  const menuItems: MenuProps["items"] = sidebarItems.map((item) => {
    const { name, icon, link } = item;
    if (name === "Connections") {
      return {
        key: link,
        icon: React.createElement(icon),
        label: (
          <div
            onClick={(e) => onClickMenu(e, link)}
            className={getActiveClass("/")}
          >
            {name}
          </div>
        ),
        children: getSubMenuConnections(),
      };
    }

    if (name === "Tools") {
      return {
        key: name,
        icon: React.createElement(icon),
        label: <div>{name}</div>,
        children: [
          {
            key: "Networking",
            label: (
              <div
                onClick={(e) => onClickMenu(e, "/networking")}
                className={getActiveClass("/networking")}
              >
                Networking
              </div>
            ),
          },
          {
            key: "Utils",
            label: <div>Utils</div>,
            children: [
              {
                key: "Logs",
                label: (
                  <div
                    onClick={(e) => onClickMenu(e, "/logs")}
                    className={getActiveClass("/logs")}
                  >
                    Logs
                  </div>
                ),
              },
              {
                key: "Backups",
                label: (
                  <div
                    onClick={(e) => onClickMenu(e, "/backups")}
                    className={getActiveClass("/backups")}
                  >
                    Backups
                  </div>
                ),
              },
            ],
          },
        ],
      };
    }

    if (name === "Documentation") {
      return {
        key: name,
        icon: React.createElement(icon),
        label: <div>{name}</div>,
        children: [
          {
            key: "Hardware",
            label: (
              <div
                onClick={(e) => onClickMenu(e, "/docs")}
                className={getActiveClass("/docs")}
              >
                Hardware
              </div>
            ),
          },
          {
            key: "Software",
            label: (
              <div
                onClick={(e) => onClickMenu(e, "/software")}
                className={getActiveClass("/software")}
              >
                Software
              </div>
            ),
          },
          {
            key: "Dips",
            label: (
              <div
                onClick={(e) => onClickMenu(e, "/switch")}
                className={getActiveClass("/switch")}
              >
                Dips
              </div>
            ),
          },
        ],
      };
    }

    return {
      key: name,
      icon: React.createElement(icon),
      label: <div onClick={(e) => onClickMenu(e, link)}>{name}</div>,
    };
  });

  return (
    <ThemeProvider>
      <AppContainer menuItems={menuItems} isFetching={isFetching}>
        <AppRoutes></AppRoutes>
      </AppContainer>
    </ThemeProvider>
  );
};
export default App;
