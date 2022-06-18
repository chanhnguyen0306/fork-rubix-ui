import {JsonForm} from "../common/json-form";
import {Button, Modal, Space, Spin, Table} from "antd";
import {storage} from "../../wailsjs/go/models";
import {PlusOutlined} from "@ant-design/icons";
import {
    AddConnection,
    DeleteConnection,
    GetConnections,
    GetConnectionSchema,
    UpdateConnection
} from "../../wailsjs/go/main/App";
import {useEffect, useState} from "react";
import RubixConnection = storage.RubixConnection;

const AddConnectionButton = (props: any) => {
    const {showModal} = props;
    return (
        <Button
            type="primary"
            onClick={() => showModal({} as RubixConnection)}
            style={{margin: "5px", float: "right"}}
        >
            <PlusOutlined/> connection
        </Button>
    );
};

const CreateEditConnectionModal = (props: any) => {
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

    const addConnection = async (body: RubixConnection) => {
        const res = await AddConnection(body);
        connections.push(res);
        updateConnections(connections);
    };

    const editConnection = async (body: RubixConnection) => {
        const res = UpdateConnection(body.uuid, body);
        const index = connections.findIndex(
            (n: RubixConnection) => n.uuid === body.uuid
        );
        connections[index] = res;
        updateConnections(connections);
    };

    const handleClose = () => {
        setFormData({} as RubixConnection);
        onCloseModal();
    };

    const handleSubmit = (body: RubixConnection) => {
        setConfirmLoading(true);
        if (currentConnection.uuid) {
            body.uuid = currentConnection.uuid;
            editConnection(body);
        } else {
            addConnection(body);
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
            style={{textAlign: "start"}}
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
    const {connections, updateConnections, showModal, isFetching, setIsFetching} =
        props;
    if (!connections) return <></>;

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
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_: any, body: RubixConnection) => (
                <Space size="middle">
                    <a
                        onClick={() => {
                            showModal(body);
                        }}
                    >
                        Edit
                    </a>
                    <a
                        onClick={() => {
                            deleteConnection(body.uuid);
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
            (n: RubixConnection) => n.uuid !== uuid
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
                loading={{indicator: <Spin/>, spinning: isFetching}}
            />
        </div>
    );
};


export const Connections = () => {
    const [connections, setConnections] = useState([] as RubixConnection[]);
    const [currentConnection, setCurrentConnection] = useState({} as RubixConnection);
    const [connectionSchema, setConnectionSchema] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isLoadingForm, setIsLoadingForm] = useState(false);

    useEffect(() => {
        fetchConnections();
    }, [connections]);

    const fetchConnections = async () => {
        try {
            const res = await GetConnections();
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
        setConnectionSchema(res);
        setIsLoadingForm(false);
    };

    const updateConnections = (body: RubixConnection[]) => {
        setConnections(body);
    };

    const showModal = (body: RubixConnection) => {
        setCurrentConnection(body);
        setIsModalVisible(true);
        getSchema();
    };

    const onCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <h1>Connections</h1>

            <AddConnectionButton showModal={showModal}/>
            <CreateEditConnectionModal
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


