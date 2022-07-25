import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, Tabs } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { model } from "../../../../../../wailsjs/go/models";
import { openNotificationWithIcon } from "../../../../../utils/utils";
import { BacnetFactory } from "../bacnet/factory";
import { FlowDeviceFactory } from "./factory";
import { FlowDeviceTable } from "./views/table";
import { BacnetWhoIsTable } from "../bacnet/bacnetTable";
import { RbRefreshButton } from "../../../../../common/rb-table-actions";

import Devices = model.Device;

export const FlowDevices = () => {
  const [data, setDevices] = useState([] as Devices[]);
  const [isFetching, setIsFetching] = useState(true);
  const [whoIs, setWhois] = useState([] as model.Device[]);
  let flowDeviceFactory = new FlowDeviceFactory();
  const location = useLocation() as any;
  const connUUID = location.state.connUUID ?? "";
  const hostUUID = location.state.hostUUID ?? "";
  const networkUUID = location.state.networkUUID ?? "";
  const pluginName = location.state.pluginName ?? "";

  const { TabPane } = Tabs;
  const onChange = (key: string) => {
    console.log(key);
  };

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      flowDeviceFactory.connectionUUID = connUUID;
      flowDeviceFactory.hostUUID = hostUUID;
      let res = await flowDeviceFactory.GetNetworkDevices(networkUUID);
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
      openNotificationWithIcon("info", `run bacnet discovery....`);
      bacnetFactory.connectionUUID = connUUID;
      bacnetFactory.hostUUID = hostUUID;
      let res = await bacnetFactory.Whois(networkUUID, pluginName);
      openNotificationWithIcon("success", `device count found: ${res.length}`);
      setWhois(res);
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", `discovery error: ${error}`);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Tabs defaultActiveKey="1" onChange={onChange}>
      <TabPane tab="DEVICES" key="1">
        <RbRefreshButton refreshList={fetch} />
        <FlowDeviceTable
          data={data}
          isFetching={isFetching}
          connUUID={connUUID}
          hostUUID={hostUUID}
          networkUUID={networkUUID}
          setIsFetching={setIsFetching}
          refreshList={fetch}
          pluginName={pluginName}
        />
      </TabPane>
      <TabPane tab="BACNET" key="3">
        <Button
          type="primary"
          onClick={runWhois}
          style={{ margin: "5px", float: "right" }}
        >
          <RedoOutlined /> WHO-IS
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
