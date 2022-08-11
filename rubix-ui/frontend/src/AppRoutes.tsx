import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { Logs } from "./components/logs/logs";
import { Hosts } from "./components/hosts/hosts";
import { Host } from "./components/hosts/host/host";
import AppStore from "./components/release/appStore";
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
import { Streams } from "./components/hosts/host/flow/flowNetworks/streams/streams";
import { Consumers } from "./components/hosts/host/flow/flowNetworks/consumers/consumers";
import ConnectionPage from "./components/connections/connection-page";
import { ROUTES as routes } from "./constants/routes";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path={routes.ROOT}
        element={<Navigate replace to={routes.CONNECTIONS} />}
      />
      <Route path={routes.APP_STORE} element={<AppStore />} />
      <Route path={routes.FLOW_DEVICES} element={<FlowDevices />} />
      <Route path={routes.FLOW_POINTS} element={<FlowPoints />} />
      <Route path={routes.LOGS} element={<Logs />} />
      <Route path={routes.BACKUPS} element={<Backups />} />
      <Route path={routes.DOCS} element={<DocsRubixHardware />} />
      <Route path={routes.DOCS_SOFTWARE} element={<DocsSoftware />} />
      <Route path={routes.DOCS_DIPS} element={<DipSwitch />} />
      <Route path={routes.NETWORKING} element={<PcNetworking />} />
      <Route path={routes.CONNECTIONS} element={<ConnectionPage />}>
        <Route
          key={routes.CONNECTIONS}
          path={routes.CONNECTIONS}
          element={<Connections />}
        />
        <Route
          key={routes.LOCATIONS}
          path={routes.LOCATIONS}
          element={<Locations />}
        />
        <Route
          key={routes.LOCATION_NETWORKS}
          path={routes.LOCATION_NETWORKS}
          element={<Networks />}
        />
        <Route
          key={routes.LOCATION_NETWORK_HOSTS}
          path={routes.LOCATION_NETWORK_HOSTS}
          element={<Hosts />}
        />
        <Route key={routes.HOST} path={routes.HOST} element={<Host />} />
        <Route
          key={routes.DEVICES}
          path={routes.DEVICES}
          element={<FlowDevices />}
        />
        <Route
          key={routes.POINTS}
          path={routes.POINTS}
          element={<FlowPoints />}
        />
        <Route
          key={routes.STREAMS}
          path={routes.STREAMS}
          element={<Streams />}
        />
        <Route
          key={routes.CONSUMERS}
          path={routes.CONSUMERS}
          element={<Consumers />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
