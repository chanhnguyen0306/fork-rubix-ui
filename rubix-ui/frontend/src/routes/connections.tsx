
import {
    AddConnection,
    DeleteConnection,
    GetConnections,
    GetLocations,
    GetLocationSchema
} from "../../wailsjs/go/main/App";
import {Button, Form, Space, Spin, Table} from "antd";
import Input from "antd/es/input/Input";
import {model, storage} from "../../wailsjs/go/models";
import RubixConnection = storage.RubixConnection;
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";

const AddConnectionButton = (props: any) => {
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


export const Connections = () => {
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
            const res = await GetLocations("ADDME");
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

    // return (
    //     <>
    //         <h1>Connections</h1>
    //
    //         <AddConnectionButton showModal={showModal} />
    //         <CreateEditLocationModal
    //             locations={locations}
    //             currentLocation={currentLocation}
    //             locationSchema={locationSchema}
    //             isModalVisible={isModalVisible}
    //             isLoadingForm={isLoadingForm}
    //             updateLocations={updateLocations}
    //             onCloseModal={onCloseModal}
    //             setIsFetching={setIsFetching}
    //         />
    //         <ConnectionsTable
    //             locations={locations}
    //             isFetching={isFetching}
    //             showModal={showModal}
    //             updateLocations={updateLocations}
    //             setIsFetching={setIsFetching}
    //         />
    //     </>
    // );
};

const ConnectionsTable = (props: any) => {
    const { connections, updateConnections, showModal, isFetching, setIsFetching } =
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
            render: (_: any, location: RubixConnection) => (
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
                            deleteConnection(location.uuid);
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
            (n:RubixConnection) => n.uuid !== uuid
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


async function addConnection(host: RubixConnection): Promise<RubixConnection> {
    let networks: Array<RubixConnection> = {} as Array<RubixConnection>;
    await GetConnections().then((r) => {
        networks = r;
    });
    console.log("try and add host", networks);
    let addedHost: RubixConnection = {} as RubixConnection;
    await AddConnection(host).then((res) => {
        console.log("added host", res.uuid);
        addedHost = res;
    });
    return addedHost;
}

export function AddConnectionForm() {
    return (
        <div
            style={{
                display: "block",
                width: 700,
                padding: 30,
            }}
        >
            <h4>ReactJS Ant-Design Form Component</h4>
            <Form
                name="name"
                onFinishFailed={() => alert("Failed to submit")}
                onFinish={(e: RubixConnection) => {
                    addConnection(e).then((r) => {
                        console.log("added a host", r);
                    });
                }}
                initialValues={{ remember: true }}
            >
                <Form.Item
                    label="Enter username"
                    name="name"
                >
                    <Input onChange={(e) => {}} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit Username
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
