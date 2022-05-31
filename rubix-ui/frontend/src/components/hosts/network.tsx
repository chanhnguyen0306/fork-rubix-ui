import { Button, Form, Space, Table } from "antd";
import { model } from "../../../wailsjs/go/models";
import Input from "antd/es/input/Input";
import {
  AddHostNetwork,
  GetHostNetworks,
  EditHostNetwork,
  DeleteHostNetwork,
} from "../../../wailsjs/go/main/App";
import { useContext, useEffect, useState } from "react";

export namespace network {
  const AddNetworkForm = (props: any) => {
    const { networks, updateNetworks } = props;

    const addNetwork = async (network: model.Network) => {
      await AddHostNetwork(network).then((res) => {
        networks[networks.length] = res;
        updateNetworks(networks);
      });
    };

    return (
      <div
        style={{
          display: "block",
          width: 700,
          padding: 30,
        }}
      >
        <h4>Networks</h4>
        <Form
          name="name"
          onFinishFailed={() => alert("Failed to submit")}
          onFinish={(e: model.Network) => {
            addNetwork(e);
          }}
          initialValues={{ remember: true }}
        >
          <Form.Item label="Enter username" name="name">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Username
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const NetworksTable = (props: any) => {
    const { networks, updateNetworks } = props;
    if (!networks) return;
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Hosts number",
        dataIndex: "hosts",
        key: "hosts",
        render: (hosts: []) => <a>{hosts ? hosts.length : 0}</a>,
      },
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: (_: any, network: model.Network) => (
          <Space size="middle">
            <a
              onClick={() => {
                editNetwork(network);
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
      await DeleteHostNetwork(networkUUID).then((res) => {
        const newNetworks = networks.filter(
          (n: model.Network) => n.uuid !== networkUUID
        );
        updateNetworks(newNetworks);
      });
    };

    const editNetwork = async (network: model.Network) => {
      await EditHostNetwork(network.uuid, network).then((res) => {
        const index = networks.findIndex(
          (n: model.Network) => n.uuid === network.uuid
        );
        networks[index] = res;
        updateNetworks(networks);
      });
    };

    return (
      <>
        networks : {networks.length}
        <Table rowKey="uuid" dataSource={networks} columns={columns} />
      </>
    );
  };

  export function NetwokrsComponent() {
    const [networks, setNetworks] = useState([] as model.Network[]);
    useEffect(() => {
      fetchNetworks();
    }, [networks]);

    const updateNetworks = (networks: model.Network[]) => {
      setNetworks(networks);
    };

    const fetchNetworks = async () => {
      await GetHostNetworks().then((res) => {
        setNetworks(res);
      });
    };

    return (
      <>
        <AddNetworkForm networks={networks} updateNetworks={updateNetworks} />
        <NetworksTable networks={networks} updateNetworks={updateNetworks} />
      </>
    );
  }
}
