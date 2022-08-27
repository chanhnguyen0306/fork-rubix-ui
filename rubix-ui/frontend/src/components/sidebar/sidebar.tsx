import {
  Layout,
  Divider,
  Row,
  Menu,
  Switch,
  Image,
  Dropdown,
  Avatar,
  MenuProps,
  Spin,
  Select,
  Tooltip,
} from "antd";
import {
  ApartmentOutlined,
  ToolOutlined,
  UserOutlined,
  KeyOutlined,
  LockFilled,
  LeftOutlined,
  LockTwoTone,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useTheme } from "../../themes/use-theme";
import { TokenModal } from "../settings/views/token-modal";
import { useConnections } from "../../hooks/useConnection";
import logo from "../../assets/images/nube-frog-green.png";

const { Sider } = Layout;
const { Option } = Select;

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
  const menu = (
    <Menu
      _internalDisableMenuItemTitleTooltip
      items={[
        {
          key: "1",
          label: SwitchThemeMenuItem(),
        },
        {
          key: "2",
          label: TokenMenuItem(props),
        },
        {
          key: "3",
          label: AutoRefreshPointsMenuItem(),
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
      <a onClick={(e) => e.stopPropagation()}>
        <Avatar icon={<UserOutlined />} className="avar" />
      </a>
    </Dropdown>
  );
};

const TokenMenuItem = (props: any) => {
  const { setIsModalVisible } = props;
  return (
    <a className="my-2" onClick={() => setIsModalVisible(true)}>
      <KeyOutlined /> Token Update
    </a>
  );
};

const SwitchThemeMenuItem = () => {
  const [darkMode, setDarkMode] = useTheme();
  return (
    <Switch
      className="my-2"
      checkedChildren="🌙"
      unCheckedChildren="☀"
      checked={darkMode}
      onChange={setDarkMode}
    />
  );
};

const AutoRefreshPointsMenuItem = () => {
  const [time, setTime] = useState("5");
  const [isEnable, setIsEnable] = useState(false);

  const handleChangeTime = (value: string) => {
    setTime(value);
    if (isEnable) {
      const refreshTime = Number(time) * 1000;
      //add enpoint refresh points here
    }
  };

  const handleChangeEnable = (checked: boolean) => {
    const refreshTime = Number(time) * 1000;
    setIsEnable(checked);
    //add enpoint refresh points here
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Tooltip title="Auto Refresh Points">
        <Switch
          style={{ marginRight: "10px" }}
          checked={isEnable}
          onChange={handleChangeEnable}
        />
      </Tooltip>
      <Select
        style={{ width: 120 }}
        value={time}
        disabled={!isEnable}
        onChange={handleChangeTime}
      >
        <Option value="5">5 sec</Option>
        <Option value="15">15 sec</Option>
        <Option value="30">30 sec</Option>
      </Select>
    </div>
  );
};

export const MenuSidebar = () => {
  const location = useLocation();
  const { routeData, isFetching } = useConnections();
  const [collapsed, setCollapsed] = useState(false);
  const [collapseDisabled, setCollapseDisabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const sidebarItems = [
    { name: "Supervisors", icon: ApartmentOutlined, link: ROUTES.CONNECTIONS },
    { name: "App Store", icon: AppstoreOutlined, link: ROUTES.APP_STORE },
    { name: "Tools", icon: ToolOutlined, link: "" },
  ];

  const menuItems: MenuProps["items"] = sidebarItems.map((item) => {
    const { name, icon: Icon, link } = item;

    if (name === "Supervisors") {
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

    return {
      name: name,
      key: link,
      icon: <Icon />,
      label: <NavLink to={link}>{name}</NavLink>,
    };
  });

  return (
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

          <TokenModal
            isModalVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          />
        </>
      )}
    </Sider>
  );
};
