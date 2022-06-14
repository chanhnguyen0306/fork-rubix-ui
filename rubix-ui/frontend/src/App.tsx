import { Routes, Route, Link } from "react-router-dom";
import React from "react";
import { Layout, Menu, notification } from "antd";
import type { MenuProps } from "antd";
import { ForkOutlined, WifiOutlined } from "@ant-design/icons";
// import { EventsOn } from "../wailsjs/runtime";
import { Locations } from "./routes/locations";
import { Networks } from "./routes/networks";
import { AddHostForm } from "./routes/host";
import "./App.css";

type NotificationType = "success" | "info" | "warning" | "error";

const { Content, Sider } = Layout;
// const sidebarItems = [
//   { name: "Locations", icon: ForkOutlined, link: "/locations" },
//   { name: "Networks", icon: WifiOutlined, link: "/networks" },
// ];

// const menuItems: MenuProps["items"] = sidebarItems.map(
//   ({ name, icon }, index) => {
//     const key = String(index + 1);
//     return {
//       key: `sub${key}`,
//       icon: React.createElement(icon),
//       label: name,
//     };
//   }
// );

// const openNotificationWithIcon = (type: NotificationType, data: any) => {
//   notification[type]({
//     message: "message",
//     description: data,
//   });
// };

const App: React.FC = () => {
  /////////using EventsOn will get error when reloading the Networks page
  // EventsOn("ok", (val) => {
  //   openNotificationWithIcon("success", val);
  // });

  // EventsOn("err", (val) => {
  //   openNotificationWithIcon("error", val);
  // });

  return (
    <Layout>
      <Sider width={200} style={{ height: "100vh" }}>
        <Menu
          mode="inline"
          theme="dark"
          // defaultSelectedKeys={["1"]}
          // defaultOpenKeys={["sub1"]}
          // items={menuItems}
        >
          <Menu.Item key={"/"}>
            <Link to="/">Locations</Link>
          </Menu.Item>
          <Menu.Item key={"networks"}>
            <Link to="networks">Networks</Link>
          </Menu.Item>
        </Menu>
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
