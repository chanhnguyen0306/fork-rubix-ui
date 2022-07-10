import {Button, Popconfirm, Spin} from "antd";
import RbTable from "../../../common/rb-table";
import React, {useState} from "react";
import {main} from "../../../../wailsjs/go/models";
import {LogFactory} from "../factory";
import {DeleteOutlined} from "@ant-design/icons";

export const LogsTable = (props: any) => {
  const { logs, isFetching, fetch } = props;
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);
  let logFactory = new LogFactory();


  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const bulkDelete = async () => {
    await logFactory.BulkDelete(selectedUUIDs);
    fetch()

  };

  const columns = [
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "Timestamp",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Table",
      dataIndex: "function",
      key: "function",
    },
    {
      title: "Action Type",
      dataIndex: "type",
      key: "type",
    },
  ];

  return (
      <>
        <Popconfirm title="Delete" onConfirm={bulkDelete}>
          <Button type="primary" danger style={{ margin: "5px", float: "right" }}>
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
