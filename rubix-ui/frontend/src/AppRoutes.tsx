import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ROUTES as routes } from "./constants/routes";
import { Logs } from "./components/logs/logs";
import { Hosts } from "./components/hosts/hosts";
import { Host } from "./components/hosts/host/host";
import AppStore from "./components/release/appStore";
import { Backups } from "./components/backups/backups";
import { Locations } from "./components/locations/locations";
import { Networks } from "./components/hostNetworks/networks";
import { Connections } from "./components/connections/connections";
import { PcNetworking } from "./components/pc/networking/networking";
import { FlowPoints } from "./components/hosts/host/flow/points/flow-points";
import { FlowDevices } from "./components/hosts/host/flow/devices/flow-devices";
import { Streams } from "./components/hosts/host/flow/flowNetworks/streams/streams";
import { Producers } from "./components/hosts/host/flow/flowNetworks/producers/producers";
import ConnectionPage from "./components/connections/connection-page";
import { StreamClones } from "./components/hosts/host/flow/flowNetworks/streamClones/streamClones";
import { Consumers } from "./components/hosts/host/flow/flowNetworks/consumers/consumers";
import { Writers } from "./components/hosts/host/flow/flowNetworks/writers/writers";
import { WriterClones } from "./components/hosts/host/flow/flowNetworks/writerClones/writer-clones";

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
          key={routes.PRODUCERS}
          path={routes.PRODUCERS}
          element={<Producers />}
        />
        <Route
          key={routes.STREAMCLONES}
          path={routes.STREAMCLONES}
          element={<StreamClones />}
        />
        <Route
          key={routes.CONSUMERS}
          path={routes.CONSUMERS}
          element={<Consumers />}
        />
        <Route
          key={routes.WRITERS}
          path={routes.WRITERS}
          element={<Writers />}
        />
        <Route
          key={routes.WRITERCLONES}
          path={routes.WRITERCLONES}
          element={<WriterClones />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
