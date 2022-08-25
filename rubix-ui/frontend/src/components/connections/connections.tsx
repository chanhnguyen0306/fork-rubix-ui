import { ConnectionsTable } from "./views/table";
import { Card, Tabs, Typography } from "antd";
import { ApartmentOutlined, RedoOutlined } from "@ant-design/icons";
import { PcScanner } from "../pc/scanner/table";
import RbxBreadcrumb from "../breadcrumbs/breadcrumbs";

const { Title } = Typography;

import { ROUTES } from "../../constants/routes";

const ConnectionsTab = () => {
  return (
    <span>
      <ApartmentOutlined />
      SUPERVISORS
    </span>
  );
};

const DiscoverTab = () => {
  return (
    <span>
      <RedoOutlined />
      DISCOVER
    </span>
  );
};

export const Connections = () => {
  const { TabPane } = Tabs;

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Supervisors
      </Title>
      <Card bordered={false}>
        <RbxBreadcrumb
          routes={[{ path: ROUTES.CONNECTIONS, breadcrumbName: "Supervisors" }]}
        />
        <Tabs defaultActiveKey="1">
          <TabPane tab={ConnectionsTab()} key="Connections">
            <ConnectionsTable />
          </TabPane>
          <TabPane tab={DiscoverTab()} key="Discover">
            <PcScanner />
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
};
