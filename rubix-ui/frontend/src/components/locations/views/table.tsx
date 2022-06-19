import {useNavigate} from "react-router-dom";
import {Space, Spin, Table} from "antd";
import {DeleteLocation} from "../../../../wailsjs/go/main/App";
import {model} from "../../../../wailsjs/go/models";
import Location = model.Location;

export const LocationsTable = (props: any) => {
    const {
        locations,
        updateLocations,
        showModal,
        isFetching,
        setIsFetching,
        connUUID,
    } = props;
    if (!locations) return <></>;

    const navigate = useNavigate();

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
            title: "Networks number",
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
                            showModal(location);
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

    const deleteLocation = async (uuid: string) => {
        await DeleteLocation(connUUID, uuid);
        const newLocations = locations.filter((n: Location) => n.uuid !== uuid);
        updateLocations(newLocations);
        setIsFetching(true);
    };

    return (
        <div>
            <Table
                rowKey="uuid"
                dataSource={locations}
                columns={columns}
                loading={{ indicator: <Spin />, spinning: isFetching }}
            />
        </div>
    );
};