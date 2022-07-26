import { Link, useNavigate } from "react-router-dom";
import { Space, Spin } from "antd";
import {
  DeleteConnection,
  PingRubixAssist,
} from "../../../../wailsjs/go/main/App";
import { storage } from "../../../../wailsjs/go/models";
import { openNotificationWithIcon } from "../../../utils/utils";
import RubixConnection = storage.RubixConnection;
import RbTable from "../../../common/rb-table";
import { ROUTES } from "../../../constants/routes";

export const ConnectionsTable = (props: any) => {
  const { connections, refreshList, showModal, isFetching } = props;
  if (!connections) return <></>;

  const columns = [
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Address",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Port",
      dataIndex: "port",
      key: "port",
    },
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
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

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.log(selected, selectedRows, changeRows);
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
