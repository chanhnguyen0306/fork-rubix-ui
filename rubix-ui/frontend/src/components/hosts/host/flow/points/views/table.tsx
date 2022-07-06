import {Button, Spin, Table} from "antd";
import {useState} from "react";
import {FlowPointFactory} from "../factory";
import {FlowDeviceFactory} from "../../devices/factory";
import {DeleteOutlined} from "@ant-design/icons";

export const FlowPointsTable = (props: any) => {
  const {data, isFetching, connUUID, hostUUID, deviceUUID} = props;
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as string[]);
  let flowDeviceFactory = new FlowDeviceFactory();

  const bulkDelete = async () => {
    flowDeviceFactory.connectionUUID = connUUID;
    flowDeviceFactory.hostUUID = hostUUID;
    flowDeviceFactory.BulkDelete(selectedUUIDs);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRowKeys)
    },
  };

  const columns = [
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "device",
      dataIndex: "device_uuid",
      key: "device_uuid",
    }
  ];

  return (
      <>
        <Button
            type="primary"
            danger
            onClick={bulkDelete}
            style={{ margin: "5px", float: "right" }}
        >
          <DeleteOutlined /> Delete
        </Button>
      <Table
          rowKey="uuid"
          rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          loading={{ indicator: <Spin />, spinning: isFetching }}
      />
      </>
  );
};
