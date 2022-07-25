import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm, Space, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { NetworksFactory } from "../factory";
import { assistmodel, main } from "../../../../wailsjs/go/models";
import { DeleteHostNetwork } from "../../../../wailsjs/go/main/App";
import RbTable from "../../../common/rb-table";

export const NetworksTable = (props: any) => {
  const { networks, locations, refreshList, showModal, isFetching, connUUID } =
    props;
  if (!networks) return <></>;

  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);

  const navigate = useNavigate();
  let factory = new NetworksFactory();
  factory.connectionUUID = connUUID;

  const columns = [
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
      title: "Hosts number",
      dataIndex: "hosts",
      key: "hosts",
      render: (hosts: []) => <a>{hosts ? hosts.length : 0}</a>,
    },
    {
      title: "Location",
      dataIndex: "location_uuid",
      key: "location_uuid",
      render: (location_uuid: string) => (
        <span>{getLocationNameByUUID(location_uuid)}</span>
      ),
    },
    {
      title: "UUID",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, network: assistmodel.Network) => (
        <Space size="middle">
          <a
            onClick={() =>
              navigate(`/hosts/${network.uuid}`, {
                state: { connUUID: connUUID },
              })
            }
          >
            View
          </a>
          <a
            onClick={() => {
              showModal(network);
            }}
          >
            Edit
          </a>
          <a
            onClick={() => {
              deleteNetwork(network.uuid);
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  const deleteNetwork = async (networkUUID: string) => {
    await DeleteHostNetwork(connUUID, networkUUID);
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

  const getLocationNameByUUID = (location_uuid: string) => {
    const location = locations.find(
      (l: assistmodel.Location) => l.uuid === location_uuid
    );
    return location ? location.name : "";
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
        dataSource={networks}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </div>
  );
};
