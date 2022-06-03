import { Button, Form, Modal, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { model } from "../../wailsjs/go/models";
import Input from "antd/es/input/Input";
import {
  AddHostNetwork,
  GetHostNetworks,
  EditHostNetwork,
  DeleteHostNetwork,
} from "../../wailsjs/go/main/App";

const AddNetworkButton = (props: any) => {
  const { showModal } = props;

  return (
    <Button
      type="primary"
      onClick={() => showModal({} as model.Network)}
      style={{ margin: "5px", float: "right" }}
    >
      <PlusOutlined /> Network
    </Button>
  );
};

const CreateEditNetworkModal = (props: any) => {
  const {
    networks,
    currentNetwork,
    isModalVisible,
    updateNetworks,
    onCloseModal,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentNetwork);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(currentNetwork);
  }, [form, currentNetwork]);

  const addNetwork = async (network: model.Network) => {
    await AddHostNetwork(network).then((res) => {
      networks[networks.length] = res;
      updateNetworks(networks);
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

  const handleClose = () => {
    onCloseModal();
    form.resetFields();
  };

  const handleFormChange = (value: model.Network) => {
    setFormData(value);
  };

  const handleSubmit = (network: model.Network) => {
    setConfirmLoading(true);
    if (currentNetwork.uuid) {
      network.uuid = currentNetwork.uuid;
      network.hosts = currentNetwork.hosts;
      editNetwork(network);
    } else {
      addNetwork(network);
    }
    setConfirmLoading(false);
    handleClose();
  };
  if (!form) {
    return <></>;
  }

  return (
    <>
      <Modal
        title={
          currentNetwork.uuid ? "Edit " + currentNetwork.name : "New Network"
        }
        visible={isModalVisible}
        onOk={() => handleSubmit(formData)}
        onCancel={handleClose}
        confirmLoading={confirmLoading}
        okText="Save"
      >
        {currentNetwork.name}
        <Form
          name="name"
          form={form}
          onFinishFailed={() => alert("Failed to submit")}
          onFinish={(e: model.Network) => {
            handleSubmit(e);
          }}
          onValuesChange={handleFormChange}
          initialValues={{ name: currentNetwork.name }}
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const NetworksTable = (props: any) => {
  const { networks, updateNetworks, showModal } = props;
  if (!networks) return <></>;
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
    await DeleteHostNetwork(networkUUID).then((res) => {
      const newNetworks = networks.filter(
        (n: model.Network) => n.uuid !== networkUUID
      );
      updateNetworks(newNetworks);
    });
  };

  return (
    <>
      <Table rowKey="uuid" dataSource={networks} columns={columns} />
    </>
  );
};

export const Networks = () => {
  const [networks, setNetworks] = useState([] as model.Network[]);
  const [currentNetwork, setCurrentNetwork] = useState({} as model.Network);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const showModal = (network: model.Network) => {
    setCurrentNetwork(network);
    setIsModalVisible(true);
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <h1>Networks</h1>

      <AddNetworkButton showModal={showModal} />
      <CreateEditNetworkModal
        networks={networks}
        currentNetwork={currentNetwork}
        isModalVisible={isModalVisible}
        updateNetworks={updateNetworks}
        onCloseModal={onCloseModal}
      />
      <NetworksTable
        networks={networks}
        updateNetworks={updateNetworks}
        showModal={showModal}
      />
    </>
  );
};
