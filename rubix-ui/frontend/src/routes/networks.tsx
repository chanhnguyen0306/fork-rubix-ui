import { Button, Modal, Space, Spin, Table } from "antd";
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
import { isObjectEmpty, openNotificationWithIcon } from "../utils/utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
    networkSchema,
    currentNetwork,
    isModalVisible,
    isLoadingForm,
    refreshList,
    onCloseModal,
    connUUID,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentNetwork);

  useEffect(() => {
    setFormData(currentNetwork);
  }, [currentNetwork]);

  const addNetwork = async (network: model.Network) => {
    try {
      const res = await AddHostNetwork(connUUID, network);
      openNotificationWithIcon("success", `added ${network.name} success`);
    } catch (error) {
      openNotificationWithIcon("error", `added ${network.name} fail`);
    }
  };

  const editNetwork = async (network: model.Network) => {
    try {
      const res = await EditHostNetwork(connUUID, network.uuid, network);
      openNotificationWithIcon("success", `updated ${network.name} success`);
    } catch (error) {
      openNotificationWithIcon("error", `updated ${network.name} fail`);
    }
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
    refreshList();
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
        <Spin spinning={isLoadingForm}>
          <JsonForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            jsonSchema={networkSchema}
          />
        </Spin>
      </Modal>
    </>
  );
};

const NetworksTable = (props: any) => {
  const { networks, locations, refreshList, showModal, isFetching, connUUID } =
    props;
  if (!networks) return <></>;

  const navigate = useNavigate();

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
      render: (_: any, network: model.Network) => (
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

  const getLocationNameByUUID = (location_uuid: string) => {
    const location = locations.find(
      (l: model.Location) => l.uuid === location_uuid
    );
    return location ? location.name : "";
  };

  return (
    <Table
      rowKey="uuid"
      dataSource={networks}
      columns={columns}
      loading={{ indicator: <Spin />, spinning: isFetching }}
    />
  );
};

export const Networks = () => {
  const [networks, setNetworks] = useState([] as model.Network[]);
  const [locations, setLocations] = useState([] as model.Location[]);
  const [currentNetwork, setCurrentNetwork] = useState({} as model.Network);
  const [networkSchema, setNetworkSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  let { locUUID } = useParams();
  const location = useLocation() as any;
  const connUUID = location.state.connUUID ?? "";

  useEffect(() => {
    if (locations.length === 0) {
      fetchLocations();
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [locUUID]);

  const fetchList = async () => {
    try {
      setIsFetching(true);
      const res = await GetHostNetworks(connUUID);
      setNetworks(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchLocations = async () => {
    const res = await GetLocations(connUUID);
    setLocations(res);
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await GetNetworkSchema(connUUID);
    res.properties = {
      ...res.properties,
      location_uuid: {
        title: "location",
        type: "string",
        anyOf: locations.map((l: model.Location) => {
          return { type: "string", enum: [l.uuid], title: l.name };
        }),
        default: locUUID,
      },
    };
    setNetworkSchema(res);
    setIsLoadingForm(false);
  };

  const updateNetworks = (networks: model.Network[]) => {
    setNetworks(networks);
  };

  const refreshList = () => {
    fetchList();
  };

  const showModal = (network: model.Network) => {
    setCurrentNetwork(network);
    setIsModalVisible(true);
    if (isObjectEmpty(networkSchema)) {
      getSchema();
    }
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
        isLoadingForm={isLoadingForm}
        onCloseModal={onCloseModal}
        refreshList={refreshList}
        connUUID={connUUID}
      />
      <NetworksTable
        networks={networks}
        locations={locations}
        isFetching={isFetching}
        showModal={showModal}
        refreshList={refreshList}
        connUUID={connUUID}
      />
    </>
  );
};
