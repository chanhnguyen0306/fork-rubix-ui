import React from "react";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";

import { Logs } from "./components/logs/logs";
import { Hosts } from "./components/hosts/hosts";
import { Host } from "./components/hosts/host/host";
import { Backups } from "./components/backups/backups";
import { DocsRubixHardware } from "./components/docs/docs";
import { DocsSoftware } from "./components/docs/software";
import { DipSwitch } from "./components/switch/switch";
import { Locations } from "./components/locations/locations";
import { Networks } from "./components/hostNetworks/networks";
import { Connections } from "./components/connections/connections";
import { PcNetworking } from "./components/pc/networking/networking";
import { FlowPoints } from "./components/hosts/host/flow/points/flowPoints";
import { FlowDevices } from "./components/hosts/host/flow/devices/flowDevices";

import { ROUTES as routes } from "./constants/routes";
import SearchableTree from "./components/searchable-tree/searchable-tree";
import { Col, Row, Typography } from "antd";


function ConnectionPage() {
  const location = useLocation();
  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={4}>
          <SearchableTree />
        </Col>
        <Col span={20}>
          <Outlet />
        </Col>
      </Row>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path={routes.ROOT}
        element={<Navigate replace to={routes.CONNECTIONS} />}
      />
      {/* <Route path={routes.ROOT} element={<Connections />} /> */}
      {/* <Route path={routes.LOCATION} element={<Locations />} /> */}
      {/* <Route path={routes.NETWORKS} element={<Networks />} /> */}
      {/* <Route path={routes.HOSTS} element={<Hosts />} /> */}
      {/* <Route path={routes.FLOW_NETWORKS} element={<Host />} /> */}
      <Route path={routes.FLOW_DEVICES} element={<FlowDevices />} />
      <Route path={routes.FLOW_POINTS} element={<FlowPoints />} />
      <Route path={routes.LOGS} element={<Logs />} />
      <Route path={routes.BACKUPS} element={<Backups />} />
      <Route path={routes.DOCS} element={<DocsRubixHardware />} />
      <Route path={routes.DOCS_SOFTWARE} element={<DocsSoftware />} />
      <Route path={routes.DOCS_DIPS} element={<DipSwitch />} />
      <Route path={routes.NETWORKING} element={<PcNetworking />} />
      <Route path={routes.CONNECTIONS} element={<ConnectionPage />}>
        <Route path={routes.CONNECTIONS} element={<Connections />} />
        <Route path={routes.LOCATIONS} element={<Locations />} />
        <Route path={routes.LOCATION_NETWORKS} element={<Networks />} />
        <Route path={routes.LOCATION_NETWORK_HOSTS} element={<Hosts />} />
        <Route path={routes.HOST} element={<Host />} />
        <Route path={routes.DEVICES} element={<FlowDevices />} />
        <Route path={routes.POINTS} element={<FlowPoints />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
