import { Button, Form, Modal, Select, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { model } from "../../wailsjs/go/models";
import Input from "antd/es/input/Input";
import {
  AddHostNetwork,
  GetHostNetworks,
  EditHostNetwork,
  DeleteHostNetwork,
  GetLocations,
} from "../../wailsjs/go/main/App";

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

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
    locations,
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
  }, [currentNetwork]);

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
    setFormData(null);
  };

  const handleFormChange = (value: any, values: model.Network) => {
    setFormData(values);
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
        okButtonProps={{
          disabled:
            !form.getFieldValue("name") ||
            (form.getFieldValue("name") &&
              (form.getFieldValue("name").length < 2 ||
                form.getFieldValue("name").length > 50)) ||
            !form.getFieldValue("location_uuid"),
        }}
      >
        <Form
          {...formItemLayout}
          form={form}
          initialValues={formData}
          onFinishFailed={() => alert("Failed to submit")}
          onFinish={(e: model.Network) => {
            handleSubmit(e);
          }}
          onValuesChange={handleFormChange}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Name is required!" },
              { min: 2, message: "Name must be minimum 2 characters." },
              { max: 50, message: "Name must be maximum 50 characters." },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location_uuid"
            rules={[{ required: true, message: "Location is required!" }]}
          >
            <Select style={{ textAlign: "start" }}>
              {locations.map((location: model.Location) => (
                <Option key={location.uuid}>{location.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const NetworksTable = (props: any) => {
  const { networks, locations, updateNetworks, showModal } = props;
  if (!networks) return <></>;
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

  const getLocationNameByUUID = (location_uuid: string) => {
    const location = locations.find(
      (l: model.Location) => l.uuid === location_uuid
    );
    return location ? location.name : "";
  };

  return (
    <>
      <Table rowKey="uuid" dataSource={networks} columns={columns} />
    </>
  );
};

export const Networks = () => {
  const [networks, setNetworks] = useState([] as model.Network[]);
  const [locations, setLocations] = useState([] as model.Location[]);
  const [currentNetwork, setCurrentNetwork] = useState({} as model.Network);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fetchingNetworks, setfetchingNetworks] = useState(false);

  useEffect(() => {
    fetchNetworks();
    if (locations.length === 0) {
      fetchLocations();
    }
  }, [networks]);

  const updateNetworks = (networks: model.Network[]) => {
    setNetworks(networks);
  };

  const fetchNetworks = async () => {
    setfetchingNetworks(true);
    await GetHostNetworks().then((res) => {
      setNetworks(res);
      setfetchingNetworks(false);
    });
  };

  const fetchLocations = async () => {
    await GetLocations().then((res) => {
      setLocations(res);
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
        locations={locations}
        currentNetwork={currentNetwork}
        isModalVisible={isModalVisible}
        updateNetworks={updateNetworks}
        onCloseModal={onCloseModal}
      />
      <NetworksTable
        networks={networks}
        locations={locations}
        updateNetworks={updateNetworks}
        showModal={showModal}
      />
    </>
  );
};
