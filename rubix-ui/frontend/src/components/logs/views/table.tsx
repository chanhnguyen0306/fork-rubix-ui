import { useState } from "react";
import { Button, Popconfirm, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { LogFactory } from "../factory";
import { main } from "../../../../wailsjs/go/models";
import { LOG_HEADERS } from "../../../constants/headers";
import RbTable from "../../../common/rb-table";

export const LogsTable = (props: any) => {
  const { logs, isFetching, fetch } = props;
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);
  let logFactory = new LogFactory();

  const columns = LOG_HEADERS;

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const bulkDelete = async () => {
    await logFactory.BulkDelete(selectedUUIDs);
    fetch();
  };

  return (
    <>
      <Popconfirm title="Delete" onConfirm={bulkDelete}>
        <Button
          type="primary"
          danger
          style={{ margin: "0 6px 10px 0", float: "left" }}
        >
          <DeleteOutlined /> Delete
        </Button>
      </Popconfirm>
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={logs}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
