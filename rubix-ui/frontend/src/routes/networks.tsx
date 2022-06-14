import { Button, Modal, Select, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { model } from "../../wailsjs/go/models";
import {
  GetHostNetworks,
  EditHostNetwork,
  DeleteHostNetwork,
  GetLocations,
  GetNetworkSchema,
  AddHostNetwork,
} from "../../wailsjs/go/main/App";
import { JsonForm } from "../common/json-form";

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
    networkSchema,
    currentNetwork,
    isModalVisible,
    updateNetworks,
    onCloseModal,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentNetwork);

  useEffect(() => {
    setFormData(currentNetwork);
  }, [currentNetwork]);

  const addNetwork = async (network: model.Network) => {
    const res = await AddHostNetwork(network);
    networks.push(res);
    updateNetworks(networks);
  };

  const editNetwork = async (network: model.Network) => {
    const res = await EditHostNetwork(network.uuid, network);
    const index = networks.findIndex(
      (n: model.Network) => n.uuid === network.uuid
    );
    networks[index] = res;
    updateNetworks(networks);
  };

  const handleClose = () => {
    setFormData({} as model.Network);
    onCloseModal();
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

  const isDisabled = (): boolean => {
    let result = false;
    result =
      !formData.name ||
      (formData.name &&
        (formData.name.length < 2 || formData.name.length > 50)) ||
      !formData.location_uuid;
    return result;
  };

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
          disabled: isDisabled(),
        }}
        style={{ textAlign: "start" }}
      >
        <JsonForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          jsonSchema={networkSchema}
        />
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
    await DeleteHostNetwork(networkUUID);
    const newNetworks = networks.filter(
      (n: model.Network) => n.uuid !== networkUUID
    );
    updateNetworks(newNetworks);
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
  const [networkSchema, setNetworkSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fetchingNetworks, setfetchingNetworks] = useState(false);

  useEffect(() => {
    fetchNetworks();
    if (locations.length === 0) {
      fetchLocations();
    }
  }, [networks]);

  const fetchNetworks = async () => {
    setfetchingNetworks(true);
    GetHostNetworks().then((res) => {
      setNetworks(res);
      setfetchingNetworks(false);
    });
    console.log(GetHostNetworks);
  };

  const fetchLocations = async () => {
    const res = await GetLocations();
    setLocations(res);
  };

  const getSchema = async () => {
    const res = await GetNetworkSchema();
    res.properties = {
      ...res.properties,
      location_uuid: {
        title: "location",
        type: "string",
        anyOf: locations.map((l: model.Location) => {
          return { type: "string", enum: [l.uuid], title: l.name };
        }),
      },
    };
    setNetworkSchema(res);
  };

  const updateNetworks = (networks: model.Network[]) => {
    setNetworks(networks);
  };

  const showModal = (network: model.Network) => {
    setCurrentNetwork(network);
    setIsModalVisible(true);
    getSchema();
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
        networkSchema={networkSchema}
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
