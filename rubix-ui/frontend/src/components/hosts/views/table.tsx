import {Space, Spin} from "antd";
import {DeleteHost, OpenURL} from "../../../../wailsjs/go/main/App";
import {openNotificationWithIcon} from "../../../utils/utils";
import {assistmodel} from "../../../../wailsjs/go/models";
import {useNavigate} from "react-router-dom";
import RbTable from "../../../common/rb-table";

export const HostsTable = (props: any) => {
    const {hosts, networks, showModal, isFetching, connUUID, refreshList} =
        props;
    const navigate = useNavigate();
    const columns = [
        {
            title: "name",
            dataIndex: "name",
            key: "name",
        },

        {
            title: "description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "ProductType",
            dataIndex: "ProductType",
            key: "ProductType",
        },
        {
            title: "network",
            dataIndex: "network_uuid",
            key: "network_uuid",
            render: (network_uuid: string) => (
                <span>{getNetworkNameByUUID(network_uuid)}</span>
            ),
        },
        {
            title: "uuid",
            dataIndex: "uuid",
            key: "uuid",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_: any, host: assistmodel.Host) => (
                <Space size="middle">
                    <a
                        onClick={() =>
                            navigate(`/host/${host.uuid}`, {
                                state: {connUUID: connUUID, hostUUID: host.uuid},
                            })
                        }
                    >
                        View-Device
                    </a>
                    <a
                        onClick={() => {
                            showModal(host);
                        }}
                    >
                        Edit
                    </a>
                    <a
                        onClick={() => {
                            deleteHost(host.uuid);
                        }}
                    >
                        Delete
                    </a>
                    <a
                        onClick={() => {
                            navigateToNewTab(host);
                        }}
                    >
                        Open-Rubix-Wires
                    </a>
                </Space>
            ),
        },
    ];

    const deleteHost = async (uuid: string) => {
        await DeleteHost(connUUID, uuid);
        refreshList();
    };

    const getNetworkNameByUUID = (uuid: string) => {
        const network = networks.find((l: assistmodel.Location) => l.uuid === uuid);
        return network ? network.name : "";
    };

    const navigateToNewTab = (host: assistmodel.Host) => {
        try {
            const {ip} = host;
            const source = `http://${ip}:1313/`;
            OpenURL(source);
        } catch (err: any) {
            openNotificationWithIcon("error", err.message);
        }
    };

    return (
        <>
            <RbTable
                rowKey="uuid"
                dataSource={hosts}
                columns={columns}
                loading={{indicator: <Spin/>, spinning: isFetching}}
            />
        </>
    );
};
