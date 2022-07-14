import React from "react";
import {Route, Routes} from "react-router-dom";

import {Logs} from "./components/logs/logs";
import {Hosts} from "./components/hosts/hosts";
import {Host} from "./components/hosts/host/host";
import {Backups} from "./components/backups/backups";
import {DocsRubixHardware} from "./components/docs/docs";
import {DocsSoftware} from "./components/docs/software";
import {DipSwitch} from "./components/switch/switch";
import {Locations} from "./components/locations/locations";
import {Networks} from "./components/hostNetworks/networks";
import {Connections} from "./components/connections/connections";
import {PcNetworking} from "./components/pc/networking/networking";
import {FlowPoints} from "./components/hosts/host/flow/points/flowPoints";
import {FlowDevices} from "./components/hosts/host/flow/devices/flowDevices";

interface ROUTE {
    [name: string]: string;
}

export const routes: ROUTE = {
    ROOT: "/",
    LOGS: "/logs",
    BACKUPS: "/backups",
    DOCS: "/docs",
    DOCS_SOFTWARE: "/software",
    DOCS_DIPS: "/switch",
    HOSTS: "/hosts/:netUUID",
    NETWORKING: "/networking",
    NETWORKS: "/networks/:locUUID",
    LOCATION: "/locations/:connUUID",
    FLOW_NETWORKS: "/host/:hostUUID",
    FLOW_DEVICES: "/flow/networks/:networkUUID",
    FLOW_POINTS: "/flow/devices/:deviceUUID",
};

function AppRoutes() {
    return (
        <Routes>
            <Route path={routes.ROOT} element={<Connections/>}/>
            <Route path={routes.LOCATION} element={<Locations/>}/>
            <Route path={routes.NETWORKS} element={<Networks/>}/>
            <Route path={routes.HOSTS} element={<Hosts/>}/>
            <Route path={routes.FLOW_NETWORKS} element={<Host/>}/>
            <Route path={routes.FLOW_DEVICES} element={<FlowDevices/>}/>
            <Route path={routes.FLOW_POINTS} element={<FlowPoints/>}/>
            <Route path={routes.LOGS} element={<Logs/>}/>
            <Route path={routes.BACKUPS} element={<Backups/>}/>
            <Route path={routes.DOCS} element={<DocsRubixHardware/>}/>
            <Route path={routes.DOCS_SOFTWARE} element={<DocsSoftware/>}/>
            <Route path={routes.DOCS_DIPS} element={<DipSwitch/>}/>
            <Route path={routes.NETWORKING} element={<PcNetworking/>}/>
        </Routes>
    );
}

export default AppRoutes;
