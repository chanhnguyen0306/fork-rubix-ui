import { Spin } from "antd";
import RbTable from "../../../common/rb-table";
import { useState } from "react";
import { main } from "../../../../wailsjs/go/models";
import { BackupFactory } from "../factory";
import { RbDeleteButton } from "../../../common/rb-table-actions";
export const BackupsTable = (props: any) => {
  const { data, isFetching, fetch } = props;
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);
  let backupFactory = new BackupFactory();

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const bulkDelete = async () => {
    await backupFactory.BulkDelete(selectedUUIDs);
    fetch();
  };

  const columns = [
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "connection name",
      dataIndex: "connection_name",
      key: "connection_name",
    },
    {
      title: "connection uuid",
      dataIndex: "connection_uuid",
      key: "connection_uuid",
    },
    {
      title: "host name",
      dataIndex: "host_name",
      key: "host_name",
    },
    {
      title: "host uuid",
      dataIndex: "host_uuid",
      key: "host_uuid",
    },
    {
      title: "timestamp",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "application",
      dataIndex: "application",
      key: "application",
    },
    {
      title: "info",
      dataIndex: "backup_info",
      key: "backup_info",
    },
    {
      title: "Comments",
      dataIndex: "user_comment",
      key: "user_comment",
    },
  ];

  return (
    <>
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbTable
        rowKey="uuid"
        dataSource={data}
        columns={columns}
        rowSelection={rowSelection}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
