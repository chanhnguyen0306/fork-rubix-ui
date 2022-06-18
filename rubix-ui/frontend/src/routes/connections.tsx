import { Button, Modal, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { storage } from "../../wailsjs/go/models";
import {
  GetConnections,
  GetConnectionSchema,
  AddConnection,
  UpdateConnection,
  DeleteConnection,
} from "../../wailsjs/go/main/App";
import { JsonForm } from "../common/json-form";
import { isObjectEmpty, openNotificationWithIcon } from "../utils/utils";

import RubixConnection = storage.RubixConnection;
import { useNavigate } from "react-router-dom";

const AddButton = (props: any) => {
  const { showModal } = props;

  return (
    <Button
      type="primary"
      onClick={() => showModal({} as RubixConnection)}
      style={{ margin: "5px", float: "right" }}
    >
      <PlusOutlined /> Connection
    </Button>
  );
};

const CreateEditModal = (props: any) => {
  const {
    connections,
    currentConnection,
    connectionSchema,
    isModalVisible,
    isLoadingForm,
    updateConnections,
    onCloseModal,
    setIsFetching,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentConnection);

  useEffect(() => {
    setFormData(currentConnection);
  }, [currentConnection]);

  const addConnection = async (connection: RubixConnection) => {
    try {
      const res = await AddConnection(connection);
      if (res.uuid) {
        if (!connections) updateConnections([]);
        connections.push(res);
        updateConnections(connections);
        openNotificationWithIcon("success", `added ${connection.name} success`);
      } else {
        openNotificationWithIcon("error", `added ${connection.name} fail`);
      }
    } catch (err) {
      openNotificationWithIcon("error", err);
      console.log(err);
    }
  };

  const editConnection = async (connection: RubixConnection) => {
    const res = UpdateConnection(connection.uuid, connection);
    const index = connections.findIndex(
      (n: RubixConnection) => n.uuid === connection.uuid
    );
    connections[index] = res;
    updateConnections(connections);
  };

  const handleClose = () => {
    setFormData({} as RubixConnection);
    onCloseModal();
  };

  const handleSubmit = (connection: RubixConnection) => {
    setConfirmLoading(true);
    if (currentConnection.uuid) {
      connection.uuid = currentConnection.uuid;
      editConnection(connection);
    } else {
      addConnection(connection);
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
        (formData.name.length < 2 || formData.name.length > 50));
    return result;
  };

  return (
    <Modal
      title={
        currentConnection.uuid
          ? "Edit " + currentConnection.name
          : "Add New Connection"
      }
      visible={isModalVisible}
      onOk={() => handleSubmit(formData)}
      onCancel={handleClose}
      okText="Save"
      okButtonProps={{
        disabled: isDisabled(),
      }}
      confirmLoading={confirmLoading}
      style={{ textAlign: "start" }}
    >
      <Spin spinning={isLoadingForm}>
        <JsonForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          jsonSchema={connectionSchema}
        />
      </Spin>
    </Modal>
  );
};

const ConnectionsTable = (props: any) => {
  const {
    connections,
    updateConnections,
    showModal,
    isFetching,
    setIsFetching,
  } = props;
  if (!connections) return <></>;

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
    // {
    //   title: "Locations",
    //   dataIndex: "locations",
    //   key: "locations",
    //   render: (locations: []) => <a>{locations ? locations.length : 0}</a>,
    // },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, conn: RubixConnection) => (
        <Space size="middle">
          <a onClick={() => navigate(`locations/${conn.uuid}`)}>View</a>
          <a
            onClick={() => {
              showModal(conn);
            }}
          >
            Edit
          </a>
          <a
            onClick={() => {
              deleteConnection(conn.uuid);
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  const deleteConnection = async (uuid: string) => {
    await DeleteConnection(uuid);
    const newConnections = connections.filter(
      (c: RubixConnection) => c.uuid !== uuid
    );
    updateConnections(newConnections);
    setIsFetching(true);
  };

  return (
    <div>
      <Table
        rowKey="uuid"
        dataSource={connections}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </div>
  );
};

export const Connections = () => {
  const [connections, setConnections] = useState([] as RubixConnection[]);
  const [currentConnection, setCurrentConnection] = useState(
    {} as RubixConnection
  );
  const [connectionSchema, setConnectionSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, [connections]);

  const fetchConnections = async () => {
    try {
      let res = await GetConnections();
      res = !res ? [] : res;
      setConnections(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await GetConnectionSchema();
    const jsonSchema = {
      properties: res,
    };
    setConnectionSchema(jsonSchema);
    setIsLoadingForm(false);
  };

  const updateConnections = (connections: RubixConnection[]) => {
    setConnections(connections);
  };

  const showModal = (connection: RubixConnection) => {
    setCurrentConnection(connection);
    setIsModalVisible(true);
    if (isObjectEmpty(connectionSchema)) {
      getSchema();
    }
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <h1>Connections</h1>

      <AddButton showModal={showModal} />
      <CreateEditModal
        connections={connections}
        currentConnection={currentConnection}
        connectionSchema={connectionSchema}
        isModalVisible={isModalVisible}
        isLoadingForm={isLoadingForm}
        updateConnections={updateConnections}
        onCloseModal={onCloseModal}
        setIsFetching={setIsFetching}
      />
      <ConnectionsTable
        connections={connections}
        isFetching={isFetching}
        showModal={showModal}
        updateConnections={updateConnections}
        setIsFetching={setIsFetching}
      />
    </>
  );
};
