import { Button, Modal, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { model, storage } from "../../wailsjs/go/models";
import {
  GetLocations,
  GetLocationSchema,
  AddLocation,
  UpdateLocation,
  DeleteLocation,
  GetConnection,
} from "../../wailsjs/go/main/App";
import { JsonForm } from "../common/json-form";
import { isObjectEmpty, openNotificationWithIcon } from "../utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import RubixConnection = storage.RubixConnection;
import Location = model.Location;

const AddLocationButton = (props: any) => {
  const { showModal } = props;

  return (
    <Button
      type="primary"
      onClick={() => showModal({} as Location)}
      style={{ margin: "5px", float: "right" }}
    >
      <PlusOutlined /> Location
    </Button>
  );
};

const CreateEditLocationModal = (props: any) => {
  const {
    locations,
    currentLocation,
    locationSchema,
    isModalVisible,
    isLoadingForm,
    updateLocations,
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
        locations.push(res);
        updateLocations(locations);
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
    const res = UpdateLocation(connUUID, location.uuid, location);
    const index = locations.findIndex(
      (n: Location) => n.uuid === location.uuid
    );
    locations[index] = res;
    updateLocations(locations);
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
  const {
    locations,
    updateLocations,
    showModal,
    isFetching,
    setIsFetching,
    connUUID,
  } = props;
  if (!locations) return <></>;

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
      title: "Networks number",
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
              showModal(location);
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

  const deleteLocation = async (uuid: string) => {
    await DeleteLocation(connUUID, uuid);
    const newLocations = locations.filter((n: Location) => n.uuid !== uuid);
    updateLocations(newLocations);
    setIsFetching(true);
  };

  return (
    <div>
      <Table
        rowKey="uuid"
        dataSource={locations}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </div>
  );
};

export const Locations = () => {
  const [locations, setLocations] = useState([] as Location[]);
  const [currentLocation, setCurrentLocation] = useState({} as Location);
  const [locationSchema, setLocationSchema] = useState({});
  const [connection, setConnection] = useState({} as RubixConnection);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  let { connUUID } = useParams();

  useEffect(() => {
    fetchLocations();
  }, [locations]);

  useEffect(() => {
    getConnection();
  }, [connUUID]);

  const fetchLocations = async () => {
    try {
      const res = await GetLocations(connUUID as string);
      setLocations(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const getConnection = async () => {
    try {
      const res = await GetConnection(connUUID as string);
      setConnection(res);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    let res = await GetLocationSchema();
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

  const updateLocations = (locations: Location[]) => {
    setLocations(locations);
  };

  const showModal = (location: Location) => {
    setCurrentLocation(location);
    setIsModalVisible(true);
    if (isObjectEmpty(locationSchema)) {
      getSchema();
    }
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <h1>Locations</h1>

      <AddLocationButton showModal={showModal} />
      <CreateEditLocationModal
        locations={locations}
        currentLocation={currentLocation}
        locationSchema={locationSchema}
        isModalVisible={isModalVisible}
        isLoadingForm={isLoadingForm}
        updateLocations={updateLocations}
        onCloseModal={onCloseModal}
        setIsFetching={setIsFetching}
        connUUID={connUUID}
      />
      <LocationsTable
        locations={locations}
        isFetching={isFetching}
        showModal={showModal}
        updateLocations={updateLocations}
        setIsFetching={setIsFetching}
        connUUID={connUUID}
      />
    </>
  );
};
