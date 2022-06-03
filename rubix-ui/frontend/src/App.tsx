import {
  Routes,
  Route,
} from "react-router-dom";
import './App.css';

import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { IssuesCloseOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Locations } from "./routes/locations";
import { Networks } from "./routes/networks";
import { AddHostForm } from "./routes/host";

const { Header, Content, Sider } = Layout;

const sidebarItems = [
  { name: 'Location', icon: IssuesCloseOutlined }
]

const items2: MenuProps['items'] = sidebarItems.map(
  ({name, icon}, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: name,
    };
  },
);

const App: React.FC = () => (
  <Layout>
    <Header className="header">
      <div className="logo" />
    </Header>
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
          items={items2}
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
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

export default App;