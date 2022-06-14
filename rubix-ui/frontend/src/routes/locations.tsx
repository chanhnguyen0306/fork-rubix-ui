import { Button, Modal, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { model } from "../../wailsjs/go/models";

import {
  GetLocations,
  GetLocationSchema,
  AddLocation,
  UpdateLocation,
  DeleteLocation,
} from "../../wailsjs/go/main/App";
import { JsonForm } from "../common/json-form";

const AddLocationButton = (props: any) => {
  const { showModal } = props;

  return (
    <Button
      type="primary"
      onClick={() => showModal({} as model.Location)}
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
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentLocation);

  useEffect(() => {
    setFormData(currentLocation);
  }, [currentLocation]);

  const addLocation = async (location: model.Location) => {
    const res = await AddLocation(location);
    locations.push(res);
    updateLocations(locations);
  };

  const editLocation = async (location: model.Location) => {
    const res = UpdateLocation(location.uuid, location);
    const index = locations.findIndex(
      (n: model.Location) => n.uuid === location.uuid
    );
    locations[index] = res;
    updateLocations(locations);
  };

  const handleClose = () => {
    setFormData({} as model.Location);
    onCloseModal();
  };

  const handleSubmit = (location: model.Location) => {
    setConfirmLoading(true);
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
  const { locations, updateLocations, showModal, isFetching, setIsFetching } =
    props;
  if (!locations) return <></>;

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
      render: (_: any, location: model.Location) => (
        <Space size="middle">
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
    await DeleteLocation(uuid);
    const newLocations = locations.filter(
      (n: model.Location) => n.uuid !== uuid
    );
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
  const [locations, setLocations] = useState([] as model.Location[]);
  const [currentLocation, setCurrentLocation] = useState({} as model.Location);
  const [locationSchema, setLocationSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, [locations]);

  const fetchLocations = async () => {
    try {
      const res = await GetLocations();
      setLocations(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await GetLocationSchema();
    setLocationSchema(res);
    setIsLoadingForm(false);
  };

  const updateLocations = (locations: model.Location[]) => {
    setLocations(locations);
  };

  const showModal = (location: model.Location) => {
    setCurrentLocation(location);
    setIsModalVisible(true);
    getSchema();
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
      />
      <LocationsTable
        locations={locations}
        isFetching={isFetching}
        showModal={showModal}
        updateLocations={updateLocations}
        setIsFetching={setIsFetching}
      />
    </>
  );
};
