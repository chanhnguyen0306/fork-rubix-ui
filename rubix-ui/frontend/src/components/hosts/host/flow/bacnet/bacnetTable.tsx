import { Button, Spin } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { BacnetFactory } from "./factory";
import { FlowDeviceFactory } from "../devices/factory";
import { model } from "../../../../../../wailsjs/go/models";
import { BACNET_HEADERS } from "../../../../../constants/headers";
import RbTable from "../../../../../common/rb-table";
import { RbAddButton } from "../../../../../common/rb-table-actions";
import { openNotificationWithIcon } from "../../../../../utils/utils";

export const BacnetWhoIsTable = (props: any) => {
  const { refreshDeviceList } = props;
  const {
    connUUID = "",
    hostUUID = "",
    networkUUID = "",
    pluginName = "",
  } = useParams();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<model.Device>);
  const [whoIs, setWhoIs] = useState([] as model.Device[]);
  const [isFetching, setIsFetching] = useState(false);

  const bacnetFactory = new BacnetFactory();
  const flowDeviceFactory = new FlowDeviceFactory();
  flowDeviceFactory.connectionUUID = bacnetFactory.connectionUUID = connUUID;
  flowDeviceFactory.hostUUID = bacnetFactory.hostUUID = hostUUID;

  const columns = BACNET_HEADERS;

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const addDevices = async () => {
    const payload = {
      name: selectedUUIDs[0].name,
      enable: true,
    } as model.Device;
    await flowDeviceFactory.Add(networkUUID, payload);
    openNotificationWithIcon(
      "success",
      `add device: ${selectedUUIDs[0].name} success`
    );
    refreshDeviceList();
  };

  const runWhois = async () => {
    try {
      setIsFetching(true);
      const res = await bacnetFactory.Whois(networkUUID, pluginName);
      openNotificationWithIcon("success", `device count found: ${res.length}`);
      setWhoIs(res);
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", `discovery error: ${error}`);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={runWhois}
        style={{ margin: "5px", float: "right" }}
      >
        <RedoOutlined /> WHO-IS
      </Button>
      <RbAddButton showModal={addDevices} />
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={whoIs}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
