import { Route, Routes, useNavigate } from "react-router-dom";
import React from "react";
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
import { Connections } from "./components/connections/connections";
import "./App.css";
import Iframe from "./components/iframe/iframe";
import { Logs } from "./components/logs/logs";

const { Content, Sider } = Layout;

const sidebarItems = [
  { name: "Connections", icon: ApartmentOutlined, link: "/" },
  { name: "Logs", icon: HistoryOutlined, link: "/logs" },
  { name: "iframe", icon: LinkOutlined, link: "/iframe" },
];

const App: React.FC = () => {
  let navigate = useNavigate();

  const onClickSubMenu = (e: any) => {
    console.log("onClickSubMenu", e);
    // navigate(e.key);
  };

  const onClickMenu = (e: any, link: string) => {
    e.stopPropagation();
    console.log("onClickMenu", e);
    console.log("link", link);

    // navigate(e.key);
  };

  const menuItems: MenuProps["items"] = sidebarItems.map(
    ({ name, icon, link }) => {
      return {
        key: link,
        icon: React.createElement(icon),
        label: <span onClick={(e) => onClickMenu(e, link)}>{name}</span>,
        children: [
          { label: "item 1", key: "logs1" },
          { label: "item 2", key: "iframe1" },
        ],
      };
    }
  );

  return (
    <Layout>
      <Sider width={200} style={{ height: "100vh" }}>
        <Menu
          mode="inline"
          theme="dark"
          items={menuItems}
          onClick={onClickSubMenu}
        />
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
