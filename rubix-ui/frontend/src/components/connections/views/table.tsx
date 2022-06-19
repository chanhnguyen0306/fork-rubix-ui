import {useNavigate} from "react-router-dom";
import {Space, Spin, Table} from "antd";
import {DeleteConnection} from "../../../../wailsjs/go/main/App";
import {storage} from "../../../../wailsjs/go/models";
import RubixConnection = storage.RubixConnection;

export const ConnectionsTable = (props: any) => {
    const {
        connections,
        updateConnections,
        showModal,
        isFetching,
        setIsFetching,
    } = props;
    if (!connections) return <></>;

    const navigate = useNavigate();

    const columns = [
        {
            title: "uuid",
            dataIndex: "uuid",
            key: "uuid",
        },
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
            title: "Address",
            dataIndex: "ip",
            key: "ip",
        },
        {
            title: "Port",
            dataIndex: "port",
            key: "port",
        },
        // {
        //   title: "Locations",
        //   dataIndex: "locations",
        //   key: "locations",
        //   render: (locations: []) => <a>{locations ? locations.length : 0}</a>,
        // },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_: any, conn: RubixConnection) => (
                <Space size="middle">
                    <a onClick={() => navigate(`locations/${conn.uuid}`)}>View</a>
                    <a
                        onClick={() => {
                            showModal(conn);
                        }}
                    >
                        Edit
                    </a>
                    <a
                        onClick={() => {
                            deleteConnection(conn.uuid);
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
            (c: RubixConnection) => c.uuid !== uuid
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
