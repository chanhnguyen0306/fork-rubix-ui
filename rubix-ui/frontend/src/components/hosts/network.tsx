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
  async function addNetwork(host: model.Network): Promise<model.Network> {
    let addedHost: model.Network = {} as model.Network;
    await AddHostNetwork(host).then((res) => {
      addedHost = res;
    });
    return addedHost;
  }

  async function fetchNetworks(): Promise<model.Network[]> {
    let networks: model.Network[] = [];
    await GetHostNetworks().then((res) => {
      networks = res;
    });
    return networks;
  }

  async function editNetwork(network: model.Network): Promise<model.Network> {
    let updatedNetwork: model.Network = {} as model.Network;
    await EditHostNetwork(network.uuid, network).then((res) => {
      updatedNetwork = res;
      console.log("updatedNetwork", updatedNetwork);
    });
    return updatedNetwork;
  }

  async function deleteNetwork(networkUUID: string) {
    await DeleteHostNetwork(networkUUID).then((res) => {
      console.log("deleteNetwork", res);
    });
  }

  function AddNetworkForm() {
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
            addNetwork(e).then((r) => {
              console.log("added a host", r);
            });
          }}
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Enter username"
            name="name"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input onChange={(e) => {}} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Username
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  function NetworksTable() {
    const [networks, setNetworks] = useState([] as model.Network[]);
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
        render: (hosts: []) => <a>{hosts.length}</a>,
      },
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: (_, network: model.Network) => (
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
    fetchNetworks().then((res) => {
      setNetworks(res);
    });
    return (
      <>
        <Table dataSource={networks} columns={columns} />
        networks : {networks.length}
      </>
    );
  }

  export function NetwokrsComponent() {
    return (
      <>
        <AddNetworkForm />
        <NetworksTable />
      </>
    );
  }
}
