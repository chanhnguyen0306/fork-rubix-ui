import { Space, Spin } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { main, assistmodel } from "../../../../wailsjs/go/models";
import RbTable from "../../../common/rb-table";
import { RbDeleteButton } from "../../../common/rb-table-actions";
import { HOST_NETWORK_HEADERS } from "../../../constants/headers";
import { ROUTES } from "../../../constants/routes";
import { NetworksFactory } from "../factory";

export const NetworksTable = (props: any) => {
  const {
    networks,
    locations,
    refreshList,
    showModal,
    isFetching,
    connUUID,
    locUUID,
  } = props;
  if (!networks) return <></>;

  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<main.UUIDs>);

  let factory = new NetworksFactory();
  factory.connectionUUID = connUUID;

  const columns = [
    ...HOST_NETWORK_HEADERS,
    {
      title: "Location",
      dataIndex: "location_uuid",
      key: "location_uuid",
      render: (location_uuid: string) => (
        <span>{getLocationNameByUUID(location_uuid)}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, network: assistmodel.Network) => (
        <Space size="middle">
          <Link
            to={ROUTES.LOCATION_NETWORK_HOSTS.replace(":connUUID", connUUID)
              .replace(":locUUID", locUUID)
              .replace(":netUUID", network.uuid)}
          >
            View
          </Link>
          <a
            onClick={() => {
              showModal(network);
            }}
          >
            Edit
          </a>
        </Space>
      ),
    },
  ];

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
      <RbDeleteButton bulkDelete={bulkDelete} />

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
