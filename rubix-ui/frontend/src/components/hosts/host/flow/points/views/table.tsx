import {Button, Popconfirm, Spin, Table} from "antd";
import {useState} from "react";
import {FlowPointFactory} from "../factory";
import {FlowDeviceFactory} from "../../devices/factory";
import {DeleteOutlined} from "@ant-design/icons";
import {main} from "../../../../../../../wailsjs/go/models";

export const FlowPointsTable = (props: any) => {
  const {data, isFetching, connUUID, hostUUID, deviceUUID} = props;
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);
  let flowDeviceFactory = new FlowDeviceFactory();

  const bulkDelete = async () => {
    flowDeviceFactory.connectionUUID = connUUID;
    flowDeviceFactory.hostUUID = hostUUID;
    flowDeviceFactory.BulkDelete(selectedUUIDs);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows)
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
        <Popconfirm
            title="Delete"
            onConfirm={bulkDelete}
        >
          <Button
              type="primary"
              danger
              style={{margin: "5px", float: "right"}}
          >
            <DeleteOutlined/> Delete
          </Button>
        </Popconfirm>
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
