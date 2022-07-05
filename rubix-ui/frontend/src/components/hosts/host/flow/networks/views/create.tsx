import {Form, Input, Modal, Spin} from "antd";
import {useEffect, useState} from "react";
import {FlowNetworkFactory} from "../factory";

export const CreateEditModal = (props: any) => {
    const {
        currentItem,
        isModalVisible,
        isLoadingForm,
        refreshList,
        onCloseModal,
        connUUID,
        hostUUID
    } = props;
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [formData, setFormData] = useState(currentItem);
    let flowNetworkFactory = new FlowNetworkFactory();

    useEffect(() => {
        setFormData(currentItem);
        console.log(currentItem);
    }, [currentItem]);

    const edit = async (item: any) => {
        console.log("edit", item);
        flowNetworkFactory.connectionUUID = connUUID
        flowNetworkFactory.hostUUID = hostUUID
        flowNetworkFactory.uuid = item.uuid
        console.log(connUUID, hostUUID, item.uuid, item.name)
        console.log("edit edit", formData.name);
        // await flowNetworkFactory.Update(item).then(e => console.log(1111, e)).catch(e => console.log(2222, e))

    };

    const handleClose = () => {
        setFormData({});
        onCloseModal();
    };

    const handleSubmit = (item: any) => {
        setConfirmLoading(true);
        edit(item);
        console.log("handleSubmit", formData.name);
        setConfirmLoading(false);
        handleClose();
        refreshList();
    };

    return (
        <>
            <Modal
                title={"Edit " + currentItem.name}
                visible={isModalVisible}
                onOk={() => handleSubmit(formData)}
                onCancel={handleClose}
                confirmLoading={confirmLoading}
                okText="Save"
                style={{textAlign: "start"}}
            >
                <Spin spinning={isLoadingForm}>
                    <Form
                        fields={[{name: ["name"], value: currentItem.name}]}
                        layout="vertical"
                        autoComplete="off"
                    >
                        <Form.Item name="name" label="name">
                            <Input/>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
};
