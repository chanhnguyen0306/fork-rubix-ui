import { Route, Routes, useNavigate } from "react-router-dom";
import React from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { ForkOutlined, WifiOutlined, LinkOutlined } from "@ant-design/icons";
import { Locations } from "./routes/locations";
import { Networks } from "./routes/networks";
import { AddHostForm } from "./routes/host";
import { Connections } from "./routes/connections";
import "./App.css";

const { Content, Sider } = Layout;
const sidebarItems = [
  { name: "Connections", icon: LinkOutlined, link: "/" },
  { name: "Locations", icon: ForkOutlined, link: "/locations" },
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
            <Route path="" element={<Connections />} />
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
