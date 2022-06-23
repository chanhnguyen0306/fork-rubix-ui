import {Button, Modal, Spin} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import { AddLocation, UpdateLocation} from "../../../../wailsjs/go/main/App";
import {openNotificationWithIcon} from "../../../utils/utils";
import {JsonForm} from "../../../common/json-form";

import Location = model.Location;
import {model} from "../../../../wailsjs/go/models";

export const AddButton = (props: any) => {
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

export const CreateEditModal = (props: any) => {
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