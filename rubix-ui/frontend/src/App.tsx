import { Routes, Route, useNavigate } from "react-router-dom";
import React from "react";
import { Layout, Menu, notification } from "antd";
import type { MenuProps } from "antd";
import { ForkOutlined, WifiOutlined } from "@ant-design/icons";
// import { EventsOn } from "../wailsjs/runtime";
import { Locations } from "./routes/locations";
import { Networks } from "./routes/networks";
import { AddHostForm } from "./routes/host";
import "./App.css";

const { Content, Sider } = Layout;
const sidebarItems = [
  { name: "Locations", icon: ForkOutlined, link: "/" },
  { name: "Networks", icon: WifiOutlined, link: "/networks" },
];

const menuItems: MenuProps["items"] = sidebarItems.map(
  ({ name, icon, link }) => {
    return {
      key: link,
      icon: React.createElement(icon),
      label: name,
    };
  }
);

const App: React.FC = () => {
  let navigate = useNavigate();

  const onClick = (e: any) => {
    navigate(e.key, { replace: true });
  };

  return (
    <Layout>
      <Sider width={200} style={{ height: "100vh" }}>
        <Menu mode="inline" theme="dark" items={menuItems} onClick={onClick} />
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
            <Route path="" element={<Locations />} />
            <Route path="locations" element={<Locations />} />
            <Route path="networks" element={<Networks />} />
            <Route path="host" element={<AddHostForm />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
