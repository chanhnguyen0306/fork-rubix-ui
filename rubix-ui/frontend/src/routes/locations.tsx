import { Button, Modal, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { model, storage } from "../../wailsjs/go/models";
import {
  AddLocation,
  DeleteLocation,
  GetConnection,
  GetLocations,
  UpdateLocation,
} from "../../wailsjs/go/main/App";
import { JsonForm } from "../common/json-form";
import { isObjectEmpty, openNotificationWithIcon } from "../utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import { LocationFactory } from "../components/locations/locations";
import RubixConnection = storage.RubixConnection;
import Location = model.Location;

const AddLocationButton = (props: any) => {
  const { onShowModal } = props;

  return (
    <Button
      type="primary"
      onClick={() => onShowModal({} as Location)}
      style={{ margin: "5px", float: "right" }}
    >
      <PlusOutlined /> Location
    </Button>
  );
};

const CreateEditLocationModal = (props: any) => {
  const {
    currentLocation,
    locationSchema,
    isModalVisible,
    isLoadingForm,
    refreshList,
    onCloseModal,
    setIsFetching,
    connUUID,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentLocation);

  useEffect(() => {
    setFormData(currentLocation);
  }, [currentLocation]);

  const addLocation = async (location: any) => {
    try {
      const res = await AddLocation(connUUID, location);
      if (res.uuid) {
        openNotificationWithIcon("success", `added ${location.name} success`);
      } else {
        openNotificationWithIcon("error", `added ${location.name} fail`);
      }
    } catch (err) {
      openNotificationWithIcon("error", err);
      console.log(err);
    }
  };

  const editLocation = async (location: Location) => {
    try {
      const res = UpdateLocation(connUUID, location.uuid, location);
      openNotificationWithIcon("success", `updated ${location.name} success`);
    } catch (error) {
      openNotificationWithIcon("error", `updated ${location.name} fail`);
    }
  };

  const handleClose = () => {
    setFormData({} as Location);
    onCloseModal();
  };

  const handleSubmit = (location: any) => {
    setConfirmLoading(true);
    delete location.connection_name;
    if (currentLocation.uuid) {
      location.uuid = currentLocation.uuid;
      location.networks = currentLocation.networks;
      editLocation(location);
    } else {
      addLocation(location);
    }
    setConfirmLoading(false);
    setIsFetching(true);
    handleClose();
    refreshList();
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
        currentLocation.uuid
          ? "Edit " + currentLocation.name
          : "Add New Location"
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
          jsonSchema={locationSchema}
        />
      </Spin>
    </Modal>
  );
};

const LocationsTable = (props: any) => {
  let { locations, isFetching, tableSchema } = props;
  if (!locations) return <></>;

  return (
    <div>
      <Table
        rowKey="uuid"
        dataSource={locations}
        columns={tableSchema}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </div>
  );
};

export const Locations = () => {
  const [locations, setLocations] = useState([] as Location[]);
  const [currentLocation, setCurrentLocation] = useState({} as Location);
  const [locationSchema, setLocationSchema] = useState({});
  const [tableSchema, setTableSchema] = useState([]);
  const [connection, setConnection] = useState({} as RubixConnection);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  let { connUUID } = useParams();
  const navigate = useNavigate();
  let locationFactory = new LocationFactory();
  locationFactory.connectionUUID = connUUID as string;

  useEffect(() => {
    getSchemaTable();
  }, []); //on first load hook react

  useEffect(() => {
    getConnection();
    fetchList();
  }, [connUUID]); //on load when connUUID changes

  const fetchList = async () => {
    try {
      setIsFetching(true);
      let res = await GetLocations(locationFactory.connectionUUID);
      setLocations(res);
    } catch (error) {
      setLocations([]);
    } finally {
      setIsFetching(false);
    }
  };

  const getConnection = async () => {
    try {
      const res = await GetConnection(locationFactory.connectionUUID);
      setConnection(res);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    let res = await locationFactory.Schema();
    res = {
      properties: {
        ...res.properties,
        connection_name: {
          title: "Connection",
          type: "string",
          default: connection.name,
          readOnly: true,
        },
      },
    };
    setLocationSchema(res);
    setIsLoadingForm(false);
  };

  const deleteLocation = async (uuid: string) => {
    await DeleteLocation(locationFactory.connectionUUID, uuid);
    refreshList();
    setIsFetching(true);
  };

  const refreshList = () => {
    fetchList();
  };

  const onShowModal = (location: Location) => {
    setCurrentLocation(location);
    setIsModalVisible(true);
    if (isObjectEmpty(locationSchema)) {
      getSchema();
    }
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
  };

  const getSchemaTable = async () => {
    try {
      const r = await locationFactory.TableSchema();
      let tableSchema = r;
      tableSchema = [
        ...tableSchema,
        {
          title: "Networks count",
          dataIndex: "networks",
          key: "networks",
          render: (networks: []) => <a>{networks ? networks.length : 0}</a>,
        },
        {
          title: "Actions",
          dataIndex: "actions",
          key: "actions",
          render: (_: any, location: Location) => (
            <Space size="middle">
              <a
                onClick={() =>
                  navigate(`/networks/${location.uuid}`, {
                    state: { connUUID: connUUID },
                  })
                }
              >
                View
              </a>
              <a
                onClick={() => {
                  onShowModal(location);
                }}
              >
                Edit
              </a>
              <a
                onClick={() => {
                  deleteLocation(location.uuid);
                }}
              >
                Delete
              </a>
            </Space>
          ),
        },
      ];
      setTableSchema(tableSchema);
    } catch (error) {}
  };

  return (
    <>
      <h1>Locations</h1>

      <AddLocationButton onShowModal={onShowModal} />
      <CreateEditLocationModal
        locations={locations}
        currentLocation={currentLocation}
        locationSchema={locationSchema}
        isModalVisible={isModalVisible}
        isLoadingForm={isLoadingForm}
        refreshList={refreshList}
        onCloseModal={onCloseModal}
        setIsFetching={setIsFetching}
        connUUID={connUUID}
      />
      <LocationsTable
        locations={locations}
        isFetching={isFetching}
        tableSchema={tableSchema}
      />
    </>
  );
};
