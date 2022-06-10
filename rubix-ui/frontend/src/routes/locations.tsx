import { Button, Form, Modal, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { model } from "../../wailsjs/go/models";
import Input from "antd/es/input/Input";
import {
  GetLocations,
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
    isModalVisible,
    updateLocations,
    onCloseModal,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentLocation);
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  useEffect(() => {
    //set default data for Form
    form.setFieldsValue(currentLocation);
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
    form.resetFields();
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
    // handleClose();
    console.log(location);
  };

  if (!form) {
    return <></>;
  }

  return (
    <>
      <Modal
        title={
          currentLocation.uuid
            ? "Edit " + currentLocation.name
            : "Add New Location"
        }
        visible={isModalVisible}
        onOk={() => handleSubmit(formData)}
        onCancel={handleClose}
        confirmLoading={confirmLoading}
        okButtonProps={{
          disabled:
            !form.getFieldValue("name") ||
            (form.getFieldValue("name") &&
              (form.getFieldValue("name").length < 2 ||
                form.getFieldValue("name").length > 50)),
        }}
        okText="Save"
      >
        {/* <Form
          {...formItemLayout}
          form={form}
          initialValues={formData}
          onValuesChange={handleFormChange}
          onFinishFailed={() => alert("Failed to submit")}
          onFinish={(e: model.Location) => {
            handleSubmit(e);
          }}
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
        </Form> */}

        <JsonForm
          form={form}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      </Modal>
    </>
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

  return (
    <>
      <Table rowKey="uuid" dataSource={locations} columns={columns} />
    </>
  );
};

export const Locations = () => {
  const [locations, setLocations] = useState([] as model.Location[]);
  const [currentLocation, setCurrentLocation] = useState({} as model.Location);
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

  const showModal = (location: model.Location) => {
    setCurrentLocation(location);
    setIsModalVisible(true);
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
