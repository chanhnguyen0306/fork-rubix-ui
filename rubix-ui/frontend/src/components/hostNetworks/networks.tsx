import { Typography, Card } from "antd";
import { useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import RbxBreadcrumb from "../breadcrumbs/breadcrumbs";
import { NetworksTable } from "./views/table";

const { Title } = Typography;

export const Networks = () => {
  const { connUUID = "", locUUID = "" } = useParams();

  const routes = [
    {
      path: ROUTES.CONNECTIONS,
      breadcrumbName: "Connections",
    },
    {
      path: ROUTES.LOCATIONS.replace(":connUUID", connUUID || ""),
      breadcrumbName: "Location",
    },
    {
      path: ROUTES.LOCATION_NETWORKS.replace(
        ":connUUID",
        connUUID || ""
      ).replace(":locUUID", locUUID || ""),
      breadcrumbName: "Location Network",
    },
  ];

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Networks
      </Title>
      <Card bordered={false}>
        <RbxBreadcrumb routes={routes} />
        <NetworksTable />
      </Card>
    </>
  );
};
