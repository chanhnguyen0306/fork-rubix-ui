import {Button, Modal, Spin} from "antd";
import {assistmodel} from "../../../../wailsjs/go/models";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {AddHost, AddHostNetwork, EditHost, EditHostNetwork} from "../../../../wailsjs/go/main/App";
import {openNotificationWithIcon} from "../../../utils/utils";
import {JsonForm} from "../../../common/json-form";

export const AddButton = (props: any) => {
    const { showModal } = props;

    return (
        <Button
            type="primary"
            onClick={() => showModal({} as assistmodel.Network)}
            style={{ margin: "5px", float: "right" }}
        >
            <PlusOutlined /> Network
        </Button>
    );
};

export const CreateEditModal = (props: any) => {
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

    const addNetwork = async (network: assistmodel.Network) => {
        try {
            const res = await AddHostNetwork(connUUID, network);
            openNotificationWithIcon("success", `added ${network.name} success`);
        } catch (error) {
            openNotificationWithIcon("error", `added ${network.name} fail`);
        }
    };

    const editNetwork = async (network: assistmodel.Network) => {
        try {
            const res = await EditHostNetwork(connUUID, network.uuid, network);
            openNotificationWithIcon("success", `updated ${network.name} success`);
        } catch (error) {
            openNotificationWithIcon("error", `updated ${network.name} fail`);
        }
    };

    const handleClose = () => {
        setFormData({} as assistmodel.Network);
        onCloseModal();
    };

    const handleSubmit = (network: assistmodel.Network) => {
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