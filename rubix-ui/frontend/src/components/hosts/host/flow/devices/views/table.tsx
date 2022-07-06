import {Button, Space, Spin, Table} from "antd";
import {model} from "../../../../../../../wailsjs/go/models";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {FlowNetworkFactory} from "../../networks/factory";
import {FlowPointFactory} from "../../points/factory";
import {DeleteOutlined} from "@ant-design/icons";

export const FlowDeviceTable = (props: any) => {
    const {data, isFetching, connUUID, hostUUID, networkUUID} = props;
    const navigate = useNavigate();
    const [selectedUUIDs, setSelectedUUIDs] = useState([] as string[]);
    let flowPointFactory = new FlowPointFactory();

    const bulkDelete = async () => {
        flowPointFactory.connectionUUID = connUUID;
        flowPointFactory.hostUUID = hostUUID;
        // flowPointFactory.BulkDelete(selectedUUIDs);
    };

    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            setSelectedUUIDs(selectedRowKeys)
        },
    };

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
                </Space>
            ),
        },
    ];

    return (
        <>
            {/*<h3> DEVICES </h3>*/}
            <Button
                type="primary"
                danger
                onClick={bulkDelete}
                style={{ margin: "5px", float: "right" }}
            >
                <DeleteOutlined /> Delete
            </Button>
        <Table
            rowKey="uuid"
            rowSelection={rowSelection}
            dataSource={data}
            columns={columns}
            loading={{indicator: <Spin/>, spinning: isFetching}}
        />
        </>
    );
};
