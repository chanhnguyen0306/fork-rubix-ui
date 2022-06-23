import {useEffect, useState} from "react";
import {model} from "../../../wailsjs/go/models";
import {useLocation, useParams} from "react-router-dom";
import {GetHostNetworks, GetHosts, GetHostSchema} from "../../../wailsjs/go/main/App";
import {isObjectEmpty} from "../../utils/utils";
import {AddButton, CreateEditModal} from "./views/create";
import {HostsTable} from "./views/table";

export const Hosts = () => {
    const [hosts, setHosts] = useState([] as model.Host[]);
    const [networks, setNetworks] = useState([] as model.Network[]);
    const [currentHost, setCurrentHost] = useState({} as model.Host);
    const [hostSchema, setHostSchema] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isLoadingForm, setIsLoadingForm] = useState(false);

    let { netUUID } = useParams();
    const location = useLocation() as any;
    const connUUID = location.state.connUUID ?? "";

    useEffect(() => {
        fetchList();
        if (networks.length === 0) {
            fetchNetworks();
        }
    }, []);

    const fetchList = async () => {
        try {
            setIsFetching(true);
            const res = (
                await GetHosts(connUUID)
            ).map((h) => {
                if (h.enable == null) h.enable = h.enable ? h.enable : false;
                return h;
            });
            setHosts(res);
        } catch (error) {
            console.log(error);
        } finally {
            setIsFetching(false);
        }
    };

    const fetchNetworks = async () => {
        const res = await GetHostNetworks(connUUID);
        setNetworks(res);
    };

    const getSchema = async () => {
        setIsLoadingForm(true);
        const res = await GetHostSchema(connUUID);
        res.properties = {
            ...res.properties,
            network_uuid: {
                title: "network",
                type: "string",
                anyOf: networks.map((n: model.Network) => {
                    return { type: "string", enum: [n.uuid], title: n.name };
                }),
                default: netUUID,
            },
        };
        setHostSchema(res);
        setIsLoadingForm(false);
    };

    const updateHosts = (hosts: model.Host[]) => {
        setHosts(hosts);
    };

    const refreshList = () => {
        fetchList();
    };

    const showModal = (host: model.Host) => {
        setCurrentHost(host);
        setIsModalVisible(true);
        if (isObjectEmpty(hostSchema)) {
            getSchema();
        }
    };

    const onCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <h1>Hosts</h1>

            <AddButton showModal={showModal} />
            <CreateEditModal
                hosts={hosts}
                currentHost={currentHost}
                hostSchema={hostSchema}
                isModalVisible={isModalVisible}
                isLoadingForm={isLoadingForm}
                refreshList={refreshList}
                onCloseModal={onCloseModal}
                connUUID={connUUID}
            />
            <HostsTable
                hosts={hosts}
                networks={networks}
                isFetching={isFetching}
                refreshList={refreshList}
                showModal={showModal}
                connUUID={connUUID}
            />
        </>
    );
};
