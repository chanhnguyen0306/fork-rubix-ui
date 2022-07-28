import { NavLink, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { MenuProps, Spin, Switch, Image, Row, Divider, Input } from "antd";
import { Layout, Menu } from "antd";
import {
  ApartmentOutlined,
  FileSearchOutlined,
  ToolOutlined,
  HistoryOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { EventsOff, EventsOn } from "../wailsjs/runtime";
import AppRoutes from "./AppRoutes";
import { ThemeProvider } from "./themes/theme-provider";
import { useTheme } from "./themes/use-theme";
import { openNotificationWithIcon } from "./utils/utils";
import logo from "./assets/images/nube-frog-green.png";
import "./App.css";

import { ROUTES } from "./constants/routes";
import { useConnections } from "./hooks/useConnection";
const { Search } = Input;

const { Content, Sider } = Layout;

const sidebarItems = [
  { name: "Connections", icon: ApartmentOutlined, link: ROUTES.CONNECTIONS },
  // { name: "Backups", icon: HistoryOutlined, link: ROUTES.BACKUPS },
  // { name: "Logs", icon: HistoryOutlined, link: ROUTES.LOGS },
  // { name: "Networking", icon: LinkOutlined, link: ROUTES.NETWORKING },
  // { name: "Docs hardware", icon: LinkOutlined, link: ROUTES.DOCS },
  // { name: "Docs software", icon: LinkOutlined, link: ROUTES.DOCS_SOFTWARE },
  // { name: "Docs dips", icon: LinkOutlined, link: ROUTES.DOCS_DIPS },
  { name: "Tools", icon: ToolOutlined, link: "" },
  { name: "Documentation", icon: FileSearchOutlined, link: "" },
];

const OK_EVENT = "on";
const ERR_EVENT = "err";

const getParentKey = (key: React.Key, tree: any): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: any) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

const AppContainer = (props: any) => {
  const { isFetching, menuItems } = props;
  const [darkMode, setDarkMode] = useTheme();
  const location = useLocation();

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
            <Menu
              mode="inline"
              theme="dark"
              items={menuItems}
              selectedKeys={[location.pathname]}
              activeKey={location.pathname}
            ></Menu>
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
  let [isRegistered, updateIsRegistered] = useState(false);

  let navigate = useNavigate();
  const { routeData, isFetching } = useConnections();

  useEffect(() => {
    registerNotification();

    return () => {
      EventsOff(OK_EVENT);
      EventsOff(ERR_EVENT);
    };
  }, []);

  const registerNotification = () => {
    if (isRegistered) {
      return;
    }

    updateIsRegistered(true);
    EventsOn(OK_EVENT, (val) => {
      openNotificationWithIcon("success", val);
    });

    EventsOn(ERR_EVENT, (val) => {
      openNotificationWithIcon("error", val);
    });
  };

  const onClickMenu = (e: any, link: string, state?: any) => {
    e.stopPropagation();
    navigate(link, state);
  };

  const menuItems: MenuProps["items"] = sidebarItems.map((item) => {
    const { name, icon: Icon, link } = item;

    if (name === "Connections") {
      return { ...routeData[0], icon: <Icon /> } as any;
    }

    if (name === "Tools") {
      return {
        key: name,
        icon: <Icon />,
        label: <div>{name}</div>,
        name: name,
        children: [
          {
            key: "Networking",
            name: "networking",
            label: <NavLink to="/networking">Networking</NavLink>,
          },
          {
            key: "Utils",
            name: "utils",
            label: <div>Utils</div>,
            children: [
              {
                key: "Logs",
                name: "logs",
                label: <NavLink to="/logs">Logs</NavLink>,
              },
              {
                key: "Backups",
                name: "backups",
                label: <NavLink to="/backups">Backups</NavLink>,
              },
            ],
          },
        ],
      };
    }

    if (name === "Documentation") {
      return {
        key: name,
        name: name,
        icon: <Icon />,
        label: <div>{name}</div>,
        children: [
          {
            key: "Hardware",
            name: "hardware",
            label: <NavLink to="/docs">Hardware</NavLink>,
          },
          {
            key: "Software",
            name: "software",
            label: <NavLink to="/software">Software</NavLink>,
          },
          {
            key: "Dips",
            name: "dips",
            label: <NavLink to="/switch">Dips</NavLink>,
          },
        ],
      };
    }

    return {
      name: name,
      key: link,
      icon: <Icon />,
      label: <NavLink to={link}>{name}</NavLink>,
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
