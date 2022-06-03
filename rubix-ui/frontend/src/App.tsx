import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

import React from "react";
import { Layout, Menu, Breadcrumb, notification } from "antd";
import { ForkOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Locations } from "./routes/locations";
import { Networks } from "./routes/networks";
import { AddHostForm } from "./routes/host";
import { EventsOn } from "../wailsjs/runtime";

type NotificationType = "success" | "info" | "warning" | "error";

const { Header, Content, Sider } = Layout;
const sidebarItems = [
  { name: "Locations", icon: ForkOutlined, link: "/locations" },
];

const menuItems: MenuProps["items"] = sidebarItems.map(
  ({ name, icon }, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: name,
    };
  }
);

const openNotificationWithIcon = (type: NotificationType, data: any) => {
  notification[type]({
    message: "message",
    description: data,
  });
};

EventsOn("ok", (val) => {
  openNotificationWithIcon("success", val);
});

const App: React.FC = () => {
  return (
    <Layout>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Routes>
              <Route path="/" element={<Locations />} />
              <Route path="locations" element={<Locations />} />
              <Route path="networks" element={<Networks />} />
              <Route path="host" element={<AddHostForm />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
