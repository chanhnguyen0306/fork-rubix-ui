import {model} from "../../../../../../wailsjs/go/models";
import React, {useEffect, useState} from "react";
import {FlowDeviceFactory} from "./factory";
import {FlowDeviceTable} from "./views/table";
import {Button, Tabs} from "antd";
import {RedoOutlined} from "@ant-design/icons";
import {useLocation} from "react-router-dom";
import Devices = model.Device;
import {FlowNetworkTable} from "../networks/views/table";
import {HostTable} from "../../views/hostTable";
import {BacnetWhoIsTable} from "../bacnet/bacnetTable";
import {BacnetFactory} from "../bacnet/factory";

export const FlowDevices = () => {
    const [data, setDevices] = useState([] as Devices[]);
    const [isFetching, setIsFetching] = useState(true);
    const [whoIs, setWhois] = useState([] as model.Device[]);
    let flowDeviceFactory = new FlowDeviceFactory();
    const location = useLocation() as any;
    const connUUID = location.state.connUUID ?? "";
    const hostUUID = location.state.hostUUID ?? "";
    const networkUUID = location.state.networkUUID ?? "";

    const { TabPane } = Tabs;
    const onChange = (key: string) => {
        console.log(key);
    };

    useEffect(() => {
        fetch();
    }, []);

    const fetch = async () => {
        try {
            flowDeviceFactory.connectionUUID = connUUID
            flowDeviceFactory.uuid = hostUUID
            let res = await flowDeviceFactory.GetNetworkDevices(networkUUID);
            console.log("fetch", res, connUUID, hostUUID)
            setDevices(res);
        } catch (error) {
            console.log(error);
        } finally {
            setIsFetching(false);
        }
    };

    let bacnetFactory = new BacnetFactory();
    const runWhois = async () => {
        try {
            bacnetFactory.connectionUUID = connUUID
            bacnetFactory.uuid = hostUUID
            // bacnetFactory.bacnetNetworkUUID
            let res = await bacnetFactory.Whois();
            console.log("runWhois", res, connUUID, hostUUID)
            setWhois(res);
        } catch (error) {
            console.log(error);
        } finally {
            setIsFetching(false);
        }
    };


    return (

        <Tabs defaultActiveKey="1" onChange={onChange}>

            <TabPane tab="NETWORKS" key="1">
                <Button
                    type="primary"
                    onClick={fetch}
                    style={{margin: "5px", float: "right"}}
                >
                    <RedoOutlined/> Refresh
                </Button>
                <FlowDeviceTable
                    data={data}
                    isFetching={isFetching}
                    setIsFetching={setIsFetching}
                    connUUID={connUUID}
                    hostUUID={hostUUID}
                    networkUUID={networkUUID}
                />
            </TabPane>
            <TabPane tab="BACNET" key="3">
                <Button
                    type="primary"
                    onClick={runWhois}
                    style={{margin: "5px", float: "right"}}
                >
                    <RedoOutlined/> WHO-IS
                </Button>
                <BacnetWhoIsTable
                    data={whoIs}
                    isFetching={isFetching}
                    setIsFetching={setIsFetching}
                />
            </TabPane>
        </Tabs>


    );
};
