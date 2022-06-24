import { model } from "../../../../wailsjs/go/models";
import { Modal, Space, Spin, Table } from "antd";
import { DeleteHost } from "../../../../wailsjs/go/main/App";
import Iframe from "../../iframe/iframe";

const info = (host: model.Host) => {
  const { ip, port } = host;
  const source = `https://${ip}.${port}/`;

  Modal.info({
    title: "Iframe",
    content: <Iframe source={source} />,
    width: 1000,
    onOk() {},
  });
};

export const HostsTable = (props: any) => {
  const { hosts, networks, showModal, isFetching, connUUID, refreshList } =
    props;

  if (!hosts) return <></>;
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
      title: "Network",
      dataIndex: "network_uuid",
      key: "network_uuid",
      render: (network_uuid: string) => (
        <span>{getNetworkNameByUUID(network_uuid)}</span>
      ),
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
      render: (_: any, host: model.Host) => (
        <Space size="middle">
          <a
            onClick={() => {
              showModal(host);
            }}
          >
            Edit
          </a>
          <a
            onClick={() => {
              deleteHost(host.uuid);
            }}
          >
            Delete
          </a>
          <a
            onClick={() => {
              info(host);
            }}
          >
            Rubix-Wires
          </a>
        </Space>
      ),
    },
  ];

  const deleteHost = async (uuid: string) => {
    await DeleteHost(connUUID, uuid);
    refreshList();
  };

  const getNetworkNameByUUID = (uuid: string) => {
    const network = networks.find((l: model.Location) => l.uuid === uuid);
    return network ? network.name : "";
  };

  return (
    <>
      <Table
        rowKey="uuid"
        dataSource={hosts}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
