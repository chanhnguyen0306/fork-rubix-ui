import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Space, Spin } from "antd";
import {
  DeleteConnection,
  PingRubixAssist,
} from "../../../../wailsjs/go/main/App";
import { ConnectionFactory } from "../factory";
import { main, storage } from "../../../../wailsjs/go/models";
import { openNotificationWithIcon } from "../../../utils/utils";
import { ROUTES } from "../../../constants/routes";
import { CONNECTION_HEADERS } from "../../../constants/headers";
import RbTable from "../../../common/rb-table";
import { RbDeleteButton } from "../../../common/rb-table-actions";

import RubixConnection = storage.RubixConnection;

export const ConnectionsTable = (props: any) => {
  const { connections, refreshList, showModal, isFetching } = props;
  if (!connections) return <></>;

  const navigate = useNavigate();
  let factory = new ConnectionFactory();

  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);

  const columns = [
    ...CONNECTION_HEADERS,
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, conn: RubixConnection) => (
        <Space size="middle">
          <Link to={ROUTES.LOCATIONS.replace(":connUUID", conn.uuid)}>
            View
          </Link>
          <a // edit
            onClick={() => {
              showModal(conn);
            }}
          >
            Edit
          </a>
          <a // delete
            onClick={() => {
              deleteConnection(conn.uuid);
            }}
          >
            Delete
          </a>
          <a //ping
            onClick={() => {
              pingConnection(conn.uuid);
            }}
          >
            Ping
          </a>
        </Space>
      ),
    },
  ];

  const deleteConnection = async (uuid: string) => {
    await DeleteConnection(uuid);
    refreshList();
  };

  const bulkDelete = async () => {
    await factory.BulkDelete(selectedUUIDs);
    refreshList();
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  const pingConnection = async (uuid: string) => {
    await PingRubixAssist(uuid).then((ok) => {
      console.log("ping ok", ok, uuid);
      if (ok) {
        openNotificationWithIcon("success", `ping success`);
      } else {
        openNotificationWithIcon("error", `ping fail`);
      }
    });

    refreshList();
  };

  return (
    <div>
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbTable
        rowKey="uuid"
        dataSource={connections}
        rowSelection={rowSelection}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </div>
  );
};
