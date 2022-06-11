import { Button, Modal, Space, Table } from "antd";
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
    updateLocations,
    onCloseModal,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentLocation);

  useEffect(() => {
    setFormData(currentLocation);
  }, [currentLocation]);

  const addLocation = async (location: model.Location) => {
    await AddLocation(location).then((res) => {
      locations[locations.length] = res;
      updateLocations(locations);
    });
  };

  const editLocation = async (location: model.Location) => {
    await UpdateLocation(location.uuid, location).then((res) => {
      const index = locations.findIndex(
        (n: model.Location) => n.uuid === location.uuid
      );
      locations[index] = res;
      updateLocations(locations);
    });
  };

  const handleClose = () => {
    setFormData({} as model.Network);
    onCloseModal();
  };

  const handleFormChange = (inputValue: any, values: model.Location) => {
    setFormData(values);
  };

  const handleSubmit = (location: model.Location) => {
    // setConfirmLoading(true);
    // if (currentLocation.uuid) {
    //   location.uuid = currentLocation.uuid;
    //   location.networks = currentLocation.networks;
    //   editLocation(location);
    // } else {
    //   addLocation(location);
    // }
    // setConfirmLoading(false);
    console.log(location);
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
      confirmLoading={confirmLoading}
      okButtonProps={{
        disabled: isDisabled(),
      }}
      style={{ textAlign: "start" }}
    >
      <JsonForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        locationSchema={locationSchema}
      />
    </Modal>
  );
};

const LocationsTable = (props: any) => {
  const { locations, updateLocations, showModal } = props;
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
    await DeleteLocation(uuid).then((res) => {
      const newLocations = locations.filter(
        (n: model.Location) => n.uuid !== uuid
      );
      updateLocations(newLocations);
    });
  };

  return <Table rowKey="uuid" dataSource={locations} columns={columns} />;
};

export const Locations = () => {
  const [locations, setLocations] = useState([] as model.Location[]);
  const [currentLocation, setCurrentLocation] = useState({} as model.Location);
  const [locationSchema, setLocationSchema] = useState(
    {} as model.LocationSchema
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, [locations]);

  const updateLocations = (locations: model.Location[]) => {
    setLocations(locations);
  };

  const fetchLocations = async () => {
    await GetLocations().then((res) => {
      setLocations(res);
    });
  };

  const getSchema = async () => {
    await GetLocationSchema().then((res) => {
      setLocationSchema(res);
    });
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
        updateLocations={updateLocations}
        onCloseModal={onCloseModal}
      />
      <LocationsTable
        locations={locations}
        updateLocations={updateLocations}
        showModal={showModal}
      />
    </>
  );
};
