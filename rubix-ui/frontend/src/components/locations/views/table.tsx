import { Button, Popconfirm, Space, Spin } from "antd";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { main } from "../../../../wailsjs/go/models";
import { LocationFactory } from "../factory";
import RbTable from "../../../common/rb-table";

export const LocationsTable = (props: any) => {
  let { locations, isFetching, tableSchema, connUUID, refreshList } = props;
  if (!locations) return <></>;

  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);

  let factory = new LocationFactory();
  factory.connectionUUID = connUUID as string;

  const bulkDelete = async () => {
    await factory.BulkDelete(selectedUUIDs);
    refreshList();
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  return (
    <div>
      <Popconfirm title="Delete" onConfirm={bulkDelete}>
        <Button type="primary" danger style={{ margin: "5px", float: "right" }}>
          <DeleteOutlined /> Delete
        </Button>
      </Popconfirm>
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={locations}
        columns={tableSchema}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </div>
  );
};
