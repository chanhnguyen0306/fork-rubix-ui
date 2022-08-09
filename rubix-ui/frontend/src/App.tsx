import { NavLink, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  MenuProps,
  Spin,
  Switch,
  Image,
  Row,
  Divider,
  Input,
  Avatar,
  Dropdown,
} from "antd";
import { Layout, Menu } from "antd";
import {
  ApartmentOutlined,
  FileSearchOutlined,
  ToolOutlined,
  UserOutlined,
  KeyOutlined,
  LockFilled,
  LeftOutlined,
  LockTwoTone,
  HistoryOutlined,
  AppstoreOutlined,
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
import { TokenModal } from "./components/settings/views/token-modal";
const { Search } = Input;

const { Content, Sider } = Layout;

const sidebarItems = [
  { name: "Connections", icon: ApartmentOutlined, link: ROUTES.CONNECTIONS },
  { name: "App Store", icon: AppstoreOutlined, link: ROUTES.APP_STORE },
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

const DividerLock = (props: any) => {
  const { collapsed, collapseDisabled, setCollapseDisabled } = props;
  const handleLockSider = (e: Event) => {
    e.stopPropagation();
    setCollapseDisabled(!collapseDisabled);
  };
  return (
    <Divider
      plain
      orientation={collapsed ? "center" : "right"}
      className="white--text"
      style={{
        borderColor: "rgba(255, 255, 255, 0.12)",
      }}
    >
      {collapseDisabled ? (
        <LockTwoTone
          onClick={(e: any) => handleLockSider(e)}
          style={{ fontSize: "18px" }}
        />
      ) : (
        <LockFilled
          onClick={(e: any) => handleLockSider(e)}
          style={{ fontSize: "18px" }}
        />
      )}
    </Divider>
  );
};

const HeaderSider = (props: any) => {
  const { collapsed, collapseDisabled, setCollapsed } = props;
  return (
    <Row className="logo">
      <Image width={36} src={logo} preview={false} />
      {!collapsed ? (
        <div className="title">
          Rubix Platform{" "}
          <LeftOutlined
            style={{ marginLeft: "2rem" }}
            onClick={() => {
              if (!collapseDisabled) setCollapsed(!collapsed);
            }}
          />
        </div>
      ) : null}
    </Row>
  );
};

const AvatarDropdown = (props: any) => {
  const { setIsModalVisible } = props;
  const [darkMode, setDarkMode] = useTheme();
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <a className="my-2" onClick={() => setIsModalVisible(true)}>
              <KeyOutlined /> Token Update
            </a>
          ),
        },
        {
          key: "2",
          label: (
            <Switch
              className="my-2"
              checkedChildren="🌙"
              unCheckedChildren="☀"
              checked={darkMode}
              onChange={setDarkMode}
            />
          ),
        },
      ]}
    />
  );
  return (
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      overlayClassName="settings-dropdown"
    >
      <a onClick={(e) => e.preventDefault()}>
        <Avatar icon={<UserOutlined />} className="avar" />
      </a>
    </Dropdown>
  );
};

const AppContainer = (props: any) => {
  const { isFetching, menuItems } = props;
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [collapseDisabled, setCollapseDisabled] = useState(false);

  return (
    <Layout>
      <Sider
        width={250}
        style={{ minHeight: "100vh" }}
        collapsed={collapsed}
        onClick={() => {
          if (collapsed && !collapseDisabled) setCollapsed(false);
        }}
      >
        {isFetching ? (
          <Spin />
        ) : (
          <>
            <HeaderSider
              collapsed={collapsed}
              collapseDisabled={collapseDisabled}
              setCollapsed={setCollapsed}
            />
            <DividerLock
              collapsed={collapsed}
              collapseDisabled={collapseDisabled}
              setCollapseDisabled={setCollapseDisabled}
            />
            <Menu
              mode="inline"
              theme="dark"
              items={menuItems}
              selectedKeys={[location.pathname]}
              activeKey={location.pathname}
            />
            <AvatarDropdown setIsModalVisible={setIsModalVisible} />
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
      <TokenModal
        isModalVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </Layout>
  );
};

const App: React.FC = () => {
  let [isRegistered, updateIsRegistered] = useState(false);

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
