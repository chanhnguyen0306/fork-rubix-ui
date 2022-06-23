import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {LocationFactory} from "./factory";
import {DeleteLocation, GetConnection, GetLocations} from "../../../wailsjs/go/main/App";
import {isObjectEmpty} from "../../utils/utils";
import {Space} from "antd";
import {model, storage} from "../../../wailsjs/go/models";
import RubixConnection = storage.RubixConnection;
import {AddButton, CreateEditModal} from "./views/create";
import {LocationsTable} from "./views/table";
import Location = model.Location;

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
        fetchList();
        getSchemaTable();
    }, []); //on first load hook react

    useEffect(() => {
        getConnection();
    }, [connUUID]); //on load when connUUID changes

    const fetchList = async () => {
        try {
            setIsFetching(true);
            let res = await GetLocations(locationFactory.connectionUUID);
            res = !res ? [] : res;
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
            <h2>Locations</h2>
            <AddButton onShowModal={onShowModal} />
            <CreateEditModal
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
