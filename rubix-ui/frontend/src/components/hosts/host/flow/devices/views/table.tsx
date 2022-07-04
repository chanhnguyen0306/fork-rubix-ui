import {Space, Spin, Table} from "antd";
import {model} from "../../../../../../../wailsjs/go/models";
import {useNavigate} from "react-router-dom";

export const FlowDeviceTable = (props: any) => {
    const {data, isFetching, connUUID, hostUUID, networkUUID} = props;
    if (!data) return <></>;
    const navigate = useNavigate();


    const columns = [
        {
            title: "uuid",
            dataIndex: "uuid",
            key: "uuid",
        },
        {
            title: "name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_: any, device: model.Device) => (
                <Space size="middle">
                    <a
                        onClick={() =>
                            navigate(`/flow/devices/${device.uuid}`, { // opens all points for a device
                                state: {connUUID: connUUID, hostUUID: hostUUID, networkUUID: networkUUID, deviceUUID: device.uuid},
                            })
                        }
                    >
                        View
                    </a>
                    <a
                        onClick={() => {
                            // showModal(network);
                        }}
                    >
                        Edit
                    </a>
                    <a
                        onClick={() => {
                            // deleteNetwork(network.uuid);
                        }}
                    >
                        Delete
                    </a>
                </Space>
            ),
        },
    ];

    return (
        <Table
            rowKey="uuid"
            dataSource={data}
            columns={columns}
            loading={{indicator: <Spin/>, spinning: isFetching}}
        />
    );
};
