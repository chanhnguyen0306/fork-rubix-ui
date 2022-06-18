import { Button, Modal, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { model } from "../../wailsjs/go/models";
import {
  GetHosts,
  EditHost,
  DeleteHost,
  GetHostNetworks,
  GetHostSchema,
  AddHost,
} from "../../wailsjs/go/main/App";
import { JsonForm } from "../common/json-form";
import { isObjectEmpty } from "../utils/utils";
import { useParams } from "react-router-dom";

const AddButton = (props: any) => {
  const { showModal } = props;

  return (
    <Button
      type="primary"
      onClick={() => showModal({} as model.Host)}
      style={{ margin: "5px", float: "right" }}
    >
      <PlusOutlined /> Host
    </Button>
  );
};

const CreateEditModal = (props: any) => {
  const {
    hosts,
    hostSchema,
    currentHost,
    isModalVisible,
    isLoadingForm,
    updateHosts,
    onCloseModal,
    setIsFetching,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentHost);

  useEffect(() => {
    setFormData(currentHost);
  }, [currentHost]);

  const addHost = async (host: model.Host) => {
    const res = await AddHost(host);
    hosts.push(res);
    updateHosts(hosts);
  };

  const editHost = async (host: model.Host) => {
    const res = await EditHost(host.uuid, host);
    const index = hosts.findIndex((n: model.Host) => n.uuid === host.uuid);
    hosts[index] = res;
    updateHosts(hosts);
  };

  const handleClose = () => {
    setFormData({} as model.Host);
    onCloseModal();
  };

  const handleSubmit = (host: model.Host) => {
    setConfirmLoading(true);
    if (currentHost.uuid) {
      host.uuid = currentHost.uuid;
      editHost(host);
    } else {
      addHost(host);
    }
    setConfirmLoading(false);
    setIsFetching(true);
    handleClose();
  };

  const isDisabled = (): boolean => {
    let result = false;
    result =
      !formData.name ||
      (formData.name &&
        (formData.name.length < 2 || formData.name.length > 50)) ||
      !formData.port ||
      (formData.port && (formData.port < 2 || formData.port > 65535)) ||
      !formData.ip ||
      !formData.network_uuid;
    return result;
  };

  return (
    <>
      <Modal
        title={currentHost.uuid ? "Edit " + currentHost.name : "New Host"}
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
            jsonSchema={hostSchema}
          />
        </Spin>
      </Modal>
    </>
  );
};

const HostsTable = (props: any) => {
  const { hosts, networks, updateHosts, showModal, isFetching, setIsFetching } =
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
        </Space>
      ),
    },
  ];

  const deleteHost = async (uuid: string) => {
    await DeleteHost(uuid);
    const newHosts = hosts.filter((n: model.Host) => n.uuid !== uuid);
    updateHosts(newHosts);
    setIsFetching(true);
  };

  const getNetworkNameByUUID = (uuid: string) => {
    const network = networks.find((l: model.Location) => l.uuid === uuid);
    return network ? network.name : "";
  };

  return (
    <Table
      rowKey="uuid"
      dataSource={hosts}
      columns={columns}
      loading={{ indicator: <Spin />, spinning: isFetching }}
    />
  );
};

export const Hosts = () => {
  const [hosts, setHosts] = useState([] as model.Host[]);
  const [networks, setNetworks] = useState([] as model.Network[]);
  const [currentHost, setCurrentHost] = useState({} as model.Host);
  const [hostSchema, setHostSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  let { netUUID } = useParams();

  useEffect(() => {
    fetchHosts();
    if (networks.length === 0) {
      fetchNetworks();
    }
  }, [hosts]);

  const fetchHosts = async () => {
    try {
      const res = await (
        await GetHosts()
      ).map((h) => {
        if (h.enable == null) h.enable = h.enable ? h.enable : false;
        return h;
      });
      setHosts(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchNetworks = async () => {
    const res = await GetHostNetworks();
    setNetworks(res);
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await GetHostSchema();
    res.properties = {
      ...res.properties,
      network_uuid: {
        title: "network",
        type: "string",
        anyOf: networks.map((n: model.Network) => {
          return { type: "string", enum: [n.uuid], title: n.name };
        }),
        default: netUUID,
      },
    };
    setHostSchema(res);
    setIsLoadingForm(false);
  };

  const updateHosts = (hosts: model.Host[]) => {
    setHosts(hosts);
  };

  const showModal = (host: model.Host) => {
    setCurrentHost(host);
    setIsModalVisible(true);
    if (isObjectEmpty(hostSchema)) {
      getSchema();
    }
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <h1>Hosts</h1>

      <AddButton showModal={showModal} />
      <CreateEditModal
        hosts={hosts}
        currentHost={currentHost}
        hostSchema={hostSchema}
        isModalVisible={isModalVisible}
        isLoadingForm={isLoadingForm}
        updateHosts={updateHosts}
        onCloseModal={onCloseModal}
        setIsFetching={setIsFetching}
      />
      <HostsTable
        hosts={hosts}
        networks={networks}
        isFetching={isFetching}
        updateHosts={updateHosts}
        showModal={showModal}
        setIsFetching={setIsFetching}
      />
    </>
  );
};
